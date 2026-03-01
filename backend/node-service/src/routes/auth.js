const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const prisma = require("../utils/prisma");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CANDIDATE", "RECRUITER"], {
    errorMap: () => ({ message: "Role must be CANDIDATE or RECRUITER" }),
  }),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── POST /auth/signup ───
router.post(
  "/signup",
  catchAsync(async (req, res) => {
    const data = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email: data.email, passwordHash, role: data.role },
      });

      if (data.role === "CANDIDATE") {
        await tx.candidateProfile.create({ data: { userId: newUser.id } });
      } else {
        await tx.recruiterProfile.create({ data: { userId: newUser.id } });
      }

      return newUser;
    });

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  }),
);

// ─── POST /auth/login ───
router.post(
  "/login",
  catchAsync(async (req, res) => {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new ApiError(401, "Invalid email or password.");

    const validPassword = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!validPassword) throw new ApiError(401, "Invalid email or password.");

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  }),
);

// ─── DELETE /auth/account ───
router.delete(
  "/account",
  require("../middleware/auth").authenticate,
  catchAsync(async (req, res) => {
    const userId = req.user.id;

    // Delete user — cascading deletes handle profile, skills, applications, etc.
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Account deleted successfully." });
  }),
);

module.exports = router;

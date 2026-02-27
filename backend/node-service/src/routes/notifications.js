const express = require("express");
const { z } = require("zod");
const prisma = require("../utils/prisma");
const { authenticate, requireRole } = require("../middleware/auth");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

const notifySchema = z.object({
  message: z.string().min(1, "Message is required").max(500),
});

// ─── POST /notifications/notify/:candidateId/:postingId ───
router.post(
  "/notify/:candidateId/:postingId",
  authenticate,
  requireRole("RECRUITER"),
  catchAsync(async (req, res) => {
    const { candidateId, postingId } = req.params;
    const data = notifySchema.parse(req.body);

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: req.user.id },
    });
    const posting = await prisma.posting.findUnique({
      where: { id: postingId },
    });
    if (!posting) throw new ApiError(404, "Posting not found.");
    if (posting.recruiterId !== recruiterProfile.id)
      throw new ApiError(403, "You can only notify for your own postings.");

    const candidate = await prisma.candidateProfile.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) throw new ApiError(404, "Candidate not found.");

    const notification = await prisma.notification.create({
      data: { userId: candidate.userId, postingId, message: data.message },
    });

    res.status(201).json({ message: "Notification sent.", notification });
  }),
);

// ─── GET /notifications/mine ───
router.get(
  "/mine",
  authenticate,
  catchAsync(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { posting: { select: { id: true, title: true } } },
    });

    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ unreadCount, total: notifications.length, notifications });
  }),
);

// ─── PUT /notifications/:id/read ───
router.put(
  "/:id/read",
  authenticate,
  catchAsync(async (req, res) => {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!notification) throw new ApiError(404, "Notification not found.");
    if (notification.userId !== req.user.id)
      throw new ApiError(
        403,
        "You can only mark your own notifications as read.",
      );

    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json({ message: "Notification marked as read." });
  }),
);

module.exports = router;

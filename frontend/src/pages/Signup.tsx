import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, Users, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const [step, setStep] = useState<"role" | "form">("role");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    try {
      setLoading(true);
      await signup(fullName, email, password, userType as "candidate" | "recruiter");
      toast.success("Account created successfully!");
      if (userType === "candidate") navigate("/onboarding/candidate");
      else navigate("/onboarding/recruiter");
    } catch (err: any) {
      if (err?.response?.status === 409) setError("USER_EXISTS");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 1: Role selection ── */
  if (step === "role") {
    return (
      <div className="min-h-screen bg-retro-beige paper-texture flex items-center justify-center p-4">
        <Link to="/" className="back-btn-fixed">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <div className="w-full max-w-lg space-y-8 animate-fade-in text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
          <h1 className="text-3xl font-heading font-bold text-retro-charcoal">Join SkillBridge</h1>
          <p className="text-sm text-retro-brown">Choose your role to get started</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            <button
              onClick={() => { setUserType("candidate"); setStep("form"); }}
              className="polished-card p-8 text-center space-y-4 cursor-pointer"
            >
              <div className="h-14 w-14 rounded-2xl bg-retro-olive flex items-center justify-center mx-auto">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-retro-charcoal">Candidate</h3>
              <p className="text-sm text-retro-brown">Find internships & projects that match your skills</p>
            </button>

            <button
              onClick={() => { setUserType("recruiter"); setStep("form"); }}
              className="polished-card p-8 text-center space-y-4 cursor-pointer"
            >
              <div className="h-14 w-14 rounded-2xl bg-retro-gold flex items-center justify-center mx-auto">
                <Briefcase className="h-7 w-7 text-retro-charcoal" />
              </div>
              <h3 className="font-heading font-bold text-retro-charcoal">Recruiter</h3>
              <p className="text-sm text-retro-brown">Post openings & find the best-matched candidates</p>
            </button>
          </div>

          <p className="text-sm text-retro-brown pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-retro-charcoal font-bold underline underline-offset-4 hover:text-retro-olive transition-colors">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── Step 2: Signup form ── */
  return (
    <div className="min-h-screen bg-retro-beige paper-texture flex items-center justify-center p-4">
      <Link to="/" className="back-btn-fixed">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6"><Logo /></div>
          <h1 className="text-3xl font-heading font-bold text-retro-charcoal">Create Account</h1>
          <p className="text-sm text-retro-brown mt-2">
            Signing up as <button onClick={() => setStep("role")} className="font-bold text-retro-charcoal underline underline-offset-4 hover:text-retro-olive capitalize">{userType}</button>
          </p>
        </div>

        <form onSubmit={handleSignup} className="polished-card-static p-8 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className="text-xs font-semibold text-retro-charcoal uppercase tracking-wider">Full Name</label>
            <Input id="signup-name" required placeholder="John Doe" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-polished h-11" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="text-xs font-semibold text-retro-charcoal uppercase tracking-wider">Email</label>
            <Input id="signup-email" type="email" required placeholder="you@example.com" autoComplete="email" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} className="input-polished h-11" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="signup-password" className="text-xs font-semibold text-retro-charcoal uppercase tracking-wider">Password</label>
            <Input id="signup-password" type="password" required placeholder="••••••••" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-polished h-11" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="signup-confirm-password" className="text-xs font-semibold text-retro-charcoal uppercase tracking-wider">Confirm Password</label>
            <Input id="signup-confirm-password" type="password" required placeholder="••••••••" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-polished h-11" />
          </div>

          {error && error !== "USER_EXISTS" && <p className="text-sm text-retro-orange font-medium">{error}</p>}
          {error === "USER_EXISTS" && (
            <p className="text-sm text-retro-orange font-medium">
              User already exists — <Link to="/login" className="text-retro-charcoal font-bold underline">login here</Link>.
            </p>
          )}

          <Button type="submit" className="w-full btn-primary rounded-xl h-11 text-base" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating…</> : "Sign Up"}
          </Button>

          <div className="divider-ornament">or</div>

          <p className="text-center text-sm text-retro-brown">
            Already have an account?{" "}
            <Link to="/login" className="text-retro-charcoal font-bold underline underline-offset-4 hover:text-retro-olive transition-colors">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

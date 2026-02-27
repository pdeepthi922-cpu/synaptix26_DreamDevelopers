import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back!");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.userType === "candidate") navigate("/dashboard/candidate");
      else if (storedUser.userType === "recruiter") navigate("/dashboard/recruiter");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-beige paper-texture flex items-center justify-center p-4">
      {/* Fixed back button */}
      <Link to="/" className="back-btn-fixed">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6"><Logo /></div>
          <h1 className="text-3xl font-heading font-bold text-retro-charcoal">Welcome Back</h1>
          <p className="text-sm text-retro-brown mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="polished-card-static p-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-xs font-semibold text-retro-charcoal uppercase tracking-wider">Email</label>
            <Input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} required className="input-polished h-11" />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="text-xs font-semibold text-retro-charcoal uppercase tracking-wider">Password</label>
            <Input id="login-password" type="password" placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-polished h-11" />
          </div>

          {error && <p className="text-sm text-retro-orange font-medium">{error}</p>}

          <Button type="submit" className="w-full btn-primary rounded-xl h-11 text-base" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in…</> : "Login"}
          </Button>

          <div className="divider-ornament">or</div>

          <p className="text-center text-sm text-retro-brown">
            Don&rsquo;t have an account?{" "}
            <Link to="/signup" className="text-retro-charcoal font-bold underline underline-offset-4 hover:text-retro-olive transition-colors">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

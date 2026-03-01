import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated && user) {
    const dashPath =
      user.userType === "recruiter"
        ? "/dashboard/recruiter"
        : "/dashboard/candidate";
    return <Navigate to={dashPath} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const stored = localStorage.getItem("user");
      const u = stored ? JSON.parse(stored) : null;
      if (u?.userType === "recruiter") {
        navigate("/dashboard/recruiter");
      } else {
        navigate("/dashboard/candidate");
      }
      toast.success("Welcome back!");
    } catch (err: any) {
      const msg =
        err.response?.data?.error || "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-beige paper-texture flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold font-heading text-retro-charcoal">
            Welcome Back
          </h1>
          <p className="text-retro-brown text-sm mt-1">
            Sign in to your account
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="polished-card-static p-8 space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-retro-charcoal"
            >
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-retro-charcoal"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full btn-gold rounded-xl"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-center text-sm text-retro-brown">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-retro-olive font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

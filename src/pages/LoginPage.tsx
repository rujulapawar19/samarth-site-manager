import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const err = login(email, password);
    if (err) setError(err);
    else navigate("/dashboard");
  };

  const fillCredentials = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">SiteSync</h1>
          <p className="text-primary-foreground/60 text-xs mt-0.5">Smart Construction Management</p>
          <p className="text-primary-foreground/40 text-[10px] mt-0.5">Samarth Developers — Nashik</p>
        </div>

        <Card className="p-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10">
              Login
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-2">Demo Credentials</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillCredentials("manager@samarth.com", "Samarth@123")}
                className="w-full text-left p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="text-xs font-medium text-foreground">👔 Manager — Full Access</p>
                <p className="text-[10px] text-muted-foreground">manager@samarth.com / Samarth@123</p>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("supervisor@samarth.com", "Site@123")}
                className="w-full text-left p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="text-xs font-medium text-foreground">🔧 Supervisor — Site Access</p>
                <p className="text-[10px] text-muted-foreground">supervisor@samarth.com / Site@123</p>
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground mt-4">v2.1 — March 2026</p>
        </Card>
      </div>
    </div>
  );
}

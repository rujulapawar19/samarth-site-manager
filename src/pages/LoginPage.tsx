import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Shield, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleLogin = () => {
    if (selectedRole) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground">SiteSync</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Smart Construction Management</p>
          <p className="text-primary-foreground/40 text-xs mt-0.5">Samarth Developers — Nashik</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-4">Select your role to continue</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSelectedRole("manager")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedRole === "manager"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <Shield className={`w-8 h-8 ${selectedRole === "manager" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Manager</span>
              <span className="text-[10px] text-muted-foreground">Full Access</span>
            </button>
            <button
              onClick={() => setSelectedRole("supervisor")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedRole === "supervisor"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <HardHat className={`w-8 h-8 ${selectedRole === "supervisor" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Supervisor</span>
              <span className="text-[10px] text-muted-foreground">Site Access</span>
            </button>
          </div>

          <Button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
          >
            Continue
          </Button>

          <p className="text-center text-[10px] text-muted-foreground mt-4">
            v2.1 — March 2026
          </p>
        </div>
      </div>
    </div>
  );
}

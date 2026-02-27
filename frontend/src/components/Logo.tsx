import { Sparkles } from "lucide-react";

const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
      <Sparkles className="h-5 w-5 text-primary-foreground" />
    </div>
    {!collapsed && <span className="text-lg font-bold font-heading">SkillBridge</span>}
  </div>
);

export default Logo;

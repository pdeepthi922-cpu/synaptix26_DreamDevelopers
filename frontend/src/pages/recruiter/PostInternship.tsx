import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface SkillWeight { name: string; weight: string }

const PostInternship = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState<SkillWeight[]>([{ name: "", weight: "" }]);
    const [remote, setRemote] = useState(true);

    const addSkill = () => setSkills([...skills, { name: "", weight: "" }]);
    const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Internship posted successfully!");
        navigate("/dashboard/recruiter");
    };

    return (
        <DashboardLayout role="recruiter">
            <div className="max-w-2xl animate-fade-in space-y-6">
                <Link to="/dashboard/recruiter" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold font-heading">Post New Internship</h1>

                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
                    <div className="space-y-1"><label className="text-sm font-medium">Internship Name</label><Input required placeholder="e.g., Frontend Developer Intern" /></div>
                    <div className="space-y-1"><label className="text-sm font-medium">Description</label><Textarea required placeholder="Describe the internship role..." rows={4} /></div>

                    {/* Dynamic skill + weight */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Required Skills</label>
                            <Button type="button" variant="outline" size="sm" onClick={addSkill} className="gap-1"><Plus className="h-3 w-3" /> Add Skill</Button>
                        </div>
                        {skills.map((s, i) => (
                            <div key={i} className="flex gap-3 items-end">
                                <div className="flex-1 space-y-1">
                                    <Input placeholder="Skill Name" value={s.name} onChange={(e) => { const n = [...skills]; n[i].name = e.target.value; setSkills(n); }} />
                                </div>
                                <div className="w-32 space-y-1">
                                    <Select value={s.weight} onValueChange={(v) => { const n = [...skills]; n[i].weight = v; setSkills(n); }}>
                                        <SelectTrigger><SelectValue placeholder="Weight" /></SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((v) => <SelectItem key={v} value={String(v)}>Weight {v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {skills.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(i)} className="text-destructive shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-sm font-medium">Stipend</label><Input required placeholder="$1,200/mo" /></div>
                        <div className="space-y-1"><label className="text-sm font-medium">Duration</label><Input required placeholder="3 months" /></div>
                    </div>

                    <div className="space-y-1"><label className="text-sm font-medium">Application Deadline</label><Input type="date" required /></div>

                    <div className="flex items-center gap-3">
                        <Switch checked={remote} onCheckedChange={setRemote} />
                        <label className="text-sm font-medium">{remote ? "Remote" : "On-site"}</label>
                    </div>

                    <Button type="submit" className="w-full" size="lg">Post Internship</Button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default PostInternship;

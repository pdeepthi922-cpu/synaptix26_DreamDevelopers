import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "sonner";
import { Users, BarChart3, Pencil, Trash2, ArrowLeft, Plus, Bell } from "lucide-react";

const rankingCandidates = [
  { name: "Alice Johnson", score: 91, applied: true },
  { name: "Bob Smith", score: 72, applied: false },
  { name: "Sarah L.", score: 68, applied: true },
  { name: "Mike R.", score: 55, applied: false },
  { name: "Emma W.", score: 45, applied: false },
];

const appliedCandidates = [
  { name: "Alice Johnson", score: 91, appliedDate: "Mar 1, 2026" },
  { name: "Sarah L.", score: 68, appliedDate: "Mar 3, 2026" },
];

interface SkillWeight { name: string; weight: string }

const ManageInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<"details" | "ranking" | "applied" | "edit">("details");
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Edit form state
  const [skills, setSkills] = useState<SkillWeight[]>([
    { name: "React", weight: "5" }, { name: "TypeScript", weight: "4" },
    { name: "CSS", weight: "3" }, { name: "Git", weight: "2" },
  ]);
  const [remote, setRemote] = useState(true);
  const addSkill = () => setSkills([...skills, { name: "", weight: "" }]);
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

  const handleDelete = () => {
    toast.success("Internship deleted successfully.");
    navigate("/dashboard/recruiter");
  };

  const handleNotify = (name: string) => {
    toast.success(`Notification sent to ${name}!`);
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="max-w-3xl animate-fade-in space-y-6">
        <Link to="/dashboard/recruiter" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold font-heading">Frontend Developer Intern</h1>
          <div className="flex gap-2 flex-wrap">
            <Button variant={view === "ranking" ? "default" : "outline"} size="sm" className="gap-1" onClick={() => setView("ranking")}>
              <BarChart3 className="h-3 w-3" /> View Ranking
            </Button>
            <Button variant={view === "applied" ? "default" : "outline"} size="sm" className="gap-1" onClick={() => setView("applied")}>
              <Users className="h-3 w-3" /> Applied Candidates
            </Button>
            <Button variant={view === "edit" ? "default" : "outline"} size="sm" className="gap-1" onClick={() => setView("edit")}>
              <Pencil className="h-3 w-3" /> Edit Details
            </Button>
            <Button variant="destructive" size="sm" className="gap-1" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
        </div>

        {/* Details view */}
        {view === "details" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <p className="text-sm">Join our frontend team to build responsive, accessible web applications using React and TypeScript.</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => <Badge key={s.name} variant="secondary">{s.name} (w:{s.weight})</Badge>)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-muted-foreground">Stipend:</span> <strong>$1,200/mo</strong></div>
              <div><span className="text-muted-foreground">Duration:</span> <strong>3 months</strong></div>
              <div><span className="text-muted-foreground">Deadline:</span> <strong>April 15, 2026</strong></div>
              <div><span className="text-muted-foreground">Location:</span> <strong>Remote</strong></div>
            </div>
          </div>
        )}

        {/* Ranking view */}
        {view === "ranking" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold font-heading text-lg">Candidate Rankings (by Match Score)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-semibold">Rank</th>
                    <th className="text-left py-2 font-semibold">Candidate Name</th>
                    <th className="text-center py-2 font-semibold">Score</th>
                    <th className="text-center py-2 font-semibold">Applied?</th>
                    <th className="text-center py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingCandidates.map((c, i) => (
                    <tr key={c.name} className="border-b border-border/50">
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2">{c.name}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.score >= 80 ? "bg-success text-success-foreground" : c.score >= 50 ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>
                          {c.score}%
                        </span>
                      </td>
                      <td className="py-2 text-center">{c.applied ? "Yes" : "No"}</td>
                      <td className="py-2 text-center">
                        {!c.applied ? (
                          <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => handleNotify(c.name)}>
                            <Bell className="h-3 w-3" /> Notify
                          </Button>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applied view */}
        {view === "applied" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold font-heading text-lg">Applied Candidates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-semibold">Candidate Name</th>
                    <th className="text-center py-2 font-semibold">Score</th>
                    <th className="text-center py-2 font-semibold">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedCandidates.map((c) => (
                    <tr key={c.name} className="border-b border-border/50">
                      <td className="py-2">{c.name}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.score >= 80 ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>
                          {c.score}%
                        </span>
                      </td>
                      <td className="py-2 text-center">{c.appliedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit view */}
        {view === "edit" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <div className="space-y-1"><label className="text-sm font-medium">Internship Name</label><Input defaultValue="Frontend Developer Intern" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Description</label><Textarea defaultValue="Join our frontend team to build responsive, accessible web applications..." rows={3} /></div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Required Skills</label>
                <Button type="button" variant="outline" size="sm" onClick={addSkill} className="gap-1"><Plus className="h-3 w-3" /> Add</Button>
              </div>
              {skills.map((s, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="flex-1"><Input value={s.name} onChange={(e) => { const n = [...skills]; n[i].name = e.target.value; setSkills(n); }} /></div>
                  <div className="w-32">
                    <Select value={s.weight} onValueChange={(v) => { const n = [...skills]; n[i].weight = v; setSkills(n); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{[1, 2, 3, 4, 5].map((v) => <SelectItem key={v} value={String(v)}>Weight {v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {skills.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(i)} className="text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-medium">Stipend</label><Input defaultValue="$1,200/mo" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Duration</label><Input defaultValue="3 months" /></div>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Application Deadline</label><Input type="date" defaultValue="2026-04-15" /></div>
            <div className="flex items-center gap-3">
              <Switch checked={remote} onCheckedChange={setRemote} />
              <label className="text-sm font-medium">{remote ? "Remote" : "On-site"}</label>
            </div>
            <Button onClick={() => { toast.success("Changes saved!"); setView("details"); }}>Save Changes</Button>
          </div>
        )}

        <ConfirmationModal
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Internship"
          description="Are you sure you want to delete this internship? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManageInternship;

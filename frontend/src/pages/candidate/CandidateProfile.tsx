import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, ArrowLeft, Trash } from "lucide-react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useAuth } from "@/contexts/AuthContext";

const proficiencyLabels: Record<string, string> = {
    "1": "Beginner",
    "2": "Basic",
    "3": "Intermediate",
    "4": "Advanced",
    "5": "Expert",
};

const CandidateProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [personal, setPersonal] = useState({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "555-0123",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/johndoe",
    });

    const [skills, setSkills] = useState([
        { name: "React", proficiency: "4" },
        { name: "TypeScript", proficiency: "3" },
        { name: "Python", proficiency: "3" },
        { name: "SQL", proficiency: "2" },
    ]);

    const [projects, setProjects] = useState([
        { name: "E-Commerce App", description: "Built a full-stack e-commerce platform with React and Node.js", skillsUsed: "React, Node.js, SQL", role: "Full-Stack Developer" },
    ]);

    const [experiences, setExperiences] = useState([
        { company: "TechStartup Inc.", type: "internship", role: "Frontend Developer", duration: "3 months" },
    ]);

    const handleSave = () => {
        setEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleDeleteAccount = () => {
        toast.success("Account deleted successfully.");
        logout();
        navigate("/");
    };

    return (
        <DashboardLayout role="candidate">
            <div className="max-w-3xl animate-fade-in space-y-6">
                <Link to="/dashboard/candidate" className="inline-flex items-center gap-1 text-sm text-retro-brown hover:text-retro-charcoal font-medium transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold font-heading">My Profile</h1>
                    {!editing ? (
                        <Button onClick={() => setEditing(true)} className="gap-2"><Pencil className="h-4 w-4" /> Edit</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    )}
                </div>

                {/* Personal Details */}
                <div className="polished-card-static p-6 space-y-4">
                    <h2 className="font-semibold font-heading text-lg">Personal Details</h2>
                    {editing ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-sm font-medium">Full Name</label><Input value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })} /></div>
                                <div className="space-y-1"><label className="text-sm font-medium">Email</label><Input type="email" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-sm font-medium">Phone</label><Input value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} /></div>
                                <div className="space-y-1"><label className="text-sm font-medium">Location</label><Input value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} /></div>
                            </div>
                            <div className="space-y-1"><label className="text-sm font-medium">LinkedIn URL</label><Input value={personal.linkedin} onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })} /></div>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground">Full Name:</span> <strong>{personal.fullName}</strong></div>
                            <div><span className="text-muted-foreground">Email:</span> <strong>{personal.email}</strong></div>
                            <div><span className="text-muted-foreground">Phone:</span> <strong>{personal.phone}</strong></div>
                            <div><span className="text-muted-foreground">Location:</span> <strong>{personal.location}</strong></div>
                            <div className="col-span-2"><span className="text-muted-foreground">LinkedIn:</span> <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">{personal.linkedin}</a></div>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className="polished-card-static p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold font-heading text-lg">Technical Skills</h2>
                        {editing && <Button type="button" variant="outline" size="sm" onClick={() => setSkills([...skills, { name: "", proficiency: "" }])} className="gap-1"><Plus className="h-3 w-3" /> Add</Button>}
                    </div>
                    {editing ? (
                        skills.map((s, i) => (
                            <div key={i} className="flex gap-3 items-end">
                                <div className="flex-1 space-y-1"><label className="text-sm font-medium">Skill</label><Input value={s.name} onChange={(e) => { const n = [...skills]; n[i].name = e.target.value; setSkills(n); }} /></div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-sm font-medium">Proficiency</label>
                                    <Select value={s.proficiency} onValueChange={(v) => { const n = [...skills]; n[i].proficiency = v; setSkills(n); }}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Beginner</SelectItem>
                                            <SelectItem value="2">2 - Basic</SelectItem>
                                            <SelectItem value="3">3 - Intermediate</SelectItem>
                                            <SelectItem value="4">4 - Advanced</SelectItem>
                                            <SelectItem value="5">5 - Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {skills.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((s) => (
                                <Badge key={s.name} variant="secondary" className="text-sm px-3 py-1">
                                    {s.name} <span className="ml-1 text-muted-foreground">({proficiencyLabels[s.proficiency] || `Level ${s.proficiency}`})</span>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div className="polished-card-static p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold font-heading text-lg">Projects</h2>
                        {editing && <Button type="button" variant="outline" size="sm" onClick={() => setProjects([...projects, { name: "", description: "", skillsUsed: "", role: "" }])} className="gap-1"><Plus className="h-3 w-3" /> Add</Button>}
                    </div>
                    {editing ? (
                        projects.map((p, i) => (
                            <div key={i} className="space-y-2 p-4 bg-background rounded-lg border border-border">
                                <div className="flex justify-between"><span className="text-sm font-medium">Project {i + 1}</span>{projects.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setProjects(projects.filter((_, idx) => idx !== i))} className="text-destructive h-6 w-6"><Trash2 className="h-3 w-3" /></Button>}</div>
                                <Input placeholder="Name" value={p.name} onChange={(e) => { const n = [...projects]; n[i].name = e.target.value; setProjects(n); }} />
                                <Textarea placeholder="Description" rows={2} value={p.description} onChange={(e) => { const n = [...projects]; n[i].description = e.target.value; setProjects(n); }} />
                                <Input placeholder="Skills Used" value={p.skillsUsed} onChange={(e) => { const n = [...projects]; n[i].skillsUsed = e.target.value; setProjects(n); }} />
                                <Input placeholder="Your Role" value={p.role} onChange={(e) => { const n = [...projects]; n[i].role = e.target.value; setProjects(n); }} />
                            </div>
                        ))
                    ) : (
                        projects.map((p, i) => (
                            <div key={i} className="p-4 bg-background rounded-lg border border-border space-y-1">
                                <h3 className="font-semibold text-sm">{p.name}</h3>
                                <p className="text-sm text-muted-foreground">{p.description}</p>
                                <p className="text-xs"><span className="text-muted-foreground">Skills:</span> {p.skillsUsed}</p>
                                <p className="text-xs"><span className="text-muted-foreground">Role:</span> {p.role}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Experience */}
                <div className="polished-card-static p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold font-heading text-lg">Experience</h2>
                        {editing && <Button type="button" variant="outline" size="sm" onClick={() => setExperiences([...experiences, { company: "", type: "", role: "", duration: "" }])} className="gap-1"><Plus className="h-3 w-3" /> Add</Button>}
                    </div>
                    {editing ? (
                        experiences.map((exp, i) => (
                            <div key={i} className="space-y-2 p-4 bg-background rounded-lg border border-border">
                                <div className="flex justify-between"><span className="text-sm font-medium">Experience {i + 1}</span>{experiences.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))} className="text-destructive h-6 w-6"><Trash2 className="h-3 w-3" /></Button>}</div>
                                <Input placeholder="Company Name" value={exp.company} onChange={(e) => { const n = [...experiences]; n[i].company = e.target.value; setExperiences(n); }} />
                                <Select value={exp.type} onValueChange={(v) => { const n = [...experiences]; n[i].type = v; setExperiences(n); }}>
                                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                    <SelectContent><SelectItem value="internship">Internship</SelectItem><SelectItem value="job">Job</SelectItem></SelectContent>
                                </Select>
                                <Input placeholder="Role" value={exp.role} onChange={(e) => { const n = [...experiences]; n[i].role = e.target.value; setExperiences(n); }} />
                                <Input placeholder="Duration" value={exp.duration} onChange={(e) => { const n = [...experiences]; n[i].duration = e.target.value; setExperiences(n); }} />
                            </div>
                        ))
                    ) : (
                        experiences.map((exp, i) => (
                            <div key={i} className="p-4 bg-background rounded-lg border border-border space-y-1">
                                <h3 className="font-semibold text-sm">{exp.role} at {exp.company}</h3>
                                <p className="text-xs text-muted-foreground capitalize">{exp.type} • {exp.duration}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Delete Account */}
                <div className="polished-card-static border-retro-orange/20 p-6 space-y-3">
                    <h2 className="font-semibold font-heading text-lg text-retro-orange">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <Button variant="destructive" className="gap-2 bg-retro-orange hover:bg-retro-orange/90 rounded-xl" onClick={() => setDeleteOpen(true)}>
                        <Trash className="h-4 w-4" /> Delete Account
                    </Button>
                </div>

                <ConfirmationModal
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    title="Delete Account"
                    description="Are you sure you want to permanently delete your account? All your data, applications, and profile information will be lost forever."
                    confirmLabel="Delete My Account"
                    onConfirm={handleDeleteAccount}
                />
            </div>
        </DashboardLayout>
    );
};

export default CandidateProfile;

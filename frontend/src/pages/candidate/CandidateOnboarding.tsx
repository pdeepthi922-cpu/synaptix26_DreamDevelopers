import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { Plus, Trash2, FileText, PenLine, Upload, FileCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Skill { name: string; proficiency: string }
interface Project { name: string; description: string; skillsUsed: string; role: string }
interface Experience { company: string; type: string; role: string; duration: string }

const steps = ["Personal Details", "Technical Skills", "Project Details", "Experience"];

const CandidateOnboarding = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mode selection
    const [mode, setMode] = useState<"select" | "manual" | "resume">("select");
    const [currentStep, setCurrentStep] = useState(0);

    // Resume
    const [uploaded, setUploaded] = useState(false);
    const [fileName, setFileName] = useState("");

    // Step 1 — Personal
    const [personal, setPersonal] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: "",
        location: "",
        linkedin: "",
    });

    // Step 2 — Skills
    const [skills, setSkills] = useState<Skill[]>([{ name: "", proficiency: "" }]);

    // Step 3 — Projects
    const [projects, setProjects] = useState<Project[]>([{ name: "", description: "", skillsUsed: "", role: "" }]);

    // Step 4 — Experience
    const [experiences, setExperiences] = useState<Experience[]>([{ company: "", type: "", role: "", duration: "" }]);

    const addSkill = () => setSkills([...skills, { name: "", proficiency: "" }]);
    const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
    const addProject = () => setProjects([...projects, { name: "", description: "", skillsUsed: "", role: "" }]);
    const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
    const addExperience = () => setExperiences([...experiences, { company: "", type: "", role: "", duration: "" }]);
    const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setUploaded(true);
            // Mock AI extraction — auto-populate skills
            setSkills([
                { name: "React", proficiency: "4" },
                { name: "TypeScript", proficiency: "3" },
                { name: "Python", proficiency: "3" },
                { name: "SQL", proficiency: "2" },
            ]);
            setPersonal((p) => ({ ...p, phone: "555-0123", location: "San Francisco, CA" }));
            toast.success("Resume parsed! Review and edit your details below.");
            setMode("manual");
        }
    };

    const handleFinish = () => {
        toast.success("Profile setup complete!");
        navigate("/dashboard/candidate");
    };

    // Mode selection screen
    if (mode === "select") {
        return (
            <div className="min-h-screen bg-retro-beige paper-texture flex items-center justify-center p-4">
                <div className="w-full max-w-lg space-y-8 animate-fade-in text-center">
                    <div className="flex justify-center mb-6"><Logo /></div>
                    <h1 className="text-2xl font-bold font-heading">Set Up Your Profile</h1>
                    <p className="text-muted-foreground">Choose how you'd like to add your details</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        <button
                            onClick={() => setMode("manual")}
                            className="group p-8 polished-card text-center space-y-4 cursor-pointer"
                        >
                            <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <PenLine className="h-7 w-7" />
                            </div>
                            <h3 className="font-semibold font-heading">Enter Manually</h3>
                            <p className="text-sm text-muted-foreground">Fill in your skills, projects, and experience step by step</p>
                        </button>

                        <button
                            onClick={() => setMode("resume")}
                            className="group p-8 polished-card text-center space-y-4 cursor-pointer"
                        >
                            <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <FileText className="h-7 w-7" />
                            </div>
                            <h3 className="font-semibold font-heading">Upload Resume</h3>
                            <p className="text-sm text-muted-foreground">Let AI extract your skills and experience automatically</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Resume upload screen
    if (mode === "resume" && !uploaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-lg space-y-8 animate-fade-in">
                    <div className="text-center">
                        <div className="flex justify-center mb-6"><Logo /></div>
                        <h1 className="text-2xl font-bold font-heading">Upload Your Resume</h1>
                        <p className="text-sm text-muted-foreground mt-1">PDF only — we'll extract your details automatically</p>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    <div
                        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer bg-card"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="font-medium">Drop your resume here or click to upload</p>
                        <p className="text-sm text-muted-foreground mt-1">PDF only (max 10MB)</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setMode("select")}>Back</Button>
                </div>
            </div>
        );
    }

    // Multi-step form
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                <div className="flex justify-center mb-4"><Logo /></div>
                <h1 className="text-2xl font-bold font-heading text-center">Complete Your Profile</h1>

                {/* Progress stepper */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold transition-colors ${i < currentStep ? "bg-success text-success-foreground" :
                                i === currentStep ? "gradient-primary text-primary-foreground" :
                                    "bg-muted text-muted-foreground"
                                }`}>
                                {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            {!false && <span className={`text-xs hidden sm:inline ${i === currentStep ? "font-semibold" : "text-muted-foreground"}`}>{step}</span>}
                            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStep ? "bg-success" : "bg-border"}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1 — Personal Details */}
                {currentStep === 0 && (
                    <div className="polished-card-static p-6 space-y-4">
                        <h2 className="font-semibold font-heading text-lg">Personal Details</h2>
                        <div className="space-y-1"><label className="text-sm font-medium">Full Name *</label><Input required value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-sm font-medium">Email *</label><Input type="email" required value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-sm font-medium">Phone *</label><Input type="tel" required value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-sm font-medium">Location *</label><Input placeholder="City, State" required value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} /></div>
                        <div className="space-y-1"><label className="text-sm font-medium">LinkedIn URL</label><Input placeholder="https://linkedin.com/in/..." value={personal.linkedin} onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })} /></div>
                        <Button className="w-full" onClick={() => setCurrentStep(1)}>Next</Button>
                    </div>
                )}

                {/* Step 2 — Technical Skills */}
                {currentStep === 1 && (
                    <div className="polished-card-static p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold font-heading text-lg">Technical Skills</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addSkill} className="gap-1"><Plus className="h-3 w-3" /> Add Skill</Button>
                        </div>
                        {skills.map((s, i) => (
                            <div key={i} className="flex gap-3 items-end">
                                <div className="flex-1 space-y-1">
                                    <label className="text-sm font-medium">Skill Name</label>
                                    <Input placeholder="e.g., React" value={s.name} onChange={(e) => { const n = [...skills]; n[i].name = e.target.value; setSkills(n); }} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-sm font-medium">Proficiency</label>
                                    <Select value={s.proficiency} onValueChange={(v) => { const n = [...skills]; n[i].proficiency = v; setSkills(n); }}>
                                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Beginner</SelectItem>
                                            <SelectItem value="2">2 - Basic</SelectItem>
                                            <SelectItem value="3">3 - Intermediate</SelectItem>
                                            <SelectItem value="4">4 - Advanced</SelectItem>
                                            <SelectItem value="5">5 - Expert</SelectItem>
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
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(0)}>Back</Button>
                            <Button className="flex-1" onClick={() => setCurrentStep(2)}>Next</Button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Projects */}
                {currentStep === 2 && (
                    <div className="polished-card-static p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold font-heading text-lg">Project Details <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
                            <Button type="button" variant="outline" size="sm" onClick={addProject} className="gap-1"><Plus className="h-3 w-3" /> Add Project</Button>
                        </div>
                        {projects.map((p, i) => (
                            <div key={i} className="space-y-3 p-4 bg-background rounded-lg border border-border">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Project {i + 1}</span>
                                    {projects.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeProject(i)} className="text-destructive h-6 w-6">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                <Input placeholder="Project Name" value={p.name} onChange={(e) => { const n = [...projects]; n[i].name = e.target.value; setProjects(n); }} />
                                <Textarea placeholder="Description" rows={2} value={p.description} onChange={(e) => { const n = [...projects]; n[i].description = e.target.value; setProjects(n); }} />
                                <Input placeholder="Skills Used (comma separated)" value={p.skillsUsed} onChange={(e) => { const n = [...projects]; n[i].skillsUsed = e.target.value; setProjects(n); }} />
                                <Input placeholder="Your Role" value={p.role} onChange={(e) => { const n = [...projects]; n[i].role = e.target.value; setProjects(n); }} />
                            </div>
                        ))}
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>Back</Button>
                            <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>Skip</Button>
                            <Button className="flex-1" onClick={() => setCurrentStep(3)}>Next</Button>
                        </div>
                    </div>
                )}

                {/* Step 4 — Experience */}
                {currentStep === 3 && (
                    <div className="polished-card-static p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold font-heading text-lg">Experience Details <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
                            <Button type="button" variant="outline" size="sm" onClick={addExperience} className="gap-1"><Plus className="h-3 w-3" /> Add Experience</Button>
                        </div>
                        {experiences.map((exp, i) => (
                            <div key={i} className="space-y-3 p-4 bg-background rounded-lg border border-border">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Experience {i + 1}</span>
                                    {experiences.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeExperience(i)} className="text-destructive h-6 w-6">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                <Input placeholder="Company Name" value={exp.company} onChange={(e) => { const n = [...experiences]; n[i].company = e.target.value; setExperiences(n); }} />
                                <Select value={exp.type} onValueChange={(v) => { const n = [...experiences]; n[i].type = v; setExperiences(n); }}>
                                    <SelectTrigger><SelectValue placeholder="Type (Internship / Job)" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="job">Job</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Role / Position" value={exp.role} onChange={(e) => { const n = [...experiences]; n[i].role = e.target.value; setExperiences(n); }} />
                                <Input placeholder="Duration (e.g., 3 months)" value={exp.duration} onChange={(e) => { const n = [...experiences]; n[i].duration = e.target.value; setExperiences(n); }} />
                            </div>
                        ))}
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>Back</Button>
                            <Button variant="outline" className="flex-1" onClick={handleFinish}>Skip</Button>
                            <Button className="flex-1" onClick={handleFinish}>Finish</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateOnboarding;

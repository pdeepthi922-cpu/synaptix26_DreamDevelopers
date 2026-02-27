import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const appliedInternships = [
    { id: "1", title: "Frontend Developer Intern", company: "TechCo", appliedDate: "Feb 15, 2026", status: "Under Review", deadlinePassed: false },
    { id: "2", title: "Data Science Intern", company: "DataCorp", appliedDate: "Feb 18, 2026", status: "Shortlisted", deadlinePassed: false },
    { id: "3", title: "Backend Engineer Intern", company: "CloudX", appliedDate: "Jan 10, 2026", status: "Rejected", deadlinePassed: true },
];

const appliedProjects = [
    { id: "1", title: "E-Commerce Platform", company: "StartupX", appliedDate: "Feb 20, 2026", status: "Under Review", deadlinePassed: false },
    { id: "2", title: "ML Pipeline Dashboard", company: "AILabs", appliedDate: "Feb 22, 2026", status: "Applied", deadlinePassed: false },
];

const statusColor = (status: string) => {
    switch (status) {
        case "Shortlisted": return "bg-success text-success-foreground";
        case "Rejected": return "bg-destructive text-destructive-foreground";
        default: return "bg-warning text-warning-foreground";
    }
};

const Applied = () => {
    const [internships, setInternships] = useState(appliedInternships);
    const [projects, setProjects] = useState(appliedProjects);

    const withdrawInternship = (id: string) => {
        setInternships((prev) => prev.filter((i) => i.id !== id));
        toast.success("Application withdrawn successfully.");
    };

    const withdrawProject = (id: string) => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Application withdrawn successfully.");
    };

    return (
        <DashboardLayout role="candidate">
            <div className="animate-fade-in space-y-6">
                <Link to="/dashboard/candidate" className="inline-flex items-center gap-1 text-sm text-retro-brown hover:text-retro-charcoal font-medium transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold font-heading">Applied Postings</h1>

                <Tabs defaultValue="internships" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="internships">Internships</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                    </TabsList>

                    <TabsContent value="internships" className="mt-4 space-y-3">
                        {internships.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-8">No applied internships yet.</p>
                        ) : (
                            internships.map((item) => (
                                <div key={item.id} className="polished-card-static p-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold font-heading">{item.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm text-muted-foreground">{item.company}</span>
                                            <span className="text-xs text-muted-foreground">Applied: {item.appliedDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={statusColor(item.status)}>{item.status}</Badge>
                                        {!item.deadlinePassed && (
                                            <Button variant="outline" size="sm" className="text-retro-orange border-retro-orange/30 rounded-xl hover:bg-retro-orange/8" onClick={() => withdrawInternship(item.id)}>
                                                Withdraw
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="projects" className="mt-4 space-y-3">
                        {projects.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-8">No applied projects yet.</p>
                        ) : (
                            projects.map((item) => (
                                <div key={item.id} className="polished-card-static p-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold font-heading">{item.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm text-muted-foreground">{item.company}</span>
                                            <span className="text-xs text-muted-foreground">Applied: {item.appliedDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={statusColor(item.status)}>{item.status}</Badge>
                                        {!item.deadlinePassed && (
                                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => withdrawProject(item.id)}>
                                                Withdraw
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Applied;

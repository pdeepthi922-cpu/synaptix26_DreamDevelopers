import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const postings = [
  { id: "1", title: "Frontend Developer Intern", type: "Internship", applicants: 24, route: "/recruiter/internships/1" },
  { id: "2", title: "Backend Engineer Intern", type: "Internship", applicants: 18, route: "/recruiter/internships/2" },
  { id: "3", title: "E-Commerce Platform", type: "Project", applicants: 12, route: "/recruiter/projects/1" },
  { id: "4", title: "ML Pipeline Dashboard", type: "Project", applicants: 8, route: "/recruiter/projects/2" },
];

const RecruiterDashboard = () => (
  <DashboardLayout role="recruiter">
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">Manage your postings and review candidates</p>
      </div>

      <div className="space-y-3">
        {postings.map((item) => (
          <Link
            key={item.id + item.type}
            to={item.route}
            className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <h3 className="font-semibold font-heading group-hover:text-primary transition-colors">{item.title}</h3>
              <Badge variant={item.type === "Internship" ? "default" : "secondary"}>{item.type}</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{item.applicants} Applied</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default RecruiterDashboard;

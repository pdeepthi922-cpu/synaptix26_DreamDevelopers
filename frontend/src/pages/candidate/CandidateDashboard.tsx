import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Briefcase, FolderKanban, Sparkles, TrendingUp, Target } from "lucide-react";

const internships = [
  { id: "1", title: "Frontend Developer Intern", company: "TechCo", skills: ["React", "TypeScript"], stipend: "$1,200/mo", deadline: "Apr 15, 2026" },
  { id: "2", title: "Data Science Intern", company: "DataCorp", skills: ["Python", "ML"], stipend: "$1,500/mo", deadline: "Apr 20, 2026" },
  { id: "3", title: "Backend Engineer Intern", company: "CloudX", skills: ["Node.js", "AWS"], stipend: "$1,400/mo", deadline: "May 1, 2026" },
];

const projects = [
  { id: "1", title: "E-Commerce Platform", org: "StartupX", skills: ["React", "Node.js", "SQL"] },
  { id: "2", title: "ML Pipeline Dashboard", org: "AILabs", skills: ["Python", "Docker"] },
];

const quickStats = [
  { icon: Target, label: "Skills Listed", value: "4", color: "text-retro-olive", bg: "bg-retro-olive/8" },
  { icon: Briefcase, label: "Internships", value: "10+", color: "text-retro-gold", bg: "bg-retro-gold/10" },
  { icon: TrendingUp, label: "Profile Strength", value: "72%", color: "text-retro-orange", bg: "bg-retro-orange/10" },
];

const CandidateDashboard = () => (
  <DashboardLayout role="candidate">
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-retro-charcoal">Welcome back 👋</h1>
        <p className="text-retro-brown text-sm mt-1">Explore internships and projects that match your skills</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickStats.map((s, i) => (
          <div key={s.label} className="stat-box animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-retro-brown uppercase tracking-wider font-medium">{s.label}</p>
                <p className={`text-2xl font-heading font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Internships */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-retro-charcoal" />
            <h2 className="text-lg font-heading font-bold text-retro-charcoal">Recommended Internships</h2>
          </div>
          <Link to="/internships" className="text-sm text-retro-olive hover:underline font-semibold">View All →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((item, i) => (
            <Link key={item.id} to={`/internships/${item.id}`} className="polished-card p-6 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-heading font-bold text-retro-charcoal group-hover:text-retro-olive transition-colors">{item.title}</h3>
                  <p className="text-sm text-retro-brown mt-0.5">{item.company}</p>
                </div>
                <Sparkles className="h-5 w-5 text-retro-gold shrink-0" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.skills.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-retro-charcoal">{item.stipend}</span>
                <span className="text-xs text-retro-brown">{item.deadline}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Projects */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-retro-charcoal" />
            <h2 className="text-lg font-heading font-bold text-retro-charcoal">Recommended Projects</h2>
          </div>
          <Link to="/projects" className="text-sm text-retro-olive hover:underline font-semibold">View All →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((item, i) => (
            <Link key={item.id} to={`/projects/${item.id}`} className="polished-card p-6 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <h3 className="font-heading font-bold text-retro-charcoal group-hover:text-retro-olive transition-colors mb-1">{item.title}</h3>
              <p className="text-sm text-retro-brown mb-3">{item.org}</p>
              <div className="flex flex-wrap gap-1.5">
                {item.skills.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </DashboardLayout>
);

export default CandidateDashboard;

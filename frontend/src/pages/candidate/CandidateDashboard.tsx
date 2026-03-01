import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Briefcase,
  FolderKanban,
  Sparkles,
  TrendingUp,
  Target,
  Loader2,
} from "lucide-react";
import api from "@/api/axios";

interface Posting {
  id: string;
  title: string;
  type: string;
  stipend: number | null;
  deadline: string;
  recruiter?: { companyName: string };
  postingSkills?: { skillName: string }[];
}

const CandidateDashboard = () => {
  const [internships, setInternships] = useState<Posting[]>([]);
  const [projects, setProjects] = useState<Posting[]>([]);
  const [skillCount, setSkillCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recsRes, profileRes] = await Promise.all([
          api.get("/candidates/recommendations"),
          api.get("/candidates/me"),
        ]);
        setInternships(recsRes.data.internships || []);
        setProjects(recsRes.data.projects || []);
        setSkillCount(profileRes.data.profile?.skills?.length || 0);
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickStats = [
    {
      icon: Target,
      label: "Skills Listed",
      value: String(skillCount),
      color: "text-retro-olive",
      bg: "bg-retro-olive/8",
    },
    {
      icon: Briefcase,
      label: "Internships",
      value: String(internships.length) + "+",
      color: "text-retro-gold",
      bg: "bg-retro-gold/10",
    },
    {
      icon: TrendingUp,
      label: "Projects",
      value: String(projects.length) + "+",
      color: "text-retro-orange",
      bg: "bg-retro-orange/10",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="candidate">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-retro-olive" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-heading font-bold text-retro-charcoal">
            Welcome back 👋
          </h1>
          <p className="text-retro-brown text-sm mt-1">
            Explore internships and projects that match your skills
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickStats.map((s, i) => (
            <div
              key={s.label}
              className="stat-box animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-retro-brown uppercase tracking-wider font-medium">
                    {s.label}
                  </p>
                  <p
                    className={`text-2xl font-heading font-black mt-1 ${s.color}`}
                  >
                    {s.value}
                  </p>
                </div>
                <div
                  className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}
                >
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
              <h2 className="text-lg font-heading font-bold text-retro-charcoal">
                Recommended Internships
              </h2>
            </div>
            <Link
              to="/internships"
              className="text-sm text-retro-olive hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {internships.slice(0, 3).map((item, i) => (
              <Link
                key={item.id}
                to={`/internships/${item.id}`}
                className="polished-card p-6 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-retro-charcoal group-hover:text-retro-olive transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-retro-brown mt-0.5">
                      {item.recruiter?.companyName || "Company"}
                    </p>
                  </div>
                  <Sparkles className="h-5 w-5 text-retro-gold shrink-0" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(item.postingSkills || []).slice(0, 3).map((s) => (
                    <span key={s.skillName} className="tag">
                      {s.skillName}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-retro-charcoal">
                    {item.stipend ? `$${item.stipend}/mo` : "Unpaid"}
                  </span>
                  <span className="text-xs text-retro-brown">
                    {new Date(item.deadline).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {internships.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              No matching internships found. Add more skills to your profile!
            </p>
          )}
        </section>

        {/* Recommended Projects */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-retro-charcoal" />
              <h2 className="text-lg font-heading font-bold text-retro-charcoal">
                Recommended Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-sm text-retro-olive hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.slice(0, 2).map((item, i) => (
              <Link
                key={item.id}
                to={`/projects/${item.id}`}
                className="polished-card p-6 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-heading font-bold text-retro-charcoal group-hover:text-retro-olive transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-retro-brown mb-3">
                  {item.recruiter?.companyName || "Organization"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(item.postingSkills || []).slice(0, 3).map((s) => (
                    <span key={s.skillName} className="tag">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          {projects.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              No matching projects found.
            </p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;

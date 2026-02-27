import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { ArrowLeft } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const allProjects = [
  { id: "1", title: "E-Commerce Platform", org: "StartupX", skills: ["React", "Node.js", "SQL"], appDeadline: "Apr 10, 2026", projectDeadline: "Jun 30, 2026", desc: "Build a modern e-commerce platform." },
  { id: "2", title: "ML Pipeline Dashboard", org: "AILabs", skills: ["Python", "Docker"], appDeadline: "Apr 15, 2026", projectDeadline: "Jul 15, 2026", desc: "Dashboard for ML model monitoring." },
  { id: "3", title: "Real-time Chat App", org: "CommHub", skills: ["WebSocket", "React", "Redis"], appDeadline: "Apr 20, 2026", projectDeadline: "Jul 30, 2026", desc: "Scalable messaging platform." },
  { id: "4", title: "IoT Monitoring System", org: "SmartNet", skills: ["Python", "MQTT", "React"], appDeadline: "May 1, 2026", projectDeadline: "Aug 15, 2026", desc: "Monitor IoT device metrics." },
  { id: "5", title: "CMS for News Portal", org: "MediaCo", skills: ["React", "GraphQL"], appDeadline: "May 5, 2026", projectDeadline: "Aug 30, 2026", desc: "Content management system." },
  { id: "6", title: "Mobile Banking App", org: "FinTech", skills: ["React Native", "Node.js"], appDeadline: "May 10, 2026", projectDeadline: "Sep 15, 2026", desc: "Mobile banking experience." },
  { id: "7", title: "Healthcare Dashboard", org: "MedTech", skills: ["React", "Python", "SQL"], appDeadline: "May 15, 2026", projectDeadline: "Sep 30, 2026", desc: "Patient data visualization." },
  { id: "8", title: "Social Media Analytics", org: "SocialAI", skills: ["Python", "NLP"], appDeadline: "May 20, 2026", projectDeadline: "Oct 15, 2026", desc: "Sentiment analysis platform." },
  { id: "9", title: "Video Streaming Service", org: "StreamCo", skills: ["Node.js", "AWS", "React"], appDeadline: "Jun 1, 2026", projectDeadline: "Oct 30, 2026", desc: "OTT streaming platform." },
  { id: "10", title: "Supply Chain Tracker", org: "LogiTech", skills: ["React", "Blockchain"], appDeadline: "Jun 5, 2026", projectDeadline: "Nov 15, 2026", desc: "Track supply chain." },
  { id: "11", title: "AI Chatbot", org: "BotWorks", skills: ["Python", "TensorFlow"], appDeadline: "Jun 10, 2026", projectDeadline: "Nov 30, 2026", desc: "Conversational AI assistant." },
];

const PER_PAGE = 10;

const CandidateProjects = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allProjects.filter((item) => {
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.org.toLowerCase().includes(search.toLowerCase());
      const matchSkill = !filters.skill || filters.skill === "all" || item.skills.some((s) => s.toLowerCase() === filters.skill.toLowerCase());
      return matchSearch && matchSkill;
    });
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <DashboardLayout role="candidate">
      <div className="animate-fade-in space-y-6">
        <RouterLink to="/dashboard/candidate" className="inline-flex items-center gap-1 text-sm text-retro-brown hover:text-retro-charcoal font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </RouterLink>
        <h1 className="text-2xl font-bold font-heading">All Projects</h1>

        <FilterBar
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search projects..."
          filters={[
            {
              key: "skill", label: "Skills", options: [
                { label: "React", value: "React" }, { label: "Python", value: "Python" },
                { label: "Node.js", value: "Node.js" }, { label: "SQL", value: "SQL" },
                { label: "Docker", value: "Docker" }, { label: "AWS", value: "AWS" },
              ]
            },
          ]}
          filterValues={filters}
          onFilterChange={(key, value) => { setFilters((p) => ({ ...p, [key]: value })); setPage(1); }}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paged.map((item) => (
            <Link key={item.id} to={`/projects/${item.id}`} className="polished-card p-6 group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-heading font-bold text-retro-charcoal group-hover:text-retro-olive transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.org}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.skills.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Apply by: {item.appDeadline}</span>
                <span>Due: {item.projectDeadline}</span>
              </div>
            </Link>
          ))}
        </div>

        {paged.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No projects match your filters.</p>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  );
};

export default CandidateProjects;

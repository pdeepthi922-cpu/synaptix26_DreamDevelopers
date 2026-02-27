import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const allInternships = [
  { id: "1", title: "Frontend Developer Intern", company: "TechCo", skills: ["React", "TypeScript"], stipend: "$1,200/mo", deadline: "Apr 15, 2026", duration: "3 months", desc: "Build responsive web apps." },
  { id: "2", title: "Data Science Intern", company: "DataCorp", skills: ["Python", "ML"], stipend: "$1,500/mo", deadline: "Apr 20, 2026", duration: "6 months", desc: "Work on ML pipelines." },
  { id: "3", title: "Backend Engineer Intern", company: "CloudX", skills: ["Node.js", "AWS"], stipend: "$1,400/mo", deadline: "May 1, 2026", duration: "3 months", desc: "Build scalable APIs." },
  { id: "4", title: "DevOps Intern", company: "InfraNet", skills: ["Docker", "Kubernetes"], stipend: "$1,300/mo", deadline: "May 10, 2026", duration: "6 months", desc: "Automate deployments." },
  { id: "5", title: "Mobile Developer Intern", company: "AppWorks", skills: ["React Native", "TypeScript"], stipend: "$1,350/mo", deadline: "Apr 25, 2026", duration: "3 months", desc: "Build cross-platform apps." },
  { id: "6", title: "Full Stack Intern", company: "WebCo", skills: ["React", "Node.js", "SQL"], stipend: "$1,600/mo", deadline: "May 5, 2026", duration: "6 months", desc: "End-to-end development." },
  { id: "7", title: "ML Engineer Intern", company: "AILabs", skills: ["Python", "TensorFlow"], stipend: "$1,700/mo", deadline: "May 15, 2026", duration: "3 months", desc: "Train ML models." },
  { id: "8", title: "Security Intern", company: "SecureNet", skills: ["Python", "Linux"], stipend: "$1,450/mo", deadline: "May 20, 2026", duration: "3 months", desc: "Security audits." },
  { id: "9", title: "QA Intern", company: "QualityFirst", skills: ["Selenium", "Python"], stipend: "$1,100/mo", deadline: "Jun 1, 2026", duration: "3 months", desc: "Test automation." },
  { id: "10", title: "Cloud Intern", company: "SkyOps", skills: ["AWS", "Docker"], stipend: "$1,500/mo", deadline: "Jun 5, 2026", duration: "6 months", desc: "Cloud infrastructure." },
  { id: "11", title: "UI/UX Intern", company: "DesignHub", skills: ["Figma", "CSS"], stipend: "$1,200/mo", deadline: "Jun 10, 2026", duration: "3 months", desc: "Design user interfaces." },
  { id: "12", title: "Blockchain Intern", company: "ChainTech", skills: ["Solidity", "JavaScript"], stipend: "$1,800/mo", deadline: "Jun 15, 2026", duration: "6 months", desc: "Smart contracts." },
];

const PER_PAGE = 10;

const CandidateInternships = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allInternships.filter((item) => {
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.company.toLowerCase().includes(search.toLowerCase());
      const matchSkill = !filters.skill || filters.skill === "all" || item.skills.some((s) => s.toLowerCase() === filters.skill.toLowerCase());
      const matchDuration = !filters.duration || filters.duration === "all" || item.duration === filters.duration;
      return matchSearch && matchSkill && matchDuration;
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
        <h1 className="text-2xl font-bold font-heading">All Internships</h1>

        <FilterBar
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search internships..."
          filters={[
            {
              key: "skill", label: "Skills", options: [
                { label: "React", value: "React" }, { label: "Python", value: "Python" },
                { label: "Node.js", value: "Node.js" }, { label: "TypeScript", value: "TypeScript" },
                { label: "AWS", value: "AWS" }, { label: "Docker", value: "Docker" },
              ]
            },
            {
              key: "duration", label: "Duration", options: [
                { label: "3 months", value: "3 months" }, { label: "6 months", value: "6 months" },
              ]
            },
          ]}
          filterValues={filters}
          onFilterChange={(key, value) => { setFilters((p) => ({ ...p, [key]: value })); setPage(1); }}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paged.map((item) => (
            <Link key={item.id} to={`/internships/${item.id}`} className="polished-card p-6 group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-heading font-bold text-retro-charcoal group-hover:text-retro-olive transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.skills.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{item.stipend}</span>
                <span className="text-xs text-muted-foreground">Deadline: {item.deadline}</span>
              </div>
            </Link>
          ))}
        </div>

        {paged.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No internships match your filters.</p>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  );
};

export default CandidateInternships;

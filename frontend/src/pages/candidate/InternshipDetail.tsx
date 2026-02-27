import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const proficiencyLabels: Record<number, string> = { 1: "Beginner", 2: "Basic", 3: "Intermediate", 4: "Advanced", 5: "Expert" };

const internshipData = {
  title: "Frontend Developer Intern", company: "TechCo",
  description: "Join our frontend team to build responsive, accessible web applications using React and TypeScript. You'll work on real products used by thousands of users.",
  requiredSkills: [{ name: "React", weight: 5 }, { name: "TypeScript", weight: 4 }, { name: "CSS", weight: 3 }, { name: "Git", weight: 2 }],
  stipend: "$1,200/mo", duration: "3 months", deadline: "April 15, 2026", location: "Remote",
};

const candidateSkills: Record<string, number> = { React: 4, TypeScript: 3, CSS: 2, Git: 3, Python: 3, SQL: 2 };
const rankingData = [
  { name: "Alice Johnson", score: 91, applied: true, isCurrentUser: false },
  { name: "Bob Smith", score: 72, applied: false, isCurrentUser: false },
  { name: "John Doe", score: 68, applied: true, isCurrentUser: true },
  { name: "Mike R.", score: 55, applied: false, isCurrentUser: false },
  { name: "Emma W.", score: 45, applied: false, isCurrentUser: false },
];

const InternshipDetail = () => {
  const { id } = useParams();
  const [showScorecard, setShowScorecard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [applied, setApplied] = useState(false);
  const data = internshipData;
  const totalMaxScore = data.requiredSkills.reduce((a, s) => a + s.weight * 5, 0);
  const scorecardRows = data.requiredSkills.map((s) => { const p = candidateSkills[s.name] || 0; return { skill: s.name, weight: s.weight, proficiency: p, contribution: p * s.weight, max: s.weight * 5 }; });
  const totalScore = scorecardRows.reduce((a, r) => a + r.contribution, 0);
  const percentage = Math.round((totalScore / totalMaxScore) * 100);
  const eligible = percentage >= 80;
  const weakSkills = scorecardRows.filter((r) => r.proficiency < r.weight);
  const handleCheck = () => { setLoading(true); setTimeout(() => { setLoading(false); setShowScorecard(true); }, 800); };
  const handleApply = () => { setApplied(true); toast.success("Application submitted!"); };

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl animate-fade-in space-y-6">
        <Link to="/internships" className="inline-flex items-center gap-1.5 text-sm text-retro-brown hover:text-retro-charcoal font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Internships
        </Link>

        <div className="polished-card-static p-8 space-y-5">
          <h1 className="text-2xl font-heading font-bold text-retro-charcoal">{data.title}</h1>
          <p className="text-retro-brown text-sm font-medium">{data.company}</p>
          <p className="text-sm leading-relaxed text-retro-charcoal/80">{data.description}</p>
          <div className="flex flex-wrap gap-2">
            {data.requiredSkills.map((s) => <span key={s.name} className="tag">{s.name} (w:{s.weight})</span>)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[["Stipend", data.stipend], ["Duration", data.duration], ["Deadline", data.deadline], ["Location", data.location]].map(([l, v]) => (
              <div key={l} className="stat-box !p-3">
                <span className="text-retro-brown text-[10px] uppercase tracking-wider block font-medium">{l}</span>
                <strong className="text-retro-charcoal text-sm">{v}</strong>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleCheck} disabled={loading || showScorecard} className="btn-gold rounded-xl gap-2 px-6">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking…</> : "Check Eligibility"}
            </Button>
            <Button variant="outline" onClick={() => setShowRanking(!showRanking)} className="btn-outline-dark rounded-xl px-6">
              {showRanking ? "Hide Ranking" : "View Ranking"}
            </Button>
          </div>
        </div>

        {showScorecard && (
          <div className="polished-card-static p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-retro-charcoal">Weighted Match</h2>
              <div className={`stamp text-sm ${eligible ? "stamp-olive" : "stamp-orange"}`}>
                {eligible ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {percentage}%
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b-2 border-retro-charcoal/15"><th className="text-left py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Skill</th><th className="text-center py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Weight</th><th className="text-center py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Level</th><th className="text-center py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Score</th></tr></thead>
                <tbody>
                  {scorecardRows.map((r) => (
                    <tr key={r.skill} className="border-b border-retro-charcoal/8">
                      <td className="py-3 font-medium text-retro-charcoal">{r.skill}</td><td className="py-3 text-center text-retro-brown">{r.weight}</td>
                      <td className="py-3 text-center text-retro-brown">{r.proficiency} ({proficiencyLabels[r.proficiency] || "N/A"})</td><td className="py-3 text-center text-retro-charcoal font-semibold">{r.contribution}/{r.max}</td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-retro-charcoal/15"><td className="py-3 text-retro-charcoal">Total</td><td /><td /><td className="py-3 text-center text-retro-charcoal">{totalScore}/{totalMaxScore} ({percentage}%)</td></tr>
                </tbody>
              </table>
            </div>
            {eligible ? (
              <div className="info-box-olive p-5 space-y-3">
                <div className="flex items-center gap-2 text-retro-olive font-bold"><CheckCircle2 className="h-5 w-5" /> Eligible — score exceeds 80%.</div>
                <Button onClick={handleApply} disabled={applied} className="btn-gold rounded-xl gap-2">
                  {applied ? "Applied ✓" : <><ArrowRight className="h-4 w-4" /> Apply Now</>}
                </Button>
              </div>
            ) : (
              <div className="info-box-orange p-5 space-y-3">
                <div className="flex items-center gap-2 text-retro-orange font-bold"><XCircle className="h-5 w-5" /> Not eligible — need 80%.</div>
                <p className="text-sm text-retro-brown">Current: <strong>{percentage}%</strong>. Need <strong>{80 - percentage}%</strong> more.</p>
                {weakSkills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-retro-charcoal">Skills to improve:</p>
                    <div className="flex flex-wrap gap-2">
                      {weakSkills.map((s) => <span key={s.skill} className="tag-gold">{s.skill}: {proficiencyLabels[s.proficiency]} → {proficiencyLabels[s.weight]}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showRanking && (
          <div className="polished-card-static p-8 space-y-4 animate-fade-in-up">
            <h2 className="font-heading font-bold text-lg text-retro-charcoal">Rankings</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b-2 border-retro-charcoal/15"><th className="text-left py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Rank</th><th className="text-left py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Candidate</th><th className="text-center py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Score</th><th className="text-center py-3 text-xs uppercase tracking-wider text-retro-brown font-semibold">Applied</th></tr></thead>
              <tbody>
                {rankingData.map((c, i) => (
                  <tr key={c.name} className={`border-b border-retro-charcoal/8 ${c.isCurrentUser ? "bg-retro-gold/8 font-semibold" : ""}`}>
                    <td className="py-3">{i + 1}</td><td className="py-3">{c.name} {c.isCurrentUser && <span className="tag-olive ml-1">You</span>}</td>
                    <td className="py-3 text-center"><span className={`tag ${c.score >= 80 ? "tag-olive" : ""}`}>{c.score}%</span></td>
                    <td className="py-3 text-center">{c.applied ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InternshipDetail;

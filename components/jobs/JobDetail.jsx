"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Mail,
  User,
  Info,
  FileText,
  Activity,
  Target,
  Database,
  BarChart3,
  Search as SearchIcon,
  Layers,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Eye,
  ShieldCheck,
  Code,
  Link as AnchorLink,
  ArrowUp,
  ArrowDown,
  Minus,
  HelpCircle,
  Award,
  Cpu,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import JobErrorCard from "./JobErrorCard";
import Link from "next/link";

// ============================================================
// Helper Components
// ============================================================
function MetricBox({ label, value, icon: Icon, color = "slate", subtitle }) {
  const colors = {
    slate:
      "bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-600 dark:text-green-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400",
    cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400",
  };
  return (
    <div className={`p-4 rounded-xl border text-center ${colors[color]}`}>
      {Icon && <Icon className="h-4 w-4 mx-auto mb-1 opacity-70" />}
      <p className="text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        {value ?? "N/A"}
      </p>
      {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
    </div>
  );
}

/* COMMENTED: Helper components for disabled APIs — uncomment when re-enabling
function PositionBadge({ position }) {
  if (!position && position !== 0) return <span className="text-xs text-muted-foreground">—</span>;
  const pos = Number(position);
  let cls = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  if (pos <= 3) cls = "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
  else if (pos <= 10) cls = "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
  else if (pos <= 20) cls = "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>#{pos}</span>;
}

function SerpFeatureBadge({ label, active, icon: Icon }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
      active
        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
        : "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
    }`}>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
      {active ? <CheckCircle className="h-3.5 w-3.5 ml-auto" /> : <Minus className="h-3.5 w-3.5 ml-auto" />}
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false, count, color = "slate" }) {
  const [open, setOpen] = useState(defaultOpen);
  const headerColors = {
    slate: "text-slate-700 dark:text-slate-300", green: "text-green-700 dark:text-green-300",
    blue: "text-blue-700 dark:text-blue-300", purple: "text-purple-700 dark:text-purple-300",
    amber: "text-amber-700 dark:text-amber-300", cyan: "text-cyan-700 dark:text-cyan-300",
  };
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left group">
        {Icon && <Icon className={`h-5 w-5 ${headerColors[color]}`} />}
        <h4 className={`font-bold ${headerColors[color]}`}>{title}</h4>
        {count !== undefined && <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{count}</span>}
        <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
END COMMENTED helper components */

// ============================================================
// Main Component
// ============================================================
export default function JobDetail() {
  const params = useParams();
  const id = params?.id;
  const [job, setJob] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/api/job/${id}`);
    setJob(data.job || null);
  };

  useEffect(() => {
    if (!id) return;
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [id]);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  const seo = job.dataForSeo || {};
  const summary = seo.summary || {};

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-12 space-y-8 max-md:px-0">
      {/* ============================================================ */}
      {/* Header Card */}
      {/* ============================================================ */}
      <div className="flex gap-2">
        <Link
          href="/jobs"
          className="text-blue-600 dark:text-blue-400 hover:underline flex gap-2"
        >
          <ArrowLeft className="h-5 w-5 block" /> Go Back
        </Link>
      </div>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200 dark:border-blue-800 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start max-md:flex-col max-md:gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl text-blue-950 dark:text-blue-50 flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Job Analysis
              </CardTitle>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80 font-mono">
                ID: {id}
              </p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm capitalize flex items-center gap-2 ${
                job.status === "completed"
                  ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                  : job.status === "failed"
                    ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                    : "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
              }`}
            >
              {job.status === "completed" && (
                <CheckCircle className="h-4 w-4" />
              )}
              {job.status === "failed" && <XCircle className="h-4 w-4" />}
              {job.status !== "completed" && job.status !== "failed" && (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {job.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-muted-foreground block text-sm mb-1">
                  URL
                </span>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all text-sm"
                >
                  {job.url}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-muted-foreground block text-sm mb-1">
                  Type
                </span>
                <span className="text-foreground font-medium capitalize">
                  {job.type === "data_for_seo"
                    ? "DataForSEO"
                    : "Normal (Firecrawl)"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-muted-foreground block text-sm mb-1">
                  Created At
                </span>
                <span className="text-foreground font-medium">
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* Errors */}
      {/* ============================================================ */}
      {job.jobErrors?.length > 0 && <JobErrorCard errors={job.jobErrors} />}

      {/* ============================================================ */}
      {/* Analysis Section */}
      {/* ============================================================ */}
      {job.analysis && job.jobErrors?.length == 0 && (
        <div className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Analysis Report
            </h2>
            {job.analysis.estimated_lift && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 px-6 py-3 rounded-xl border border-green-200 dark:border-green-800 shadow-sm space-y-6">
                <span className="text-sm text-green-800 dark:text-green-300 font-semibold uppercase tracking-wide">
                  Estimated Lift
                </span>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {job.analysis.estimated_lift}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Critical Issues */}
            <Card className="border-red-200 dark:border-red-900 shadow-md overflow-hidden">
              <CardHeader className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/50 pb-4">
                <CardTitle className="text-xl text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Critical Issues ({job.analysis.critical_issues?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {job.analysis.critical_issues?.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-red-50/30 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 max-md:hidden" />
                      <div className="space-y-2 flex-1">
                        <p className="font-semibold text-foreground">
                          {issue.issue}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              issue.impact === "high"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : issue.impact === "medium"
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {issue.impact} impact
                          </span>
                          {issue.estimated_impact && (
                            <span className="text-xs text-muted-foreground">
                              ~ {issue.estimated_impact}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Fix:
                          </span>{" "}
                          {issue.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {!job.analysis.critical_issues?.length && (
                  <p className="text-muted-foreground italic">
                    No critical issues found.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="border-blue-200 dark:border-blue-900 shadow-md overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 pb-4">
                <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  Opportunities ({job.analysis.opportunities?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {job.analysis.opportunities?.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="space-y-2 flex-1">
                        <p className="font-semibold text-foreground">
                          {opp.opportunity}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              opp.impact === "high"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : opp.impact === "medium"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {opp.impact} impact
                          </span>
                        </div>
                        {opp.current_state && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Current:
                            </span>{" "}
                            {opp.current_state}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Suggestion:
                          </span>{" "}
                          {opp.suggested_change}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {!job.analysis.opportunities?.length && (
                  <p className="text-muted-foreground italic">
                    No opportunities listed.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card className="border-green-200 dark:border-green-900 shadow-md overflow-hidden">
              <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900/50 pb-4">
                <CardTitle className="text-xl text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-gradient-to-b from-white to-green-50/30 dark:from-background dark:to-green-950/10">
                <div className="bg-white dark:bg-white/5 rounded-xl border border-green-100 dark:border-green-900/30 p-4 shadow-sm">
                  <ul className="space-y-3">
                    {job.analysis.strengths?.map((strength, idx) => (
                      <li
                        key={idx}
                        className="text-foreground flex items-start gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                  {!job.analysis.strengths?.length && (
                    <p className="text-muted-foreground italic">
                      No strengths listed.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SEO Data Section (DataForSEO) — Active APIs Only                */}
      {/* Active: Domain Rank Overview, WHOIS, AI Overview Keywords        */}
      {/* ============================================================ */}
      {job.dataForSeo && job.jobErrors?.length == 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            SEO Intelligence
          </h2>

          {/* --- Domain Overview Metrics Grid (ACTIVE) --- */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-xl text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                Domain Overview
                {summary.domain && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    — {summary.domain}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
                <MetricBox
                  label="Organic Traffic"
                  value={summary.organic_traffic?.toLocaleString()}
                  icon={TrendingUp}
                  color="green"
                />
                <MetricBox
                  label="AI Overviews"
                  value={summary.ai_overview_keywords_count || 0}
                  icon={Sparkles}
                  color="purple"
                  subtitle={summary.has_ai_overview ? "Detected" : "Not found"}
                />
                <MetricBox
                  label="Domain Age"
                  value={
                    summary.domain_age_years
                      ? `${summary.domain_age_years}y`
                      : "N/A"
                  }
                  icon={Calendar}
                  color="slate"
                />
                <MetricBox
                  label="Paid Traffic"
                  value={summary.paid_traffic?.toLocaleString() || 0}
                  icon={TrendingUp}
                  color="amber"
                />
              </div>
              {/* COMMENTED: Metrics from disabled APIs — uncomment when re-enabling
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <MetricBox label="Ranked Keywords" value={summary.total_ranked_keywords?.toLocaleString()} icon={Award} color="cyan" />
                <MetricBox label="Top 3 Positions" value={summary.top_3_positions || 0} icon={Target} color="green" />
                <MetricBox label="Technologies" value={summary.technologies_count || 0} icon={Cpu} color="amber" />
                <MetricBox label="On-Page Score" value={summary.onpage_score || 'N/A'} icon={Activity} color="blue" />
              </div>
              */}
            </CardContent>
          </Card>

          {/* --- AI Overview Keywords Table (ACTIVE) --- */}
          {seo.aiOverviewKeywords?.items?.length > 0 && (
            <Card className="border-purple-200 dark:border-purple-800 shadow-md overflow-hidden">
              <CardHeader className="bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/50 pb-4">
                <CardTitle className="text-xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  AI Overview Appearances
                  <span className="text-sm font-normal text-purple-600 dark:text-purple-400 ml-2">
                    ({seo.aiOverviewKeywords.total_count?.toLocaleString() || 0}{" "}
                    keywords)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Keywords where this domain appears inside Google&apos;s AI
                  Overview (SGE).
                </p>
                <div className="bg-white dark:bg-slate-950 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-800 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    <div className="col-span-6">Keyword</div>
                    <div className="col-span-3 text-right">Search Volume</div>
                    <div className="col-span-3 text-right">Position</div>
                  </div>
                  {seo.aiOverviewKeywords.items.slice(0, 15).map((item, i) => {
                    const kw = item.keyword_data;
                    const serp = item.ranked_serp_element?.serp_item;
                    const pos = serp?.rank_group;
                    let posCls =
                      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
                    if (pos && pos <= 3)
                      posCls =
                        "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
                    else if (pos && pos <= 10)
                      posCls =
                        "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
                    else if (pos && pos <= 20)
                      posCls =
                        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 border-purple-50 dark:border-purple-900/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 items-center"
                      >
                        <div className="col-span-6">
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                            {kw?.keyword || "N/A"}
                          </span>
                        </div>
                        <div className="col-span-3 text-right text-sm text-slate-600 dark:text-slate-400 font-mono">
                          {kw?.keyword_info?.search_volume?.toLocaleString() ||
                            "—"}
                        </div>
                        <div className="col-span-3 text-right">
                          {pos ? (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${posCls}`}
                            >
                              #{pos}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- WHOIS / Domain Info (ACTIVE) --- */}
          {seo.whois && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  Domain Info (WHOIS)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {[
                    { label: "Domain", value: seo.whois.domain },
                    {
                      label: "Registrar",
                      value: seo.whois.registrar?.name || seo.whois.registrar,
                    },
                    {
                      label: "Created",
                      value: seo.whois.creation_date
                        ? new Date(seo.whois.creation_date).toLocaleDateString()
                        : null,
                    },
                    {
                      label: "Expires",
                      value: seo.whois.expiration_date
                        ? new Date(
                            seo.whois.expiration_date,
                          ).toLocaleDateString()
                        : null,
                    },
                    {
                      label: "Domain Age",
                      value: seo.whois.domain_age_years
                        ? `${seo.whois.domain_age_years} years`
                        : null,
                    },
                    {
                      label: "Updated",
                      value: seo.whois.updated_date
                        ? new Date(seo.whois.updated_date).toLocaleDateString()
                        : null,
                    },
                  ]
                    .filter((r) => r.value)
                    .map((row, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-1.5"
                      >
                        <span className="text-sm text-muted-foreground">
                          {row.label}
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {row.value}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============================================================ */}
          {/* COMMENTED: Sections for disabled APIs — uncomment to re-enable */}
          {/* ============================================================ */}

          {/* --- Organic Ranked Keywords (DISABLED — rankedKeywords API ~$0.015/domain) ---
          {seo.rankedKeywords?.items?.length > 0 && (
            <Card className="border-cyan-200 dark:border-cyan-800 shadow-md overflow-hidden">
              <CardHeader className="bg-cyan-50 dark:bg-cyan-950/30 border-b border-cyan-100 dark:border-cyan-900/50 pb-4">
                <CardTitle className="text-xl text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Organic Rankings
                  <span className="text-sm font-normal text-cyan-600 dark:text-cyan-400 ml-2">
                    ({seo.rankedKeywords.total_count?.toLocaleString()} total keywords)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {seo.rankedKeywords.metrics?.organic && (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    {[
                      { label: "#1", value: seo.rankedKeywords.metrics.organic.pos_1 },
                      { label: "#2-3", value: seo.rankedKeywords.metrics.organic.pos_2_3 },
                      { label: "#4-10", value: seo.rankedKeywords.metrics.organic.pos_4_10 },
                      { label: "#11-20", value: seo.rankedKeywords.metrics.organic.pos_11_20 },
                      { label: "#21-50", value: seo.rankedKeywords.metrics.organic.pos_21_30 },
                      { label: "#51-100", value: seo.rankedKeywords.metrics.organic.pos_31_40 },
                    ].map((m, i) => (
                      <div key={i} className="bg-cyan-50/50 dark:bg-cyan-900/10 rounded-lg border border-cyan-100 dark:border-cyan-800/50 p-2 text-center">
                        <p className="text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400">{m.label}</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{m.value ?? 0}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-white dark:bg-slate-950 rounded-xl border border-cyan-200 dark:border-cyan-800 overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-cyan-50 dark:bg-cyan-950/40 border-b border-cyan-100 dark:border-cyan-800 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <div className="col-span-1">Pos</div>
                    <div className="col-span-5">Keyword</div>
                    <div className="col-span-2 text-right">Volume</div>
                    <div className="col-span-2 text-right">Traffic</div>
                    <div className="col-span-2 text-right">CPC</div>
                  </div>
                  {seo.rankedKeywords.items.slice(0, 20).map((item, i) => {
                    const kw = item.keyword_data;
                    const serp = item.ranked_serp_element?.serp_item;
                    return (
                      <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 border-cyan-50 dark:border-cyan-900/30 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 items-center">
                        <div className="col-span-1"><PositionBadge position={serp?.rank_group} /></div>
                        <div className="col-span-5">
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{kw?.keyword || "N/A"}</span>
                          {serp?.type && serp.type !== "organic" && (
                            <span className="ml-2 text-[10px] uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">{serp.type.replace("_", " ")}</span>
                          )}
                        </div>
                        <div className="col-span-2 text-right text-sm text-slate-600 dark:text-slate-400 font-mono">{kw?.keyword_info?.search_volume?.toLocaleString() || "—"}</div>
                        <div className="col-span-2 text-right text-sm text-slate-600 dark:text-slate-400 font-mono">{kw?.keyword_info?.estimated_traffic_volume?.toLocaleString() || serp?.etv?.toLocaleString() || "—"}</div>
                        <div className="col-span-2 text-right text-sm text-slate-600 dark:text-slate-400 font-mono">{kw?.keyword_info?.cpc != null ? `$${kw.keyword_info.cpc.toFixed(2)}` : "—"}</div>
                      </div>
                    );
                  })}
                </div>
                {seo.rankedKeywords.total_count > 20 && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">Showing top 20 of {seo.rankedKeywords.total_count.toLocaleString()} ranked keywords</p>
                )}
              </CardContent>
            </Card>
          )}
          */}

          {/* --- SERP Features Detection (DISABLED — serpOrganic API ~$0.002/domain) ---
          {seo.rankings?.parsed && (
            <Card className="border-indigo-200 dark:border-indigo-800 shadow-md overflow-hidden">
              <CardHeader className="bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 pb-4">
                <CardTitle className="text-xl text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  SERP Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <SerpFeatureBadge label="AI Overview" active={!!seo.rankings.parsed.ai_overview} icon={Sparkles} />
                  <SerpFeatureBadge label="Featured Snippet" active={!!seo.rankings.parsed.featured_snippet} icon={Award} />
                  <SerpFeatureBadge label="People Also Ask" active={seo.rankings.parsed.people_also_ask?.length > 0} icon={HelpCircle} />
                  <SerpFeatureBadge label="Knowledge Graph" active={!!seo.rankings.parsed.knowledge_graph} icon={Database} />
                </div>
              </CardContent>
            </Card>
          )}
          */}

          {/* --- Keyword Suggestions & Competitors (DISABLED — ~$0.026/domain combined) ---
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <SearchIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  Keyword Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {seo.keywords?.items?.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {seo.keywords.items.slice(0, 10).map((kw, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{kw.keyword}</span>
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-600 dark:text-slate-400">Vol: {kw.keyword_info?.search_volume?.toLocaleString() || "N/A"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-4">No keyword suggestions found.</p>
                )}
              </CardContent>
            </Card>
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  SERP Competitors
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {seo.competitors?.items?.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {seo.competitors.items.slice(0, 10).map((comp, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm truncate max-w-[200px]">{comp.domain}</span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-600 dark:text-slate-400">Rank: {comp.rank_group || i + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-4">No competitors found.</p>
                )}
              </CardContent>
            </Card>
          </div>
          */}

          {/* --- Technologies (DISABLED — technologies API ~$0.01/domain) ---
          {seo.technologies?.technologies?.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  Technologies
                  <span className="text-sm font-normal text-muted-foreground ml-1">({seo.technologies.technologies.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {seo.technologies.technologies.slice(0, 30).map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs font-medium text-amber-800 dark:text-amber-300">{tech.name || tech}</span>
                  ))}
                </div>
                {seo.technologies.technologies.length > 30 && (
                  <p className="text-xs text-muted-foreground mt-3">+{seo.technologies.technologies.length - 30} more</p>
                )}
              </CardContent>
            </Card>
          )}
          */}
        </div>
      )}

      {/* ============================================================ */}
      {/* Contact Info */}
      {/* ============================================================ */}
      {job.contact && (
        <Card className="border-purple-200 dark:border-purple-900 shadow-md overflow-hidden">
          <CardHeader className="bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/50">
            <CardTitle className="text-xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <User className="h-6 w-6" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                    Name
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  {job.contact.name || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                    Email
                  </p>
                </div>
                <p className="font-semibold text-lg break-all">
                  {job.contact.email || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                    Source
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  {job.contact.source || "N/A"}
                  <span className="text-purple-400 dark:text-purple-500 text-sm font-normal ml-2">
                    ({job.contact.confidence || "?"})
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================ */}
      {/* Email Template */}
      {/* ============================================================ */}
      {job.emailTemplate && job.jobErrors?.length == 0 && (
        <Card className="border-amber-200 dark:border-amber-900 shadow-md overflow-hidden">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/50">
            <CardTitle className="text-xl text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Generated Email Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-amber-50/30 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-100 dark:border-amber-800/50">
              <span className="font-bold text-amber-800 dark:text-amber-400 block text-xs uppercase tracking-wider mb-2">
                Subject
              </span>
              <p className="text-lg font-semibold text-foreground">
                {job.emailTemplate.subject}
              </p>
            </div>
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-400 block text-xs uppercase tracking-wider mb-3">
                Email Body
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: job.emailTemplate.body }}
                className="bg-white dark:bg-white/5 p-6 rounded-xl border border-amber-100 dark:border-amber-800/50 text-sm whitespace-pre-wrap font-mono shadow-sm"
              ></div>
              {job.emailTemplate.sequence.map((sequence, index) => (
                <div key={sequence._id} className="mt-4">
                  <span className="font-bold text-amber-800 dark:text-amber-400 block text-xs uppercase tracking-wider mb-3">
                    Sequence {index + 1}
                  </span>
                  <div
                    dangerouslySetInnerHTML={{ __html: sequence.body }}
                    className="bg-white dark:bg-white/5 p-6 rounded-xl border border-amber-100 dark:border-amber-800/50 text-sm whitespace-pre-wrap font-mono shadow-sm"
                  ></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================ */}
      {/* Raw Data (debug) */}
      {/* ============================================================ */}
      {!job.analysis && !job.contact && job.result && (
        <Card className="border-dashed border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Raw Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono">
              {JSON.stringify(job.result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

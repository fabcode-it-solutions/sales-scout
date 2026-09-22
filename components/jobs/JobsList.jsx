"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  Layers,
  Search,
} from "lucide-react";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);
  const [failedJobs, SetFailedJobs] = useState(0);
  const [queuedJobs, setQueuedJobs] = useState(0);
  const isMobile = useIsMobile(1024);
  const router = useRouter();
  const limit = 100;
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loadJobs = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          ...(status !== "all" ? { status } : {}),
          ...(type !== "all" ? { type } : {}),
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          page,
          limit,
        };

        const { data } = await api.get("/api/jobs", { params });

        setJobs(data.jobs || []);

        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setCurrentPage(data.pagination.page);
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setLoading(false);
      }
    },
    [status, type, debouncedSearch],
  );
  /**
   * @description: Fetch job stats from the server
   */
  const fetchJobStats = useCallback(
    async (page) => {
      try {
        const { data } = await api.get("/api/jobStats");
        if (data?.success) {
          setPendingJobs(data?.pendingJobs || 0);
          setCompletedJobs(data?.completedJobs || 0);
          SetFailedJobs(data?.failedJobs || 0);
          setQueuedJobs(data?.queuedJobs || 0);
          setTotalJobs(data?.totalJobs || 0);
        }
      } catch (error) {
        console.error("Failed to load job stats", error);
      }
    },
    [page],
  );
  /**
   * @description: Fetch job stats every 3 seconds
   */
  useEffect(() => {
    const interval = setInterval(fetchJobStats, 10000);
    const interval2 = setInterval(() => loadJobs(page), 10000);
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, [status, type, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
    loadJobs(1);
    fetchJobStats(1);
  }, [status, debouncedSearch, type]);

  const handlePageChange = (page) => {
    loadJobs(page);
    setPage(page);
  };

  const getLastError = (job) => {
    if (job.status !== "failed" || !job.jobErrors || job.jobErrors.length === 0)
      return null;
    const lastError = job.jobErrors[job.jobErrors.length - 1];
    return lastError.message || "Unknown error occurred";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "crawling":
      case "analyzing":
      case "processing":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "crawling":
      case "analyzing":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const filters = [
    { id: "all", label: "All Jobs" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "failed", label: "Failed" },
  ];
  const types = [
    { id: "all", label: "All" },
    { id: "normal", label: "Website (Firecrawel)" },
    { id: "data_for_seo", label: "Data For SEO" },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Processing Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your scraping jobs
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadJobs(1)}
          disabled={loading}
          className="w-full md:w-auto gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Jobs
              </p>
              <h3 className="text-2xl font-bold mt-1">{totalJobs}</h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <h3 className="text-2xl font-bold mt-1">{completedJobs}</h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending
              </p>
              <h3 className="text-2xl font-bold mt-1">{pendingJobs}</h3>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Failed
              </p>
              <h3 className="text-2xl font-bold mt-1">{failedJobs}</h3>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Queued
              </p>
              <h3 className="text-2xl font-bold mt-1">{queuedJobs}</h3>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search jobs by URL, status, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="flex flex-wrap gap-2 pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatus(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                status === f.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>{" "}
        <div className="flex flex-wrap gap-2 pb-2">
          {types.map((f) => (
            <button
              key={f.id}
              onClick={() => setType(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                type === f.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isMobile ? (
            <div className="divide-y divide-border">
              {loading && jobs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p>Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No jobs found.</p>
                </div>
              ) : (
                jobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => router.push(`/job/${j.id || j._id}`)}
                    className="p-4 active:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{(j.id || j._id || "").substring(0, 6)}
                        </span>
                        <div
                          className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 capitalize border ${getStatusColorClass(j.status)}`}
                        >
                          {getStatusIcon(j.status)}
                          {j.status}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(j.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-foreground truncate mb-1">
                      {j.url}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>
                        Created {new Date(j.createdAt).toLocaleTimeString()}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    {getLastError(j) && (
                      <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="break-words">{getLastError(j)}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium w-[120px]">ID</th>
                    <th className="px-6 py-4 font-medium">Target URL</th>
                    <th className="px-6 py-4 font-medium w-[180px]">Status</th>
                    <th className="px-6 py-4 font-medium w-[200px]">
                      Created At
                    </th>
                    <th className="px-6 py-4 font-medium w-[80px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading && jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                          <span>Loading jobs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        No jobs found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((j) => (
                      <tr
                        key={j.id || j._id}
                        onClick={() => router.push(`/job/${j.id || j._id}`)}
                        className="group hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {(j.id || j._id || "").substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="max-w-[400px] truncate font-medium text-foreground"
                            title={j.url}
                          >
                            {j.url}
                            <br />
                            <div
                              className={` text-xs text-gray-400
                              `}
                            >
                              {j.type === "normal"
                                ? "(Website Analysis)"
                                : "(Data For SEO)"}
                            </div>
                          </div>
                          {getLastError(j) && (
                            <div className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 max-w-[400px]">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span
                                className="truncate"
                                title={getLastError(j)}
                              >
                                {getLastError(j)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getStatusColorClass(j.status)}`}
                          >
                            {getStatusIcon(j.status)}
                            {j.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(j.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
}

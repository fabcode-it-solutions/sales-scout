"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import UrlInput from "@/components/UrlInput";
import FileUpload from "@/components/FileUpload";
import JobStatus from "@/components/JobStatus";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HomeContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("normal");

  const handleJobCreated = (job) => {
    setJobs((prev) => [job, ...prev]);
  };

  const handleJobsCreated = (newJobs) => {
    setJobs((prev) => [...newJobs, ...prev]);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl inline-flex border border-white/20 shadow-lg">
            <button
              onClick={() => setActiveTab("normal")}
              className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "normal"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              Website Analysis
            </button>
            <button
              onClick={() => setActiveTab("data_for_seo")}
              className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "data_for_seo"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              Data For SEO
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-8 md:grid-cols-2"
        >
          <UrlInput onJobCreated={handleJobCreated} type={activeTab} />
          <FileUpload onJobsCreated={handleJobsCreated} type={activeTab} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <JobStatus jobs={jobs} />
        </motion.div>
      </div>
    </div>
  );
}

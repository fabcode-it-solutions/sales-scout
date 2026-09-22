"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import LoadingOverlay from "@/components/LoadingOverlay";

// export default function FileUpload({ onJobsCreated }) {
export default function FileUpload({ onJobsCreated, type = "normal" }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Download example file
  const downloadExample = async (e) => {
    e.stopPropagation(); // Prevent triggering file input click
    try {
      const response = await api.get("/api/example-excel", {
        responseType: "blob",
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "example_urls.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download example file");
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Check if excel
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await api.post("/api/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // For large files, jobs are created in background
        if (onJobsCreated) onJobsCreated([]);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to upload file";
      toast.error(msg);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <>
      <LoadingOverlay
        isLoading={uploading}
        message="Uploading and processing Excel file..."
      />
      <Card>
        <CardHeader>
          <CardTitle>
            Bulk Upload (
            {type == "normal" ? "Website Analysis" : "Data For SEO"})
          </CardTitle>
          <CardDescription>
            Upload an Excel file with a list of URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-400 hover:bg-slate-50",
              uploading && "opacity-50 pointer-events-none",
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-10 w-10 text-slate-400" />
              )}
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {uploading
                  ? "Uploading..."
                  : "Drop Excel file here or click to upload"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports .xlsx and .xls
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={downloadExample}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Download example file
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

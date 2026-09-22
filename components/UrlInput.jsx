"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

// export default function UrlInput({ onJobCreated }) {
export default function UrlInput({ onJobCreated, type = "normal" }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      // const { data } = await api.post('/api/add-url', { url });
      const { data } = await api.post("/api/add-url", { url, type });
      if (onJobCreated) onJobCreated(data.job);
      setUrl("");
      toast.success("Analysis started for " + url);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Failed to start analysis";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Single URL Analysis (
          {type == "normal" ? "Website Analysis" : "Data For SEO"})
        </CardTitle>
        <CardDescription>
          Enter a website URL to analyze and generate leads
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

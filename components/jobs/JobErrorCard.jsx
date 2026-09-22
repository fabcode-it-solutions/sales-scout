import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, XCircle } from "lucide-react";

export default function JobErrorCard({ errors = [] }) {
  if (!errors || errors.length === 0) return null;

  return (
    <Card className="border-red-200 dark:border-red-800 shadow-md overflow-hidden">
      <CardHeader className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/50">
        <CardTitle className="text-xl text-red-800 dark:text-red-300 flex items-center gap-2">
          <XCircle className="h-6 w-6" />
          Errors ({errors.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {errors.map((err, idx) => (
          <div
            key={idx}
            className="p-4 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50 flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider rounded">
                  {err.step || "Unknown Step"}
                </span>
                {err.timestamp && (
                  <span className="text-xs text-red-400 dark:text-red-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(err.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-red-800 dark:text-red-200 break-words">
                {err.message || "An unknown error occurred"}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoadingOverlay({ isLoading, message = "Uploading..." }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card border border-border shadow-2xl max-w-sm w-full mx-4 text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-background p-4 rounded-full border border-border shadow-sm">
             <FileSpreadsheet className="h-8 w-8 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Processing File</h3>
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

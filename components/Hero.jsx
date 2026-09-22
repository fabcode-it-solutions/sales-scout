import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text"
          >
            Automated Lead Generation 
            <span className="text-blue-600 block mt-2">Powered by AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
          >
            Analyze websites, discover contacts, and generate personalized outreach emails in seconds. 
            Supercharge your sales workflow with SalesScout.
          </motion.p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30" />
    </div>
  );
}

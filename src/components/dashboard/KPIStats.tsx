import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface KPIStatsProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend: string;
    color: string;
    delay?: number;
}

const KPIStats: React.FC<KPIStatsProps> = ({ label, value, icon: Icon, trend, color, delay = 0 }) => {
    const isPositive = trend.startsWith('+');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative overflow-hidden p-6 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-colors"
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-70", color)} />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight">{value}</span>
                        <span className={cn(
                            "text-xs font-medium px-1.5 py-0.5 rounded-full border",
                            isPositive
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                            {trend}
                        </span>
                    </div>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                    <Icon size={20} className="text-white/80" />
                </div>
            </div>

            {/* Background pattern or sparkle */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
        </motion.div>
    );
};

export default KPIStats;

import React from 'react';
import { useStore } from '../../hooks/useStore';
import { motion } from 'framer-motion';

const VelocityChart: React.FC = () => {
    const { state } = useStore();
    const history = state.sprintSettings.velocityHistory;
    const maxVelocity = Math.max(...history, 40);

    return (
        <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-1">Velocity Trend</h3>
            <p className="text-sm text-muted-foreground mb-6">Last 6 sprints performance</p>

            <div className="flex items-end justify-between h-32 w-full gap-2">
                {history.map((vel, i) => {
                    const heightPercent = (vel / maxVelocity) * 100;
                    return (
                        <div key={i} className="flex flex-col items-center flex-1 gap-2">
                            <div className="relative w-full flex justify-center group">
                                {/* Tooltip */}
                                <div className="absolute -top-8 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {vel} pts
                                </div>

                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercent}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 rounded-t-sm transition-colors relative"
                                >
                                    {/* Bar Cap */}
                                    <div className="absolute top-0 w-full h-0.5 bg-indigo-400/50" />
                                </motion.div>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">S-{state.sprintSettings.sprintNumber - 6 + i}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground border-t border-white/5 pt-3">
                <span>Avg: {Math.round(history.reduce((a, b) => a + b, 0) / history.length)} pts</span>
                <span>Target: {state.sprintSettings.capacity} pts</span>
            </div>
        </div>
    );
};

export default VelocityChart;

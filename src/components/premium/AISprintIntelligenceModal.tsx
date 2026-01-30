import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, LineChart, Target, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AISprintIntelligenceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AISprintIntelligenceModal: React.FC<AISprintIntelligenceModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'idle' | 'analyzing' | 'results'>('idle');
    const [analysisText, setAnalysisText] = useState('Initializing AI Model...');

    useEffect(() => {
        if (isOpen && step === 'idle') {
            setStep('analyzing');
            const sequence = [
                { text: 'Analyzing historical velocity (Last 6 Sprints)...', delay: 800 },
                { text: 'Evaluating team capacity and holidays...', delay: 1600 },
                { text: 'Scanning backlog for dependency risks...', delay: 2400 },
                { text: 'Calculating spillover probability...', delay: 3200 },
                { text: 'Generating optimization strategy...', delay: 4000 },
            ];

            let timeouts: NodeJS.Timeout[] = [];

            sequence.forEach(({ text, delay }) => {
                const t = setTimeout(() => setAnalysisText(text), delay);
                timeouts.push(t);
            });

            const finalT = setTimeout(() => setStep('results'), 4800);
            timeouts.push(finalT);

            return () => timeouts.forEach(clearTimeout);
        }
    }, [isOpen, step]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setStep('idle'), 500);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white z-10">
                    <X size={20} />
                </button>

                {step === 'analyzing' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 rounded-full border-t-2 border-l-2 border-indigo-500 opacity-80"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-24 h-24 rounded-full border-b-2 border-r-2 border-purple-500 opacity-60"
                            />
                            <BrainCircuit className="absolute inset-0 m-auto text-indigo-400" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                AI Sprint Intelligence
                            </h3>
                            <motion.p
                                key={analysisText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-muted-foreground mt-4 font-mono text-sm"
                            >
                                {analysisText}
                            </motion.p>
                        </div>
                    </div>
                )}

                {step === 'results' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="p-8 border-b border-white/5 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="text-yellow-400" size={24} />
                                <h2 className="text-2xl font-bold">Analysis Complete</h2>
                            </div>
                            <p className="text-muted-foreground">Based on current backlog configuration and historical performance.</p>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-auto">
                            {/* Key Insight 1 */}
                            <div className="p-4 rounded-xl bg-card border border-white/5 hover:border-indigo-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <Target size={20} />
                                    </div>
                                    <h4 className="font-semibold">Recommended Velocity</h4>
                                </div>
                                <div className="text-3xl font-bold mb-1">42 pts</div>
                                <p className="text-sm text-muted-foreground">
                                    Optimal target for 85% confidence. Current plan is 48 pts (High Risk).
                                </p>
                            </div>

                            {/* Key Insight 2 */}
                            <div className="p-4 rounded-xl bg-card border border-white/5 hover:border-red-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h4 className="font-semibold">Spillover Risk</h4>
                                </div>
                                <div className="text-3xl font-bold mb-1 text-red-400">High</div>
                                <p className="text-sm text-muted-foreground">
                                    3 complex stories assigned to frontend. Suggest splitting usage.
                                </p>
                            </div>

                            {/* Action Plan */}
                            <div className="col-span-1 md:col-span-2 space-y-3 mt-4">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recommended Actions</h4>

                                <ActionItem
                                    text="Remove user-management-api from sprint (saves 8pts)"
                                    impact="Increases confidence to 92%"
                                />
                                <ActionItem
                                    text="Assign 'Login Validator' to @sarah (Component Expert)"
                                    impact="Reduces QA risk by 15%"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-secondary/10 flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
                                Ignore
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all"
                            >
                                Apply Recommendations
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

const ActionItem = ({ text, impact }: { text: string, impact: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-white/5">
        <CheckCircle2 className="text-green-400 mt-0.5" size={16} />
        <div>
            <div className="text-sm font-medium">{text}</div>
            <div className="text-xs text-green-300/70 mt-0.5">{impact}</div>
        </div>
    </div>
);

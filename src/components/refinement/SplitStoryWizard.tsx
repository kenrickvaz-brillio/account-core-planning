import React, { useState } from 'react';
import { Story } from '../../types';
import { Layers, ArrowRight, scissors, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SplitStoryWizardProps {
    story: Story;
    onSplit: (subStories: Story[]) => void;
    onCancel: () => void;
}

export const SplitStoryWizard: React.FC<SplitStoryWizardProps> = ({ story, onSplit, onCancel }) => {
    const [step, setStep] = useState(1);

    // Mock AI generated splits
    const subStories: Story[] = [
        {
            ...story,
            id: story.id + '-A',
            key: story.key + 'A',
            title: `[FE] ${story.title}`,
            component: 'Web',
            description: 'Frontend implementation only.',
            acceptanceCriteria: story.acceptanceCriteria.slice(0, 2),
            dependencies: [],
            riskTags: [],
            unknowns: [],
            historicalSignals: { ...story.historicalSignals, prSizeHint: 'small' },
            suggestedPoints: 3,
            aiReasoning: ['Split: Frontend Scope only'],
            confidenceScore: 95
        },
        {
            ...story,
            id: story.id + '-B',
            key: story.key + 'B',
            title: `[BE] ${story.title} Logic`,
            component: 'API',
            description: 'Backend API implementation.',
            acceptanceCriteria: story.acceptanceCriteria.slice(2),
            dependencies: story.dependencies,
            riskTags: story.riskTags,
            unknowns: story.unknowns,
            historicalSignals: { ...story.historicalSignals, prSizeHint: 'medium' },
            suggestedPoints: 5,
            aiReasoning: ['Split: Backend Scope only'],
            confidenceScore: 85
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 bg-secondary/20">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Layers className="text-indigo-400" />
                        AI Split Recommendation
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Splitting <span className="text-foreground font-mono">{story.key}</span> to reduce complexity.</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Visual Comparison */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 p-4 rounded-lg bg-red-500/10 border border-red-500/20 opacity-50">
                            <h4 className="font-semibold text-sm mb-2 text-red-200">Original</h4>
                            <div className="text-2xl font-bold text-red-400">{story.suggestedPoints || 13} pts</div>
                            <p className="text-xs text-red-300/70 mt-1">Too complex</p>
                        </div>
                        <ArrowRight className="text-muted-foreground" />
                        <div className="flex-[2] grid grid-cols-2 gap-3">
                            {subStories.map(sub => (
                                <div key={sub.id} className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <h4 className="font-semibold text-xs mb-1 text-green-200 truncate">{sub.title}</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-green-400">{sub.suggestedPoints}</span>
                                        <span className="text-[10px] text-green-300/70">pts</span>
                                    </div>
                                    <p className="text-[10px] text-green-300/70 mt-1">{sub.component}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Rationale</h4>
                        <p className="text-sm p-3 bg-secondary/30 rounded-lg">
                            The original story involves both Frontend and Backend work with high complexity.
                            Splitting by architectural layer allows parallel development and reduces individual ticket risk.
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-secondary/10 flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSplit(subStories)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} />
                        Apply Split
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Story } from '../types';
import { cn, formatConfidence } from '../lib/utils';
import { Play, Check, AlertTriangle, Lightbulb, ChevronRight, Calculator, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EstimationPage: React.FC = () => {
    const { state, dispatch } = useStore();
    const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

    const onEstimateAll = () => {
        dispatch({ type: 'ESTIMATE_ALL_CANDIDATES' });
    };

    const activeStory = state.sprintCandidates.find(s => s.id === selectedStoryId);

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Main List Area */}
            <div className="flex-1 p-8 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Estimation Workspace</h1>
                        <p className="text-muted-foreground mt-1">Review AI suggestions and refine points.</p>
                    </div>
                    <button
                        onClick={onEstimateAll}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
                    >
                        <Calculator size={16} />
                        Run AI Estimation
                    </button>
                </div>

                <div className="space-y-4">
                    {state.sprintCandidates.length === 0 && (
                        <div className="text-center p-12 bg-secondary/10 rounded-xl border border-dashed border-white/10">
                            <p className="text-muted-foreground">No stories to estimate. Go to Import.</p>
                        </div>
                    )}
                    {state.sprintCandidates.map((story) => (
                        <StoryEstimateCard
                            key={story.id}
                            story={story}
                            isActive={selectedStoryId === story.id}
                            onClick={() => setSelectedStoryId(story.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Right Logic Drawer */}
            <AnimatePresence mode='wait'>
                {activeStory && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-96 border-l border-white/5 bg-card/50 backdrop-blur-2xl p-6 overflow-auto"
                    >
                        <ReasoningPanel story={activeStory} onClose={() => setSelectedStoryId(null)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components

const StoryEstimateCard = ({ story, isActive, onClick }: { story: Story, isActive: boolean, onClick: () => void }) => {
    const confidence = story.confidenceScore ? formatConfidence(story.confidenceScore) : null;
    const hasEstimate = story.suggestedPoints !== undefined;

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group",
                isActive
                    ? "bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/50"
                    : "bg-card/40 border-white/5 hover:border-white/10"
            )}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{story.key}</span>
                        {confidence && (
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold", confidence.color.replace('text-', 'border-').replace('500', '500/30 text-'))}>
                                {confidence.label} Conf
                            </span>
                        )}
                    </div>
                    <h4 className="font-medium text-sm text-foreground/90">{story.title}</h4>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                    {hasEstimate ? (
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-indigo-400">{story.suggestedPoints}</span>
                            <span className="text-[10px] text-muted-foreground">pts</span>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-muted-foreground/30">
                            ?
                        </div>
                    )}
                </div>
            </div>

            {/* Mini Logic Preview */}
            {hasEstimate && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Lightbulb size={12} className="text-yellow-500/70" />
                        AI Reasoning Available
                    </span>
                    <ChevronRight size={14} className={`transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </div>
            )}
        </div>
    );
};

const ReasoningPanel = ({ story, onClose }: { story: Story, onClose: () => void }) => {
    const { dispatch } = useStore();

    const handleAccept = () => {
        if (story.suggestedPoints) {
            dispatch({ type: 'UPDATE_STORY_POINTS', storyId: story.id, points: story.suggestedPoints });
            onClose();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground mb-4">
                    Close Panel
                </button>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">{story.key}</span>
                </div>
                <h3 className="text-xl font-bold leading-tight">{story.title}</h3>
            </div>

            {/* AI Estimation Breakdown */}
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-indigo-300">AI Analysis</span>
                    <span className="text-2xl font-bold">{story.suggestedPoints || '?'} pts</span>
                </div>

                <div className="space-y-2">
                    {story.aiReasoning?.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-black/20 p-2 rounded">
                            <Check size={14} className="mt-0.5 text-green-500 shrink-0" />
                            <span>{reason}</span>
                        </div>
                    ))}
                    {!story.suggestedPoints && <p className="text-xs text-muted-foreground italic">Run estimation to see analysis.</p>}
                </div>
            </div>

            {/* Risk Factors */}
            {story.riskTags.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-red-300">
                        <AlertTriangle size={14} /> Risk Factors
                    </h4>
                    {story.riskTags.map(risk => (
                        <div key={risk.id} className="p-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-200">
                            <span className="font-bold uppercase tracking-wider text-[10px] mr-2 opacity-70">{risk.type}</span>
                            {risk.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-white/5 space-y-3">
                <button
                    onClick={handleAccept}
                    disabled={!story.suggestedPoints}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-sm font-medium transition-colors"
                >
                    Accept Recommendation
                </button>
                <button className="w-full py-2 bg-secondary hover:bg-secondary/80 rounded-md text-secondary-foreground text-sm font-medium transition-colors">
                    Adjust Manually
                </button>
                <button className="w-full py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-md text-muted-foreground text-sm font-medium transition-colors">
                    Refine / Split Story
                </button>
            </div>
        </div>
    );
};

export default EstimationPage;

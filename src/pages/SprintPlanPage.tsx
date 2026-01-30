import React from 'react';
import { useStore } from '../hooks/useStore';
import { Story } from '../types';
import { cn } from '../lib/utils';
import { Plus, X, Calendar, BarChart3, ArrowRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SprintPlanPage: React.FC = () => {
    const { state, dispatch } = useStore();

    // Candidates vs Selected
    const candidates = state.sprintCandidates;
    const selected = state.sprintBacklog;

    // Capacity Logic
    const avgVelocity = 45; // Mock Avg
    const totalPoints = selected.reduce((sum, s) => sum + (s.suggestedPoints || 0), 0);
    const capacityPercent = Math.min(100, Math.round((totalPoints / avgVelocity) * 100));

    const handleAdd = (story: Story) => {
        dispatch({ type: 'ADD_TO_SPRINT', storyId: story.id });
    };

    const handleRemove = (storyId: string) => {
        dispatch({ type: 'REMOVE_FROM_SPRINT', storyId });
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Left: Backlog Candidates */}
            <div className="w-1/3 border-r border-white/5 bg-black/10 flex flex-col">
                <div className="p-4 border-b border-white/5">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <BarChart3 size={18} className="text-muted-foreground" />
                        Backlog Candidates
                    </h2>
                    <p className="text-xs text-muted-foreground">Stories ready for sprint.</p>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                    {candidates.filter(c => !selected.find(s => s.id === c.id)).map(story => (
                        <div key={story.id} className="p-3 rounded-lg border border-white/5 bg-card hover:bg-white/5 group transition-colors flex items-start justify-between">
                            <div className="flex-1">
                                <span className="text-xs font-mono text-muted-foreground">{story.key}</span>
                                <h4 className="text-sm font-medium">{story.title}</h4>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary/50 border border-white/5">
                                        {story.suggestedPoints || '?'} pts
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAdd(story)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ))}
                    {candidates.length === 0 && <div className="text-center p-8 text-muted-foreground text-sm">No candidates found.</div>}
                </div>
            </div>

            {/* Right: Sprint Scope */}
            <div className="flex-1 flex flex-col bg-gradient-to-br from-card to-background">
                {/* Header / Capacity */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="text-indigo-400" />
                            Sprint 24 Plan
                        </h1>
                        <p className="text-muted-foreground text-sm">Oct 24 - Nov 7</p>
                    </div>

                    <div className="flex flex-col items-end min-w-[200px]">
                        <div className="text-sm font-medium mb-1">
                            Capacity: <span className={capacityPercent > 100 ? 'text-red-400' : 'text-green-400'}>{totalPoints}</span> / {avgVelocity} pts
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${capacityPercent}%` }}
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    capacityPercent > 100 ? "bg-red-500" : capacityPercent > 90 ? "bg-orange-500" : "bg-green-500"
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Selected List */}
                <div className="flex-1 overflow-auto p-6">
                    <AnimatePresence>
                        {selected.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 border-2 border-dashed border-white/5 rounded-xl">
                                <ArrowRight size={48} className="mb-4" />
                                <p>Add stories from the backlog to build your sprint.</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-3">
                            {selected.map(story => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={story.id}
                                    className="p-4 rounded-xl border border-white/5 bg-card/50 backdrop-blur-sm flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 text-sm">
                                            {story.suggestedPoints}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{story.title}</h4>
                                            <span className="text-xs font-mono text-muted-foreground">{story.key}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
                                        <span>{story.assignee?.name || 'Unassigned'}</span>
                                        <span className="w-px h-4 bg-white/10" />
                                        <span>{story.component}</span>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(story.id)}
                                        className="p-2 rounded hover:bg-red-500/10 hover:text-red-400 text-muted-foreground transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all">
                        <Download size={18} />
                        Export to Jira
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SprintPlanPage;

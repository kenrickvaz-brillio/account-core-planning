import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { SplitStoryWizard } from '../components/refinement/SplitStoryWizard';
import { Story } from '../types';
import { Scissors, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RefinementPage: React.FC = () => {
    const { state, dispatch } = useStore();
    const [splitCandidate, setSplitCandidate] = useState<Story | null>(null);

    // Filter for "Complex" or "Unrefined" stories
    const storiesToRefine = state.sprintCandidates.filter(s => {
        const points = s.suggestedPoints || 0;
        const confidence = s.confidenceScore;
        // Logic: Points >= 8 OR Low Confidence OR Vague AC
        return points >= 8 || confidence < 70;
    });

    const handleSplit = (subStories: Story[]) => {
        if (splitCandidate) {
            dispatch({ type: 'SPLIT_STORY', originalId: splitCandidate.id, subStories });
            setSplitCandidate(null);
        }
    };

    const handleRewriteAC = (id: string) => {
        // Mock AI Rewrite
        dispatch({
            type: 'FIX_VALIDATION_ISSUES',
            storyId: id,
            fixes: {
                acceptanceCriteria: [
                    { id: 'AC-New-1', text: 'Verify input validates email format logic (RFC 5322)' },
                    { id: 'AC-New-2', text: 'Ensure error state is displayed within 200ms' },
                    { id: 'AC-New-3', text: 'Test with screen reader for ARIA compliance' }
                ],
                confidenceScore: 95 // Boost confidence
            }
        });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Refinement Studio</h1>
                    <p className="text-muted-foreground mt-1">Split complex stories and clarify requirements.</p>
                </div>
            </div>

            {storiesToRefine.length === 0 ? (
                <div className="text-center p-12 bg-secondary/10 rounded-xl border border-dashed border-white/10">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500/50" />
                    <h3 className="text-xl font-medium">All Clean!</h3>
                    <p className="text-muted-foreground">No high-complexity candidates found needing refinement.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {storiesToRefine.map(story => (
                        <RefinementCard
                            key={story.id}
                            story={story}
                            onSplit={() => setSplitCandidate(story)}
                            onRewrite={() => handleRewriteAC(story.id)}
                        />
                    ))}
                </div>
            )}

            {splitCandidate && (
                <SplitStoryWizard
                    story={splitCandidate}
                    onSplit={handleSplit}
                    onCancel={() => setSplitCandidate(null)}
                />
            )}
        </div>
    );
};

const RefinementCard = ({ story, onSplit, onRewrite }: { story: Story, onSplit: () => void, onRewrite: () => void }) => {
    return (
        <motion.div layout id={story.id} className="p-6 rounded-xl bg-card border border-white/5 flex items-center justify-between gap-6 group hover:border-white/10 transition-colors">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">{story.key}</span>
                    {story.suggestedPoints && story.suggestedPoints >= 8 && (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Too Large
                        </span>
                    )}
                    {story.confidenceScore < 70 && (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            Vague
                        </span>
                    )}
                </div>
                <h4 className="font-semibold text-lg">{story.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{story.description}</p>
            </div>

            <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                {story.suggestedPoints && story.suggestedPoints >= 8 && (
                    <button
                        onClick={onSplit}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors"
                    >
                        <Scissors size={16} />
                        Split Story (AI)
                    </button>
                )}

                <button
                    onClick={onRewrite}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-medium transition-colors"
                >
                    <Wand2 size={16} />
                    Clarify AC
                </button>
            </div>
        </motion.div>
    );
};

// Import helper for icon
import { CheckCircle2 } from 'lucide-react';

export default RefinementPage;

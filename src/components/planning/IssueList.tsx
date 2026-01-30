import React from 'react';
import { Story, Epic } from '../../types';
import { BadgeCheck, AlertCircle, Circle, ArrowUpCircle } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assumes cn is in lib/utils

interface IssueListProps {
    stories: Story[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    epics: Epic[];
}

export const IssueList: React.FC<IssueListProps> = ({ stories, selectedIds, onToggleSelect }) => {
    if (stories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-white/10">
                <Circle size={48} className="mb-4 opacity-20" />
                <p>No issues found matching filters.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {stories.map(story => {
                const isSelected = selectedIds.includes(story.id);
                // const epic = epics.find(e => {
                //     return e.id === story.epicId;
                // });

                return (
                    <div
                        key={story.id}
                        onClick={() => onToggleSelect(story.id)}
                        className={cn(
                            "group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                            isSelected
                                ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                                : "bg-card/40 border-white/5 hover:bg-white/5 hover:border-white/10"
                        )}
                    >
                        {/* Checkbox */}
                        <div className={cn(
                            "mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-muted-foreground/30 group-hover:border-indigo-400/50"
                        )}>
                            {isSelected && <BadgeCheck size={14} />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground">{story.key}</span>
                                <PriorityBadge priority={story.priority} />
                                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-white/5">
                                    {story.type}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-white/5">
                                    {story.component}
                                </span>
                            </div>
                            <h4 className={cn("font-medium text-sm", isSelected ? "text-indigo-700 dark:text-indigo-100" : "text-foreground")}>
                                {story.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <ArrowUpCircle size={12} />
                                    {story.acceptanceCriteria.length} ACs
                                </span>
                                {story.dependencies.length > 0 && (
                                    <span className="flex items-center gap-1 text-yellow-500/80">
                                        <AlertCircle size={12} />
                                        {story.dependencies.length} Deps
                                    </span>
                                )}
                                {story.riskTags.length > 0 && (
                                    <span className="flex items-center gap-1 text-red-400/80">
                                        <AlertCircle size={12} />
                                        {story.riskTags.length} Risks
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Existing Points if any */}
                        {story.existingPoints && (
                            <div className="flex flex-col items-center justify-center bg-secondary/50 rounded p-2 min-w-[3rem]">
                                <span className="text-lg font-bold">{story.existingPoints}</span>
                                <span className="text-[10px] text-muted-foreground">pts</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const color = {
        'Critical': 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-200 dark:border-red-400/20',
        'High': 'text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20',
        'Medium': 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20',
        'Low': 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20',
    }[priority] || 'text-muted-foreground';

    return (
        <span className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border", color)}>
            {priority}
        </span>
    );
};

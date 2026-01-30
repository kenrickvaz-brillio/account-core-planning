import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { IssueList } from '../components/planning/IssueList';
import { Search, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImportPage: React.FC = () => {
    const { state, dispatch } = useStore();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('All');

    const handleToggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleImport = () => {
        dispatch({ type: 'IMPORT_STORIES', storyIds: selectedIds });
        navigate('/estimate');
    };

    const filteredStories = state.importCandidates.filter(s => {
        const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.key.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'All' || s.type === typeFilter;
        return matchSearch && matchType;
    });

    return (
        <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Import from Jira</h1>
                    <p className="text-muted-foreground mt-1">Select candidates for the upcoming sprint.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        {selectedIds.length} selected
                    </div>
                    <button
                        onClick={handleImport}
                        disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-primary/20"
                    >
                        <Download size={16} />
                        Import to Sprint
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 bg-card/30 p-3 rounded-lg border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search by key or title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-muted-foreground" />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    >
                        <option value="All">All Types</option>
                        <option value="Story">Story</option>
                        <option value="Bug">Bug</option>
                        <option value="Spike">Spike</option>
                        <option value="Task">Task</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto pr-2">
                <IssueList
                    stories={filteredStories}
                    epics={state.epics}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggle}
                />
            </div>
        </div>
    );
};

export default ImportPage;

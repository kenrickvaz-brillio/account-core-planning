import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import VelocityChart from '../components/dashboard/VelocityChart';
import KPIStats from '../components/dashboard/KPIStats';
import { CheckCircle2, Clock, Target, AlertTriangle, BrainCircuit, Sparkles } from 'lucide-react';
import { AISprintIntelligenceModal } from '../components/premium/AISprintIntelligenceModal';

const Dashboard: React.FC = () => {
    const { state } = useStore();
    const navigate = useNavigate();
    const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);

    const stats = [
        { label: 'Planning Time Saved', value: '4.5 hrs', icon: Clock, trend: '+12%', color: 'from-blue-500/20 to-blue-600/5' },
        { label: 'Estimation Variance', value: '±1.2 pts', icon: Target, trend: '-0.5', color: 'from-green-500/20 to-green-600/5' },
        { label: 'Spillover Risk', value: 'Low', icon: AlertTriangle, trend: 'Stable', color: 'from-yellow-500/20 to-yellow-600/5' },
        { label: 'AI Confidence', value: '92%', icon: BrainCircuit, trend: '+5%', color: 'from-purple-500/20 to-purple-600/5' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sprint Planning {state.sprintSettings.sprintNumber + 1}</h1>
                    <p className="text-muted-foreground mt-1">
                        Focus: <span className="text-indigo-400">Account Core Hardening</span> &bull; Capacity: {state.sprintSettings.capacity} pts
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
                    >
                        <Sparkles size={16} />
                        Sprint Intelligence
                    </button>
                    <button
                        onClick={() => navigate('/import')}
                        className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        Start New Sprint
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <KPIStats key={i} {...stat} delay={i * 0.1} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Velocity Chart */}
                <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Velocity Trend</h3>
                        <select className="bg-black/20 border-white/10 rounded-md text-xs p-1">
                            <option>Last 6 Sprints</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                    <div className="h-64 w-full">
                        <VelocityChart />
                    </div>
                </div>

                {/* Readiness / Actions */}
                <div className="space-y-6">
                    {/* Readiness */}
                    <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-4">Sprint Readiness</h3>
                        <div className="space-y-4">
                            <CheckItem label="Backlog refined (80%)" checked />
                            <CheckItem label="Capacity checks passed" checked />
                            <CheckItem label="Dependencies resolved" checked={false} />
                            <CheckItem label="Risk assessment complete" checked />
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-white/5 rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <Sparkles size={16} className="text-yellow-400" />
                            AI Suggestions
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            3 potential blockers detected in upcoming candidate stories.
                        </p>
                        <button
                            onClick={() => navigate('/validate')}
                            className="text-indigo-400 text-sm font-medium hover:underline"
                        >
                            Review Risks &rarr;
                        </button>
                    </div>
                </div>
            </div>

            <AISprintIntelligenceModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
        </div>
    );
};

const CheckItem = ({ label, checked }: { label: string, checked: boolean }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-white/5">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checked ? 'bg-green-500/20 text-green-500' : 'bg-secondary text-muted-foreground'}`}>
            <CheckCircle2 size={14} />
        </div>
        <span className={checked ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </div>
);



export default Dashboard;

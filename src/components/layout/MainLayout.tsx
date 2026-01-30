import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Download,
    Calculator,
    Scissors,
    CheckCircle2,
    CalendarDays,
    Menu,
    Bell,
    Search,
    X
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MainLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop + Mobile) */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-card/95 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:static md:bg-card/30 flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                <Link to="/" onClick={onClose} className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold">AC</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight hover:text-indigo-400 transition-colors">Account Core</span>
                </Link>
                <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={onClose} />
                <div className="h-px bg-white/5 my-3 mx-3" />
                <NavItem to="/import" icon={<Download size={20} />} label="Import" onClick={onClose} />
                <NavItem to="/estimate" icon={<Calculator size={20} />} label="Estimate" onClick={onClose} />
                <NavItem to="/refine" icon={<Scissors size={20} />} label="Refine" onClick={onClose} />
                <NavItem to="/validate" icon={<CheckCircle2 size={20} />} label="Validate" onClick={onClose} />
                <NavItem to="/plan" icon={<CalendarDays size={20} />} label="Sprint Plan" onClick={onClose} />
            </div>

            <div className="p-4 border-t border-white/5">
                <div className="glass-card p-3 rounded-lg flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        KV
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">Kenrick Vaz</p>
                        <p className="text-xs text-muted-foreground truncate">Product Owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const NavItem = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 group relative",
                isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
        >
            {({ isActive }) => (
                <>
                    {icon}
                    <span>{label}</span>
                    {isActive && (
                        <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                </>
            )}
        </NavLink>
    );
};

import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const Header = ({ onToggleMenu }: { onToggleMenu: () => void }) => {
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const getTitle = () => {
        const p = location.pathname;
        if (p.includes('dashboard')) return 'Sprint Dashboard';
        if (p.includes('import')) return 'Import Issues';
        if (p.includes('estimate')) return 'Estimation Workspace';
        if (p.includes('refine')) return 'Refinement & Splitting';
        if (p.includes('validate')) return 'Validation & Hygiene';
        if (p.includes('plan')) return 'Sprint Plan Builder';
        return 'Account Core';
    };

    return (
        <header className="h-16 border-b border-white/5 dark:border-white/5 bg-background/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
                <button onClick={onToggleMenu} className="md:hidden mr-4 text-muted-foreground hover:text-foreground transition-colors">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold tracking-tight">{getTitle()}</h1>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="hidden md:flex items-center bg-secondary/50 rounded-full px-3 py-1.5 border border-white/5 dark:border-white/5">
                    <Search size={14} className="text-muted-foreground mr-2" />
                    <input
                        type="text"
                        placeholder="Search stories..."
                        className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground/70"
                    />
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </button>
            </div>
        </header>
    );
};

export default MainLayout;

export type Role = 'FE' | 'BE' | 'Fullstack' | 'QA' | 'Product' | 'Design' | 'Lead';

export interface User {
    id: string;
    name: string;
    avatar: string;
    role: Role;
}

export type StoryType = 'Story' | 'Bug' | 'Spike' | 'Task';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Component = 'Web' | 'API' | 'DB' | 'Integration' | 'Mobile';
export type StoryStatus = 'Backlog' | 'Candidate' | 'In Sprint' | 'Completed';

export interface Dependency {
    id: string; // The Key of the story (e.g., ACC-123)
    type: 'internal' | 'external';
    description?: string;
}

export interface AC {
    id: string;
    text: string;
    isVague?: boolean; // AI Detected
}

export interface RiskTag {
    id: string;
    type: 'security' | 'migration' | 'cross-team' | 'data' | 'perf' | 'unknown';
    label: string;
    severity: 'low' | 'medium' | 'high';
}

export interface Story {
    id: string;
    key: string; // ACC-101
    title: string;
    description: string;
    acceptanceCriteria: AC[];
    type: StoryType;
    component: Component;
    priority: Priority;
    dependencies: Dependency[];
    unknowns: string[];
    existingPoints?: number; // Previous estimation
    suggestedPoints?: number; // AI Suggested
    finalPoints?: number; // User Accepted
    assignee?: User;

    // AI Attributes
    confidenceScore: number; // 0-100
    aiReasoning: string[];
    riskTags: RiskTag[];

    // Historical Signals (Mocked)
    historicalSignals: {
        prSizeHint: 'small' | 'medium' | 'large' | 'xl';
        touchedModulesCount: number;
        requiresE2E: boolean;
    };

    status: StoryStatus;

    // Validation status
    validationIssues?: ValidationIssue[];
}

export interface Epic {
    id: string;
    title: string;
    description: string;
    color: string;
}

export interface Project {
    id: string;
    name: string;
    key: string;
    epics: Epic[];
}

export interface SprintSettings {
    capacity: number;
    velocityHistory: number[];
    wipLimit: number;
    sprintNumber: number;
}

export interface ValidationIssue {
    id: string;
    type: 'outlier' | 'too_big' | 'dependency_risk' | 'missing_ac' | 'vague_ac';
    message: string;
    severity: 'warning' | 'critical';
}

export interface Sprint {
    id: string;
    name: string;
    goal?: string; // AI Generated
    stories: Story[];
    status: 'planning' | 'active' | 'completed';
    stats: {
        totalPoints: number;
        riskAdjustedLoad: number;
        confidence: number;
        spilloverProb: number;
    };
    narrative?: string; // Executive Summary
}

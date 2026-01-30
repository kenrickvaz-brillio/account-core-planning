import React, { createContext, useReducer } from 'react';
import { Project, Epic, Story, User, SprintSettings } from '../types';
import { MOCK_EPICS, CURRENT_PROJECT, MOCK_USERS, MOCK_SPRINT_SETTINGS, MOCK_STORIES } from '../data/mockData';
import { AI_LOGIC } from '../lib/ai-logic';

export interface State {
    project: Project;
    epics: Epic[];
    users: User[];
    sprintSettings: SprintSettings;

    // Issue Lists
    importCandidates: Story[]; // Available from Jira
    sprintCandidates: Story[]; // Selected for Pointing
    sprintBacklog: Story[]; // Final Sprint Plan

    // State
    isLoading: boolean;

    // AI Premium Features
    sprintGoal: string | null;
    sprintNarrative: string | null;
    sprintRiskLoad: number;
}

const initialState: State = {
    project: CURRENT_PROJECT,
    epics: MOCK_EPICS,
    users: MOCK_USERS,
    sprintSettings: MOCK_SPRINT_SETTINGS,

    importCandidates: MOCK_STORIES,
    sprintCandidates: [],
    sprintBacklog: [],

    isLoading: false,
    sprintGoal: null,
    sprintNarrative: null,
    sprintRiskLoad: 0
};

export type Action =
    | { type: 'IMPORT_STORIES'; storyIds: string[] }
    | { type: 'ESTIMATE_STORY'; storyId: string }
    | { type: 'ESTIMATE_ALL_CANDIDATES' }
    | { type: 'UPDATE_STORY_POINTS'; storyId: string; points: number }
    | { type: 'SPLIT_STORY'; originalId: string; subStories: Story[] }
    | { type: 'MOVE_TO_WIP'; storyId: string } // Not used yet
    | { type: 'ADD_TO_SPRINT'; storyId: string }
    | { type: 'REMOVE_FROM_SPRINT'; storyId: string }
    | { type: 'SET_SPRINT_INTELLIGENCE'; goal: string; narrative: string; riskLoad: number }
    | { type: 'FIX_VALIDATION_ISSUES'; storyId: string; fixes: Partial<Story> }
    | { type: 'SET_LOADING'; isLoading: boolean };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'IMPORT_STORIES': {
            const selected = state.importCandidates.filter(s => action.storyIds.includes(s.id));
            const remaining = state.importCandidates.filter(s => !action.storyIds.includes(s.id));
            return {
                ...state,
                importCandidates: remaining,
                sprintCandidates: [...state.sprintCandidates, ...selected]
            };
        }

        case 'ESTIMATE_STORY': {
            const candidates = state.sprintCandidates.map(s => {
                if (s.id === action.storyId) {
                    const { points, reasoning } = AI_LOGIC.estimateScore(s);
                    const confidence = AI_LOGIC.calculateConfidence(s);
                    return { ...s, suggestedPoints: points, aiReasoning: reasoning, confidenceScore: confidence };
                }
                return s;
            });
            return { ...state, sprintCandidates: candidates };
        }

        case 'ESTIMATE_ALL_CANDIDATES': {
            const candidates = state.sprintCandidates.map(s => {
                if (!s.suggestedPoints) {
                    const { points, reasoning } = AI_LOGIC.estimateScore(s);
                    const confidence = AI_LOGIC.calculateConfidence(s);
                    return { ...s, suggestedPoints: points, aiReasoning: reasoning, confidenceScore: confidence };
                }
                return s;
            });
            return { ...state, sprintCandidates: candidates };
        }

        case 'UPDATE_STORY_POINTS': {
            return {
                ...state,
                sprintCandidates: state.sprintCandidates.map(s =>
                    s.id === action.storyId ? { ...s, finalPoints: action.points } : s
                ),
                sprintBacklog: state.sprintBacklog.map(s =>
                    s.id === action.storyId ? { ...s, finalPoints: action.points } : s
                )
            };
        }

        case 'SPLIT_STORY': {
            const { originalId, subStories } = action;
            // Remove original and add subStories
            const filteredCandidates = state.sprintCandidates.filter(s => s.id !== originalId);

            // Auto-estimate new sub-stories
            const estimatedSubStories = subStories.map(s => {
                const { points, reasoning } = AI_LOGIC.estimateScore(s);
                const confidence = AI_LOGIC.calculateConfidence(s);
                return { ...s, suggestedPoints: points, aiReasoning: reasoning, confidenceScore: confidence };
            });

            return {
                ...state,
                sprintCandidates: [...filteredCandidates, ...estimatedSubStories]
            };
        }

        case 'ADD_TO_SPRINT': {
            const story = state.sprintCandidates.find(s => s.id === action.storyId);
            if (!story) return state;
            return {
                ...state,
                sprintCandidates: state.sprintCandidates.filter(s => s.id !== action.storyId),
                sprintBacklog: [...state.sprintBacklog, story]
            };
        }

        case 'REMOVE_FROM_SPRINT': {
            const story = state.sprintBacklog.find(s => s.id === action.storyId);
            if (!story) return state;
            return {
                ...state,
                sprintBacklog: state.sprintBacklog.filter(s => s.id !== action.storyId),
                sprintCandidates: [...state.sprintCandidates, story]
            };
        }

        case 'SET_SPRINT_INTELLIGENCE': {
            return {
                ...state,
                sprintGoal: action.goal,
                sprintNarrative: action.narrative,
                sprintRiskLoad: action.riskLoad
            };
        }

        case 'FIX_VALIDATION_ISSUES': {
            return {
                ...state,
                sprintCandidates: state.sprintCandidates.map(s =>
                    s.id === action.storyId ? { ...s, ...action.fixes } : s
                )
            };
        }

        case 'SET_LOADING':
            return { ...state, isLoading: action.isLoading };

        default:
            return state;
    }
};

export const StoreContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

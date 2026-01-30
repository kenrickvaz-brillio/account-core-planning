import { Story, ValidationIssue } from '../types';

export const AI_LOGIC = {
    // Deterministic Point Estimation
    estimateScore: (story: Story): { points: number; reasoning: string[] } => {
        let score = 0;
        const reasoning: string[] = [];

        // 1. Base Complexity by Component
        switch (story.component) {
            case 'Web': score += 1; reasoning.push('Frontend component (Web): +1 complexity'); break;
            case 'API': score += 2; reasoning.push('Backend Logic (API): +2 complexity'); break;
            case 'DB': score += 3; reasoning.push('Database Schema Changes: +3 complexity'); break;
            case 'Integration': score += 3; reasoning.push('External Integration: +3 complexity'); break;
            default: score += 1;
        }

        // 2. Acceptance Criteria
        const acCount = story.acceptanceCriteria.length;
        if (acCount === 0) {
            score += 0; // Handled in confidence
        } else if (acCount <= 2) {
            score += 1;
        } else if (acCount <= 5) {
            score += 2;
            reasoning.push(`Significant scope (${acCount} ACs): +2 complexity`);
        } else {
            score += 3;
            reasoning.push(`Heavy scope (${acCount}+ ACs): +3 complexity`);
        }

        // 3. Dependencies
        story.dependencies.forEach(dep => {
            if (dep.type === 'internal') {
                score += 1;
                reasoning.push('Internal Dependency: +1 complexity');
            } else {
                score += 2;
                reasoning.push('External Dependency (Blocking Risk): +2 complexity');
            }
        });

        // 4. Unknowns
        if (story.unknowns.length > 0) {
            const penalty = Math.min(story.unknowns.length, 3);
            score += penalty;
            reasoning.push(`${story.unknowns.length} Unknowns identified: +${penalty} complexity`);
        }

        // 5. Risk Tags
        story.riskTags.forEach(risk => {
            if (['security', 'migration', 'data'].includes(risk.type)) {
                score += 2;
                reasoning.push(`High Risk Factor (${risk.label}): +2 complexity`);
            } else {
                score += 1;
                reasoning.push(`Risk Factor (${risk.label}): +1 complexity`);
            }
        });

        // 6. Historical Signals
        if (story.historicalSignals.prSizeHint === 'large' || story.historicalSignals.prSizeHint === 'xl') {
            score += 2;
            reasoning.push('Historical comparison suggests Large PR: +2 complexity');
        }
        if (story.historicalSignals.requiresE2E) {
            score += 1;
            reasoning.push('Requires E2E Testing: +1 complexity');
        }

        // Map Score to Fibonacci
        let points = 1;
        if (score <= 2) points = 1;
        else if (score <= 4) points = 2;
        else if (score <= 6) points = 3;
        else if (score <= 8) points = 5;
        else if (score <= 11) points = 8;
        else points = 13;

        return { points, reasoning };
    },

    calculateConfidence: (story: Story): number => {
        let confidence = 90;

        if (story.unknowns.length >= 2) confidence -= 10;
        if (story.dependencies.some(d => d.type === 'external')) confidence -= 15;
        if (story.acceptanceCriteria.length === 0) confidence -= 20;

        // Detect vague AC
        const vagueKeywords = ['should', 'easy', 'fast', 'properly', 'etc', 'as needed'];
        const hasVague = story.acceptanceCriteria.some(ac =>
            vagueKeywords.some(k => ac.text.toLowerCase().includes(k))
        );
        if (hasVague) confidence -= 10;

        if (story.riskTags.some(r => r.type === 'migration')) confidence -= 10;

        return Math.max(confidence, 40);
    },

    validateStory: (story: Story): ValidationIssue[] => {
        const issues: ValidationIssue[] = [];
        const points = story.suggestedPoints || story.finalPoints || 0;
        const confidence = story.confidenceScore;

        // missing AC
        if (story.acceptanceCriteria.length === 0) {
            issues.push({ id: 'v1', type: 'missing_ac', message: 'No Acceptance Criteria found.', severity: 'critical' });
        }

        // outlier
        if (points >= 8 && confidence <= 60) {
            issues.push({ id: 'v2', type: 'outlier', message: 'High complexity with low confidence. Candidate for spike or split.', severity: 'warning' });
        }
        if (points <= 2 && story.riskTags.some(r => r.type === 'security' || r.type === 'migration')) {
            issues.push({ id: 'v3', type: 'outlier', message: 'Risky story estimated too low. Consider buffer.', severity: 'critical' });
        }

        // too big
        if (points >= 13) {
            issues.push({ id: 'v4', type: 'too_big', message: 'Story is too large (13 pts) for a single sprint. Must split.', severity: 'critical' });
        }

        return issues;
    }
};

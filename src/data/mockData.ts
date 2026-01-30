import { Project, Story, Epic, User, SprintSettings } from '../types';

export const CURRENT_PROJECT: Project = {
    id: 'PROJ-01',
    key: 'ACC',
    name: 'Account Core',
    epics: []
};

export const MOCK_EPICS: Epic[] = [
    { id: 'EPIC-1', title: 'Account Profile & Preferences', description: 'User profile management and settings', color: 'bg-blue-500' },
    { id: 'EPIC-2', title: 'Authentication & Session Hardening', description: 'Security improvements for auth flows', color: 'bg-purple-500' },
    { id: 'EPIC-3', title: 'Billing Address & Compliance', description: 'Address validation and tax compliance', color: 'bg-green-500' },
];

export const MOCK_USERS: User[] = [
    { id: 'U1', name: 'Kenrick Vaz', avatar: 'KV', role: 'Fullstack' },
    { id: 'U2', name: 'Sarah Chen', avatar: 'SC', role: 'FE' },
    { id: 'U3', name: 'Mike Ross', avatar: 'MR', role: 'BE' },
    { id: 'U4', name: 'Emily Blunt', avatar: 'EB', role: 'QA' },
];

export const MOCK_SPRINT_SETTINGS: SprintSettings = {
    capacity: 30,
    wipLimit: 8,
    velocityHistory: [32, 28, 35, 30, 33, 29],
    sprintNumber: 42
};

// Generate 18-20 Realistic Stories
export const MOCK_STORIES: Story[] = [
    {
        id: 'S1', key: 'ACC-101', type: 'Story', priority: 'High', component: 'Web',
        title: 'Update User Profile UI to new Design System',
        description: 'Migrate the user profile settings page to use the new V2 design system components. Ensure responsive behavior.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'All input fields use the new InputV2 component' },
            { id: 'AC2', text: 'Profile image upload supports drag and drop' },
            { id: 'AC3', text: 'Mobile view stacks fields vertically' }
        ],
        dependencies: [], unknowns: [], riskTags: [],
        historicalSignals: { prSizeHint: 'medium', touchedModulesCount: 3, requiresE2E: true },
        status: 'Candidate', confidenceScore: 90, aiReasoning: []
    },
    {
        id: 'S2', key: 'ACC-102', type: 'Story', priority: 'Medium', component: 'API',
        title: 'Implement Address Validation API endpoint',
        description: 'Create a new POST /api/v1/address/validate endpoint that integrates with the SmartyStreets provider.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Endpoint accepts AddressDTO' },
            { id: 'AC2', text: 'Returns standardized address or error' },
            { id: 'AC3', text: 'Handles timeouts gracefully' }
        ],
        dependencies: [{ id: 'Ext-Team', type: 'external', description: 'Waiting on Platform Team for API Key' }],
        unknowns: ['Rate limits for the provider?'],
        riskTags: [{ id: 'R1', type: 'cross-team', label: 'External Dep', severity: 'medium' }],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 2, requiresE2E: false },
        status: 'Candidate', confidenceScore: 75, aiReasoning: []
    },
    {
        id: 'S3', key: 'ACC-105', type: 'Story', priority: 'Critical', component: 'DB',
        title: 'Migrate User Preferences to PostgreSQL',
        description: 'Move user preference data from Redis (legacy) to the main PostgreSQL database for persistence and reporting.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Schema migration script created' },
            { id: 'AC2', text: 'Data backfill job runs successfully' },
            { id: 'AC3', text: 'Verify data integrity after migration' }
        ],
        dependencies: [],
        unknowns: ['Downtime window required?', 'Data volume estimation'],
        riskTags: [{ id: 'R2', type: 'migration', label: 'Data Migration', severity: 'high' }],
        historicalSignals: { prSizeHint: 'large', touchedModulesCount: 8, requiresE2E: true },
        status: 'Candidate', confidenceScore: 60, aiReasoning: []
    },
    {
        id: 'S4', key: 'ACC-110', type: 'Bug', priority: 'High', component: 'Web',
        title: 'Fix Session Timeout Modal getting stuck',
        description: 'Users report the session timeout modal does not close after clicking "Extend Session".',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Clicking Extend calls the refresh token API' },
            { id: 'AC2', text: 'Modal closes immediately on success' }
        ],
        dependencies: [], unknowns: [], riskTags: [],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 1, requiresE2E: false },
        status: 'Candidate', confidenceScore: 95, aiReasoning: []
    },
    {
        id: 'S5', key: 'ACC-112', type: 'Story', priority: 'Medium', component: 'Integration',
        title: 'Integrate GDPR Export Service',
        description: 'Connect the account core service to the central GDPR export bus. Use the standard Kafka topic.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Publish user_export_requested event' },
            { id: 'AC2', text: 'Listen for user_export_completed event' },
            { id: 'AC3', text: 'Email user when ready' }
        ],
        dependencies: [{ id: 'Ext-Kafka', type: 'internal', description: 'Kafka topic must be created' }],
        unknowns: [],
        riskTags: [{ id: 'R3', type: 'compliance', label: 'GDPR', severity: 'high' }],
        historicalSignals: { prSizeHint: 'medium', touchedModulesCount: 4, requiresE2E: true },
        status: 'Candidate', confidenceScore: 85, aiReasoning: []
    },
    {
        id: 'S6', key: 'ACC-115', type: 'Spike', priority: 'Low', component: 'Web',
        title: 'Research Passwordless Auth implementation',
        description: 'Investigate libraries and feasibility of adding Passkey support. Output a design doc.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Compare 3 libraries' },
            { id: 'AC2', text: 'Prototype simple flow' },
            { id: 'AC3', text: 'Create RFC document' }
        ],
        dependencies: [], unknowns: ['Browser compatibility'],
        riskTags: [{ id: 'R4', type: 'unknown', label: 'New Tech', severity: 'medium' }],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 0, requiresE2E: false },
        status: 'Candidate', confidenceScore: 50, aiReasoning: []
    },
    {
        id: 'S7', key: 'ACC-120', type: 'Story', priority: 'Medium', component: 'Web',
        title: 'Add MFA Setup Wizard',
        description: 'Create a step-by-step wizard for users to configure 2FA (TOTP).',
        acceptanceCriteria: [
            { id: 'AC1', text: 'QR Code generation display' },
            { id: 'AC2', text: 'Verify code input step' },
            { id: 'AC3', text: 'Recovery codes download step' },
            { id: 'AC4', text: 'Should be fast and easy' } // Vague AC intentional
        ],
        dependencies: [], unknowns: [], riskTags: [],
        historicalSignals: { prSizeHint: 'large', touchedModulesCount: 6, requiresE2E: true },
        status: 'Candidate', confidenceScore: 80, aiReasoning: []
    },
    {
        id: 'S8', key: 'ACC-122', type: 'Story', priority: 'Low', component: 'API',
        title: 'Optimize GetUser query performance',
        description: 'The GET /user/me endpoint is slow when including preferences. Optimize the join.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Response time < 100ms p95' },
            { id: 'AC2', text: 'Add index on preferences table' }
        ],
        dependencies: [], unknowns: [],
        riskTags: [{ id: 'R5', type: 'perf', label: 'Performance', severity: 'low' }],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 1, requiresE2E: false },
        status: 'Candidate', confidenceScore: 92, aiReasoning: []
    },
    {
        id: 'S9', key: 'ACC-130', type: 'Story', priority: 'High', component: 'Integration',
        title: 'Sync Billing Address with CRM',
        description: 'When a user updates billing address, sync it to Salesforce via the CRM connector.',
        acceptanceCriteria: [], // Missing AC intentional
        dependencies: [{ id: 'SFDC', type: 'external', description: 'CRM Team APi' }],
        unknowns: ['Handling conflicts?'],
        riskTags: [{ id: 'R6', type: 'cross-team', label: 'Dependency', severity: 'high' }],
        historicalSignals: { prSizeHint: 'medium', touchedModulesCount: 3, requiresE2E: true },
        status: 'Candidate', confidenceScore: 65, aiReasoning: []
    },
    {
        id: 'S10', key: 'ACC-135', type: 'Story', priority: 'Medium', component: 'Web',
        title: 'Update Terms of Service Modal',
        description: 'Force users to re-accept TOS on next login if version changed.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Check TOS version on login' },
            { id: 'AC2', text: 'Block access until accepted' }
        ],
        dependencies: [], unknowns: [], riskTags: [],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 2, requiresE2E: true },
        status: 'Candidate', confidenceScore: 90, aiReasoning: []
    },
    {
        id: 'S11', key: 'ACC-140', type: 'Story', priority: 'Low', component: 'Web',
        title: 'Accessibility: Add Aria Labels to Nav',
        description: 'Audit found missing labels in main navigation.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'All icon buttons have aria-label' },
            { id: 'AC2', text: 'Keyboard navigation works' }
        ],
        dependencies: [], unknowns: [], riskTags: [],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 5, requiresE2E: false },
        status: 'Candidate', confidenceScore: 98, aiReasoning: []
    },
    {
        id: 'S12', key: 'ACC-142', type: 'Task', priority: 'Low', component: 'Integration',
        title: 'Rotate API Keys for SendGrid',
        description: 'Security rotation policy requiring update of email provider keys.',
        acceptanceCriteria: [
            { id: 'AC1', text: 'Update secret in Vault' },
            { id: 'AC2', text: 'Restart service' }
        ],
        dependencies: [], unknowns: [], riskTags: [{ id: 'R7', type: 'security', label: 'Security', severity: 'medium' }],
        historicalSignals: { prSizeHint: 'small', touchedModulesCount: 1, requiresE2E: false },
        status: 'Candidate', confidenceScore: 95, aiReasoning: []
    }
];

# Account Core — AI Story Copilot

A premium, frontend-only demonstration of an AI-powered sprint planning workflow. This application simulates a deterministic AI agent that assists engineering teams in estimating, refining, and planning sprints.

## Features

### 1. Dashboard & Velocity Tracking
- **Interactive KPI Cards**: Real-time stats on planning time saved, variance, and AI confidence.
- **Velocity Chart**: Animated bar chart visualization of the last 6 sprints.
- **Readiness Checklist**: Progress tracking for sprint preparation.
- **Sprint Intelligence**: Premium AI analysis of sprint risks and recommendations ("Wow" moment).

### 2. Jira Import Simulation
- **Mock Data Layer**: Realistic Jira-like stories with attributes (Risk Tags, Historical Signals).
- **Filtering & Selection**: Search and filter candidates for the sprint.

### 3. AI Estimation Workspace
- **Deterministic Scoring**: AI points are calculated based on complexity, ambiguity, and risk factors.
- **Reasoning Engine**: Explains *why* a story got a certain point value.
- **Confidence Scores**: Visual confidence level based on data completeness.

### 4. Refinement Studio
- **Story Splitting Wizard**: AI suggests logical splits for large stories.
- **AC Clarifier**: One-click AC rewriting.

### 5. Sprint Planning & Validation
- **Drag-and-Drop Builder**: Interactive board to assemble the sprint.
- **Capacity Bar**: Real-time visual feedback on team load vs. velocity.
- **Validation Report**: AI-detected hygiene issues and auto-fixes.

## Tech Stack
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (Premium Dark Mode + Glassmorphism)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context + useReducer

## How to Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the application**:
    Navigate to `http://localhost:5173` in your browser.

## Project Structure
- `src/components`: UI components organized by feature (dashboard, planning, etc.)
- `src/pages`: Top-level page components
- `src/store`: Global state management via React Context
- `src/lib`: Utility functions and deterministic AI logic
- `src/data`: Mock data for the simulation

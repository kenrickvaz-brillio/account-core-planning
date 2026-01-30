import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Placeholder Pages
import Dashboard from './pages/Dashboard';
import ImportPage from './pages/ImportPage';
import EstimationPage from './pages/EstimationPage';
import RefinementPage from './pages/RefinementPage';
import ValidationPage from './pages/ValidationPage';
import SprintPlanPage from './pages/SprintPlanPage';
// End placeholder imports
import { StoreProvider } from './store/store';

function App() {
    return (
        <StoreProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="import" element={<ImportPage />} />
                        <Route path="estimate" element={<EstimationPage />} />
                        <Route path="refine" element={<RefinementPage />} />
                        <Route path="validate" element={<ValidationPage />} />
                        <Route path="plan" element={<SprintPlanPage />} />
                    </Route>
                </Routes>
            </Router>
        </StoreProvider>
    );
}

export default App;

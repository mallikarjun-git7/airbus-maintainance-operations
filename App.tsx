import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/components/landing';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/components/auth';
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute';
import { Dashboard } from '@/components/dashboard';
import { RequestsList, RequestForm, RequestsKanban } from '@/components/requests';
import { WorkCentersList, WorkCenterForm } from '@/components/workcenters';
import { EquipmentList, EquipmentForm } from '@/components/equipment';
import { MaintenanceCalendar } from '@/components/calendar';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                } 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/requests" 
                element={
                    <ProtectedRoute>
                        <RequestsList />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/requests/kanban" 
                element={
                    <ProtectedRoute>
                        <RequestsKanban />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/requests/new" 
                element={
                    <ProtectedRoute>
                        <RequestForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/requests/:id" 
                element={
                    <ProtectedRoute>
                        <RequestForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/work-centers" 
                element={
                    <ProtectedRoute>
                        <WorkCentersList />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/work-centers/new" 
                element={
                    <ProtectedRoute>
                        <WorkCenterForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/work-centers/:id" 
                element={
                    <ProtectedRoute>
                        <WorkCenterForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/equipment" 
                element={
                    <ProtectedRoute>
                        <EquipmentList />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/equipment/new" 
                element={
                    <ProtectedRoute>
                        <EquipmentForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/equipment/:id" 
                element={
                    <ProtectedRoute>
                        <EquipmentForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/calendar" 
                element={
                    <ProtectedRoute>
                        <MaintenanceCalendar />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}

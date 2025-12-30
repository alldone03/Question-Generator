import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import UserDashboard from '../pages/UserDashboard';
import AssessmentModules from '../pages/AssessmentModules';
import LearningModule from '../pages/LearningModule';
import QuizPage from '../pages/QuizPage';
import PuzzleAC from '../pages/puzzelac';
import AdminDashboard from '../pages/AdminDashboard';
import AdminRecap from '../pages/AdminRecap';
import LoadingSpinner from '../pages/loadingSpinner';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <UserDashboard />
                </PrivateRoute>
            } />
            <Route path="/assessment/:id" element={
                <PrivateRoute>
                    <AssessmentModules />
                </PrivateRoute>
            } />
            <Route path="/learning/:id" element={
                <PrivateRoute>
                    <LearningModule />
                </PrivateRoute>
            } />
            <Route path="/quiz/:id" element={
                <PrivateRoute>
                    <QuizPage />
                </PrivateRoute>
            } />
            <Route path="/puzzle/:id" element={
                <PrivateRoute>
                    <PuzzleAC />
                </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <PrivateRoute adminOnly>
                    <AdminDashboard />
                </PrivateRoute>
            } />
            <Route path="/admin/recap" element={
                <PrivateRoute adminOnly>
                    <AdminRecap />
                </PrivateRoute>
            } />
            <Route path="/admin/recap/:assessment_id" element={
                <PrivateRoute adminOnly>
                    <AdminRecap />
                </PrivateRoute>
            } />

            {/* Default Redirect */}
            <Route path="/" element={<LoadingSpinner />} />
            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        </Routes>
    );
};

export default AppRoutes;

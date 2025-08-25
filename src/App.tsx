import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './screens/WelcomeScreen';
import CreateAccountPage from './screens/CreateAccountPage';
import AccountCreatedPage from './screens/AccountCreatedPage';
import BackgroundScreen from './screens/wizard/BackgroundScreen';
import LifestyleScreen from './screens/wizard/LifestyleScreen';
import DashboardScreen from './screens/DashboardScreen';
import SignInScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import PublicProfileScreen from './screens/PublicProfileScreen';
import SocialPortalScreen from './screens/SocialPortalScreen';
import ConnectScreen from './screens/ConnectScreen';
import TravelExplorationScreen from './screens/wizard/TravelExplorationScreen';
import KnowledgeCommunityScreen from './screens/wizard/KnowledgeCommunityScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import AuthenticatedRoute from './components/AuthenticatedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes - no authentication required */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/sign-in" element={<SignInScreen />} />

        {/* Protected routes - authentication required */}
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <DashboardScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthenticatedRoute>
              <SettingsScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <AuthenticatedRoute>
              <EditProfileScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/public-profile"
          element={
            <AuthenticatedRoute>
              <PublicProfileScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/social"
          element={
            <AuthenticatedRoute>
              <SocialPortalScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/connect"
          element={
            <AuthenticatedRoute>
              <ConnectScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/background"
          element={
            <AuthenticatedRoute>
              <BackgroundScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/lifestyle"
          element={
            <AuthenticatedRoute>
              <LifestyleScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/travel-exploration"
          element={
            <AuthenticatedRoute>
              <TravelExplorationScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/knowledge-community"
          element={
            <AuthenticatedRoute>
              <KnowledgeCommunityScreen />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/account-created"
          element={
            <AuthenticatedRoute>
              <AccountCreatedPage />
            </AuthenticatedRoute>
          }
        />
      </Routes>
      <PWAInstallPrompt />
    </>
  );
}

export default App;

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
import TravelExplorationScreen from './screens/wizard/TravelExplorationScreen';
import KnowledgeCommunityScreen from './screens/wizard/KnowledgeCommunityScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/account-created" element={<AccountCreatedPage />} />
        <Route path="/background" element={<BackgroundScreen />} />
        <Route path="/lifestyle" element={<LifestyleScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/sign-in" element={<SignInScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/edit-profile" element={<EditProfileScreen />} />
        <Route
          path="/travel-exploration"
          element={<TravelExplorationScreen />}
        />
        <Route
          path="/knowledge-community"
          element={<KnowledgeCommunityScreen />}
        />
      </Routes>
      <PWAInstallPrompt />
    </>
  );
}

export default App;

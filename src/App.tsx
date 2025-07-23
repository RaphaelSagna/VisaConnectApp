import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './screens/LoginPage';
import CreateAccountPage from './screens/CreateAccountPage';
import AccountCreatedPage from './screens/AccountCreatedPage';
import BackgroundScreen from './screens/BackgroundScreen';
import LifestyleScreen from './screens/LifestyleScreen';
import DashboardScreen from './screens/DashboardScreen';
import SignInScreen from './screens/SignInScreen';
import SettingsScreen from './screens/SettingsScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/account-created" element={<AccountCreatedPage />} />
      <Route path="/background" element={<BackgroundScreen />} />
      <Route path="/lifestyle" element={<LifestyleScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/sign-in" element={<SignInScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
}

export default App;

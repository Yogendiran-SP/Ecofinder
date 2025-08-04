import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomeScreen from './components/HomeScreen';
import WasteAnalysisScreen from './components/WasteAnalysisScreen.tsx';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import MainScreen from './components/MainScreen';
import ShopkeeperScreen from './components/ShopkeeperScreen';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/main" /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <HomeScreen />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              } 
            />
            <Route path="/analyze"
            element={
            <ProtectedRoute>
              <WasteAnalysisScreen />
            </ProtectedRoute>
            }
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterScreen />
                </PublicRoute>
              } 
            />
            <Route 
              path="/main" 
              element={
                <ProtectedRoute>
                  <MainScreen />
                </ProtectedRoute>
              } 
            />
            <Route
            path="/shopkeeper"
            element={
              <ProtectedRoute>
                <ShopkeeperScreen />
              </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
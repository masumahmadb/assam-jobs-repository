import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import { ToastProvider } from './components/common/Toast.jsx'
import BottomNav from './components/common/BottomNav.jsx'
import Login from './components/auth/Login.jsx'
import Signup from './components/auth/Signup.jsx'
import ProfileSetup from './components/auth/ProfileSetup.jsx'
import Home from './pages/Home.jsx'
import Jobs from './pages/Jobs.jsx'
import MapPage from './pages/MapPage.jsx'
import Utilities from './pages/Utilities.jsx'
import Assistant from './pages/Assistant.jsx'
import Profile from './pages/Profile.jsx'
import EmployerLogin from './pages/EmployerLogin.jsx'
import EmployerVerify from './pages/EmployerVerify.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-10 text-center text-tea-900/50">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

function EmployerRoute({ children }) {
  const employerUser = JSON.parse(localStorage.getItem('employerUser') || 'null')
  if (!employerUser) return <Navigate to="/employer/login" replace />
  return children
}

export default function App() {
  const { user } = useAuth()
  const employerUser = JSON.parse(localStorage.getItem('employerUser') || 'null')

  return (
    <ToastProvider>
      <Routes>
        {/* User auth routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />

        {/* User app routes */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
        <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
        <Route path="/utilities" element={<PrivateRoute><Utilities /></PrivateRoute>} />
        <Route path="/assistant" element={<PrivateRoute><Assistant /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Employer routes */}
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/verify" element={<EmployerVerify />} />
        <Route path="/employer/dashboard" element={
          <EmployerRoute>
            <EmployerDashboard user={employerUser} />
          </EmployerRoute>
        } />

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && <BottomNav />}
    </ToastProvider>
  )
}

import { Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuestRoute';
import PrivateRoute from './components/PrivateRoute';
import VerifiedRoute from './components/VerifiedRoute';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import VerificationPending from './pages/VerificationPending';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import Dashboard from './pages/student/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={(
          <GuestRoute>
            <Login />
          </GuestRoute>
        )}
      />
      <Route
        path="/register"
        element={(
          <GuestRoute>
            <Register />
          </GuestRoute>
        )}
      />

      <Route
        path="/verification-pending"
        element={(
          <PrivateRoute>
            <VerificationPending />
          </PrivateRoute>
        )}
      />

      <Route
        path="/dashboard"
        element={(
          <VerifiedRoute>
            <Dashboard />
          </VerifiedRoute>
        )}
      />

      <Route
        path="/admin/dashboard"
        element={(
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

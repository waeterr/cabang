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
import VerifyKTM from './pages/admin/VerifyKTM';
import AdminReports from './pages/admin/AdminReports';
import AdminClaims from './pages/admin/AdminClaims';
import Dashboard from './pages/student/Dashboard';
import BrowseItems from './pages/items/BrowseItems';
import ItemDetail from './pages/items/ItemDetail';
import CreateClaim from './pages/claims/CreateClaim';
import MyClaims from './pages/claims/MyClaims';
import CreateReport from './pages/reports/CreateReport';
import MyReports from './pages/reports/MyReports';


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

      <Route path="/items/lost" element={<BrowseItems />} />
      <Route path="/items/found" element={<BrowseItems />} />
      <Route path="/items/:id" element={<ItemDetail />} />
      <Route
        path="/claims/create/:id"
        element={(
          <VerifiedRoute>
            <CreateClaim />
          </VerifiedRoute>
        )}
      />
      <Route
        path="/claims/my"
        element={(
          <VerifiedRoute>
            <MyClaims />
          </VerifiedRoute>
        )}
      />
      <Route
        path="/reports/create"
        element={(
          <VerifiedRoute>
            <CreateReport />
          </VerifiedRoute>
        )}
      />
      <Route
        path="/reports/my"
        element={(
          <VerifiedRoute>
            <MyReports />
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
      <Route
        path="/admin/verifications"
        element={(
          <AdminRoute>
            <VerifyKTM />
          </AdminRoute>
        )}
      />
      <Route
        path="/admin/reports"
        element={(
          <AdminRoute>
            <AdminReports />
          </AdminRoute>
        )}
      />
      <Route
        path="/admin/claims"
        element={(
          <AdminRoute>
            <AdminClaims />
          </AdminRoute>
        )}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

/** @format */

import {
	Navigate,
	Route,
	Routes,
} from 'react-router-dom';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();
	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress sx={{ color: "primary.main" }} />
			</Box>
		);
	}
	if (!user) return <Navigate to="/login" replace />;
	return children;
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/login" element={<LoginPage />} />
			{/*<Route path="/app" element={
        <ProtectedRoute><Home /></ProtectedRoute>
      } />*/}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/dashboard/:page"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;

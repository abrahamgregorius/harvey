/** @format */

import {
	useEffect,
	useRef,
	useState,
} from 'react';

import {
	Link,
	useParams,
} from 'react-router-dom';

import LogoImg from '@/assets/logo/logo.jpg';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import MapAltIcon from '@mui/icons-material/Map';
import {
	Box,
	Button,
	CircularProgress,
	createTheme,
	CssBaseline,
	Menu,
	Popover,
	Stack,
	ThemeProvider,
	Typography,
} from '@mui/material';

import {
	deleteField,
	getFields,
	storeField,
} from '../services/fieldStore.js';
import { AnalyticsPage } from './AnalyticsPage.jsx';
import { FieldsPage } from './FieldsPage.jsx';
import { HomePage } from './HomePage.jsx';
import MapPage from './MapPage.jsx';
import {
	calcRiskScore,
	WaterAllocationPage,
} from './WaterAllocationPage.jsx';

const theme = createTheme({
	palette: {
		primary: { main: "#2e7d32" },
		background: { default: "#f5f5f5", paper: "#ffffff" },
		text: { primary: "#1a1a2e", secondary: "#6b7280" },
	},
	typography: {
		fontFamily: '"Inter", "Roboto", sans-serif',
	},
	shape: { borderRadius: 10 },
	components: {
		MuiPaper: {
			styleOverrides: { root: { boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } },
		},
	},
});

const SIDEBAR_W = 240;

const NAV = [
	{ key: "home", icon: <DashboardIcon />, label: "Home" },
	{ key: "fields", icon: <ListIcon />, label: "Daftar Lahan" },
	{ key: "water", icon: <LeaderboardIcon />, label: "Alokasi Air" },
	{ key: "map", icon: <MapAltIcon />, label: "Peta" },
	{ key: "analytics", icon: <BarChartIcon />, label: "Analisis" },
];

const PAGE_TITLES = {
	home: "Home",
	fields: "Daftar Lahan",
	water: "Alokasi Air",
	map: "Peta",
	analytics: "Analisis",
};

function Sidebar({ page, anchorEl, setAnchorEl }) {
	return (
		<Box
			sx={{
				width: SIDEBAR_W,
				bgcolor: "background.paper",
				borderRight: "1px solid",
				borderColor: "divider",
				display: "flex",
				flexDirection: "column",
				flexShrink: 0,
			}}
		>
			<Box
				sx={{
					px: 2.5,
					py: 3,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Stack direction="row" alignItems="center" spacing={2}>
					<duv className="flex items-center gap-3">
						<img src={LogoImg} className="h-10" alt="Harvey Logo" />
						<p className="text-2xl font-bold">Harvey</p>
					</duv>
				</Stack>
			</Box>

			<Box sx={{ px: 1.5, py: 2, flex: 1 }}>
				<Stack spacing={0.5}>
					{NAV.map((n) => (
						<Button
							key={n.key}
							component={Link}
							to={`/dashboard/${n.key}`}
							startIcon={
								<Box
									sx={{
										color: page === n.key ? "primary.main" : "text.secondary",
										display: "flex",
										"& svg": { fontSize: 20 },
									}}
								>
									{n.icon}
								</Box>
							}
							sx={{
								justifyContent: "flex-start",
								px: 2,
								py: 1,
								borderRadius: 1.5,
								color: page === n.key ? "primary.main" : "text.secondary",
								bgcolor: page === n.key ? "rgba(46,125,50,0.1)" : "transparent",
								fontWeight: page === n.key ? 700 : 500,
								fontSize: "0.875rem",
								textTransform: "none",
								"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
							}}
						>
							{n.label}
						</Button>
					))}
				</Stack>
			</Box>

			<Box
				sx={{
					px: 1.5,
					py: 2,
					borderTop: "1px solid",
					borderColor: "divider",
				}}
			>
				<Button
					onClick={(e) => setAnchorEl(e.currentTarget)}
					endIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
					startIcon={<MapAltIcon sx={{ fontSize: 20 }} />}
					sx={{
						justifyContent: "flex-start",
						px: 2,
						py: 1,
						borderRadius: 1.5,
						color: "text.secondary",
						fontWeight: 500,
						fontSize: "0.875rem",
						textTransform: "none",
						"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
						width: "100%",
					}}
				>
					User
				</Button>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={() => setAnchorEl(null)}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					transformOrigin={{ vertical: "bottom", horizontal: "center" }}
					sx={{ mb: 0.5 }}
				>
					<Button
						component={Link}
						to="/app"
						onClick={() => setAnchorEl(null)}
						startIcon={<MapAltIcon sx={{ fontSize: 18 }} />}
						sx={{
							justifyContent: "flex-start",
							px: 2,
							py: 1,
							borderRadius: 0,
							color: "text.primary",
							fontWeight: 500,
							fontSize: "0.875rem",
							textTransform: "none",
							width: "100%",
							"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
						}}
					>
						Buka Peta
					</Button>
					<Button
						onClick={() => { setAnchorEl(null); localStorage.removeItem('supabase-auth-token'); window.location.href = '/login'; }}
						startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
						sx={{
							justifyContent: "flex-start",
							px: 2,
							py: 1,
							borderRadius: 0,
							color: "text.primary",
							fontWeight: 500,
							fontSize: "0.875rem",
							textTransform: "none",
							width: "100%",
							"&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
						}}
					>
						Logout
					</Button>
				</Menu>
			</Box>
		</Box>
	);
}

export default function Dashboard() {
	const { page = "home" } = useParams();
	const [fields, setFields] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showInfo, setShowInfo] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const harveyBoxRef = useRef(null);
	const avgRisk =
		fields.length > 0
			? Math.round(
					fields.reduce((s, f) => s + calcRiskScore(f), 0) / fields.length,
				)
			: null;

	useEffect(() => {
		getFields()
			.then((data) => {
				setFields(data);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	async function handleDelete(id) {
		try {
			await deleteField(id);
			setFields((prev) => prev.filter((f) => f.id !== id));
		} catch (e) {
			console.error(e);
		}
	}

	async function handleFieldCreate(fieldData) {
		try {
			const saved = await storeField(fieldData);
			setFields((prev) => [...prev, saved]);
		} catch (e) {
			console.error(e);
		}
	}

	function handleUpdate(updated) {
		setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{ height: "100vh", display: "flex", bgcolor: "background.default" }}
			>
				<Sidebar page={page} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
				>
					<Box
						sx={{
							px: 3,
							py: 2,
							borderBottom: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexShrink: 0,
						}}
					>
						<Typography variant="h6" fontWeight={700}>
							{PAGE_TITLES[page] ?? "Dashboard"}
						</Typography>
						<Typography variant="caption" sx={{ color: "text.secondary" }}>
							{fields.length} lahan ·{" "}
							{new Date().toLocaleDateString("id-ID", {
								weekday: "long",
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</Typography>
						{avgRisk !== null && (
							<>
								<Box
									onMouseEnter={() => setShowInfo(true)}
									onMouseLeave={() => setShowInfo(false)}
									ref={harveyBoxRef}
									sx={{
										border: "1px solid",
										borderColor: "divider",
										borderRadius: 1.5,
										px: 1.5,
										py: 1,
										cursor: "default",
										ml: 3,
									}}
								>
									<Stack direction="row" spacing={1} alignItems="center">
										<Box sx={{ position: "relative", display: "inline-flex" }}>
											<CircularProgress
												variant="determinate"
												value={100}
												size={36}
												thickness={5}
												sx={{ color: "rgba(0,0,0,0.1)", position: "absolute" }}
											/>
											<CircularProgress
												variant="determinate"
												value={avgRisk}
												size={36}
												thickness={5}
												sx={{
													color:
														avgRisk >= 70
															? "#ef4444"
															: avgRisk >= 50
																? "#f97316"
																: avgRisk >= 30
																	? "#eab308"
																	: "#22c55e",
													"& .MuiCircularProgress-circle": {
														strokeLinecap: "round",
													},
												}}
											/>
											<Box
												sx={{
													top: 0,
													left: 0,
													bottom: 0,
													right: 0,
													position: "absolute",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Typography
													variant="caption"
													fontWeight={800}
													sx={{ fontSize: 10 }}
												>
													{avgRisk}
												</Typography>
											</Box>
										</Box>
										<Box>
											<Typography
												variant="body2"
												fontWeight={700}
												sx={{ display: "block", lineHeight: 1.1 }}
											>
												Harvey Score
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ fontSize: 12 }}
											>
												Rata-rata
											</Typography>
										</Box>
									</Stack>
								</Box>
								<Popover
									open={showInfo}
									anchorEl={harveyBoxRef.current}
									anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
									transformOrigin={{ vertical: "top", horizontal: "center" }}
									sx={{ mt: -1, pointerEvents: "none" }}
								>
									<Box sx={{ px: 1.5, py: 1.5 }}>
										<Typography
											variant="body2"
											fontWeight={700}
											sx={{ display: "block", mb: 0.5 }}
										>
											Tentang Harvey Score
										</Typography>
										<Typography
											variant="body2"
											sx={{ display: "block", mb: 0.5 }}
										>
											Dihitung dari kelangkaan air (curah hujan & suhu), jenis
											tanah, tahap pertumbuhan tanaman, dan evapotranspirasi.
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ display: "block", fontSize: 12 }}
										>
											Skor tinggi = kebutuhan air tinggi. Digunakan untuk
											alokasi air panen.
										</Typography>
									</Box>
								</Popover>
							</>
						)}
					</Box>

					<Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
						{loading ? (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
								}}
							>
								<CircularProgress sx={{ color: "primary.main" }} />
							</Box>
						) : page === "home" ? (
							<HomePage fields={fields} onDelete={handleDelete} />
						) : page === "fields" ? (
							<FieldsPage
								fields={fields}
								onDelete={handleDelete}
								onUpdate={handleUpdate}
							/>
						) : page === "water" ? (
							<WaterAllocationPage fields={fields} />
						) : page === "map" ? (
							<MapPage fields={fields} onFieldCreate={handleFieldCreate} />
						) : page === "analytics" ? (
							<AnalyticsPage />
						) : null}
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

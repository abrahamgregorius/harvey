import 'leaflet/dist/leaflet.css';

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import L from 'leaflet';
import {
	CircleMarker,
	MapContainer,
	Polygon,
	Polyline,
	TileLayer,
	useMap,
} from 'react-leaflet';
import { Link } from 'react-router-dom';

import AirIcon from '@mui/icons-material/Air';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GrassIcon from '@mui/icons-material/Grass';
import LayersIcon from '@mui/icons-material/Layers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import TerrainIcon from '@mui/icons-material/Terrain';
import UndoIcon from '@mui/icons-material/Undo';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
	createTheme,
	CssBaseline,
	ThemeProvider,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
	calculateRisk,
	getFields,
	storeField,
	updateField,
} from '../services/fieldStore.js';
import {
	calcPolygonAreaHectares,
	getBrowserLocation,
	getPolygonCentroid,
} from '../services/geoService.js';
import { getLast30DaysRainfall } from '../services/rainfallService.js';
import { getSoilSummary } from '../services/soilService.js';
import { getWeatherSummary } from '../services/weatherService.js';
import { riskColor, riskLabel } from './WaterAllocationPage.jsx';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapUpdater({ center, zoom }) {
	const map = useMap();
	useEffect(() => {
		if (center) map.flyTo(center, zoom, { duration: 1.2 });
	}, [center, zoom, map]);
	return null;
}

function MapClicker({ onClick }) {
	const map = useMap();
	useEffect(() => {
		const h = (e) => onClick(e.latlng);
		map.on("click", h);
		return () => map.off("click", h);
	}, [map]);
	return null;
}

const theme = createTheme({
	palette: {
		primary: { main: "#2e7d32" },
		background: { default: "#f5f5f5", paper: "#ffffff" },
	},
	typography: {
		fontFamily: '"Inter", "Roboto", sans-serif',
	},
	shape: { borderRadius: 10 },
	components: {
		MuiPaper: {
			styleOverrides: {
				root: { boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
			},
		},
	},
});

function SectionHeader({ icon, title }) {
	return (
		<Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
			<Box sx={{ color: "primary.main" }}>{icon}</Box>
			<Typography
				variant="subtitle2"
				fontWeight={700}
				color="primary.main"
				sx={{
					textTransform: "uppercase",
					fontSize: "0.75rem",
					letterSpacing: 0.8,
				}}
			>
				{title}
			</Typography>
		</Stack>
	);
}

function DataRow({ icon, label, value, unit = "" }) {
	if (value == null || value === "") return null;
	return (
		<Stack direction="row" alignItems="center" spacing={1.5} py={0.3}>
			{icon && <Box sx={{ color: "text.disabled", minWidth: 20 }}>{icon}</Box>}
			<Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
				{label}
			</Typography>
			<Typography variant="body2" fontWeight={600}>
				{value}
				{unit}
			</Typography>
		</Stack>
	);
}

function StatCard({ icon, label, value, unit = "", highlight = false }) {
	return (
		<Box
			sx={{
				flex: 1,
				p: 1.5,
				borderRadius: 2,
				...(highlight
					? { bgcolor: "primary.main", color: "white" }
					: { bgcolor: "grey.100", color: "text.primary" }),
			}}
		>
			<Stack spacing={0.5}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<Box sx={{ opacity: highlight ? 0.9 : 0.6 }}>{icon}</Box>
					<Typography
						variant="caption"
						sx={{
							textTransform: "uppercase",
							fontSize: "0.7rem",
							letterSpacing: 0.5,
							opacity: highlight ? 0.9 : 0.6,
						}}
					>
						{label}
					</Typography>
				</Box>
				<Typography variant="body2" fontWeight={700}>
					{value}
					{unit}
				</Typography>
			</Stack>
		</Box>
	);
}

function FieldPanel({ fields, onEdit }) {
	const [collapsed, setCollapsed] = useState(new Set());
	const toggle = (idx) => {
		setCollapsed((prev) => {
			const next = new Set(prev);
			next.has(idx) ? next.delete(idx) : next.add(idx);
			return next;
		});
	};

	if (!fields?.length) return null;
	return (
		<Stack spacing={2}>
			{fields.map((field, idx) => {
				const isCollapsed = collapsed.has(idx);
				return (
					<Paper
						key={idx}
						elevation={0}
						sx={{
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 2,
							overflow: "hidden",
						}}
					>
						<Box
							sx={{
								bgcolor: "primary.main",
								px: 2,
								py: 1.5,
								display: "flex",
								alignItems: "center",
								gap: 1,
								cursor: "pointer",
							}}
							onClick={() => toggle(idx)}
						>
							<LocationOnIcon sx={{ color: "white", fontSize: 20 }} />
							<Typography
								variant="subtitle2"
								fontWeight={700}
								sx={{ color: "white", flex: 1 }}
							>
								{field.name}
							</Typography>
							<IconButton
								size="small"
								sx={{ color: "white" }}
								onClick={(e) => {
									e.stopPropagation();
									onEdit(field);
								}}
							>
								<EditIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								sx={{
									color: "white",
									transition: "transform 0.2s",
									transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
								}}
								onClick={(e) => {
									e.stopPropagation();
									toggle(idx);
								}}
							>
								<ExpandMoreIcon fontSize="small" />
							</IconButton>
						</Box>

						<Collapse in={!isCollapsed}>
							<Box sx={{ p: 2 }}>
								<Stack direction="row" spacing={1} mb={2}>
									<StatCard
										icon={<TerrainIcon sx={{ fontSize: 16 }} />}
										label="Luas"
										value={field.area_ha?.toFixed(2)}
										unit=" ha"
									/>
									<StatCard
										icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
										label="Elevasi"
										value={field.elevation ?? "—"}
										unit=" m"
									/>
								</Stack>

								<Box
									sx={{ mb: 2, p: 1.5, bgcolor: "grey.100", borderRadius: 1 }}
								>
									<Typography variant="caption" color="text.secondary">
										Koordinat
									</Typography>
									<Typography variant="body2" fontWeight={500}>
										{field.lat?.toFixed(5)}, {field.lon?.toFixed(5)}
									</Typography>
								</Box>

								<SectionHeader
									icon={<WbSunnyIcon sx={{ fontSize: 16 }} />}
									title="Cuaca Saat Ini"
								/>
								<Stack direction="row" spacing={1} mb={2}>
									<StatCard
										icon={<WbSunnyIcon sx={{ fontSize: 16 }} />}
										label="Suhu"
										value={field.temp != null ? field.temp.toFixed(1) : "—"}
										unit="°C"
									/>
									<StatCard
										icon={<WaterDropIcon sx={{ fontSize: 16 }} />}
										label="Humid"
										value={field.humidity ?? "—"}
										unit="%"
									/>
									<StatCard
										icon={<AirIcon sx={{ fontSize: 16 }} />}
										label="Angin"
										value={
											field.windSpeed != null ? field.windSpeed.toFixed(1) : "—"
										}
										unit=" km/h"
									/>
								</Stack>

								{field.riskScore != null && (
									<Box sx={{ mb: 2 }}>
										<SectionHeader
											icon={<WaterDropIcon sx={{ fontSize: 16 }} />}
											title="Risiko Kekeringan"
										/>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												p: 1.5,
												bgcolor: 'grey.100',
												borderRadius: 1,
											}}
										>
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: '50%',
													bgcolor: riskColor(field.riskScore),
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Typography
													variant="caption"
													fontWeight={800}
													sx={{ color: 'white', fontSize: 12 }}
												>
													{field.riskScore}
												</Typography>
											</Box>
											<Box>
												<Typography variant="body2" fontWeight={700}>
													{riskLabel(field.riskScore)}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													Skor dari engine FAO-56
												</Typography>
											</Box>
										</Box>
									</Box>
								)}

								{field.description && (
									<Box
										sx={{
											mb: 2,
											p: 1.5,
											bgcolor: "grey.100",
											borderRadius: 1,
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										<WbSunnyIcon
											sx={{ color: "text.disabled", fontSize: 16 }}
										/>
										<Typography variant="body2">{field.description}</Typography>
									</Box>
								)}

								{field.rainfall_mm != null && (
									<Box sx={{ mb: 2 }}>
										<SectionHeader
											icon={<WaterDropIcon sx={{ fontSize: 16 }} />}
											title="Curah Hujan"
										/>
										<Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 1 }}>
											<Typography variant="body1" fontWeight={700}>
												{field.rainfall_mm} mm
											</Typography>
										</Box>
									</Box>
								)}

								{field.soilType && (
									<Box sx={{ mb: 2 }}>
										<SectionHeader
											icon={<GrassIcon sx={{ fontSize: 16 }} />}
											title="Tanah"
										/>
										<Stack spacing={1}>
											<DataRow label="Jenis" value={field.soilType} />
											{field.clay_pct != null && (
												<DataRow
													label="Clay/Sand/Silt"
													value={`${field.clay_pct}/${field.sand_pct}/${field.silt_pct}`}
													unit="%"
												/>
											)}
											{field.note && (
												<Typography variant="caption" color="text.secondary">
													{field.note}
												</Typography>
											)}
										</Stack>
									</Box>
								)}

								{field.rainfall30d && (
									<Box sx={{ mb: 2 }}>
										<SectionHeader
											icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
											title="Curah Hujan 30 Hari"
										/>
										<Stack direction="row" spacing={1}>
											<StatCard
												icon={<WaterDropIcon sx={{ fontSize: 16 }} />}
												label="Total"
												value={field.rainfall30d.total_mm}
												unit=" mm"
											/>
											<StatCard
												icon={<WaterDropIcon sx={{ fontSize: 16 }} />}
												label="Rata-rata"
												value={field.rainfall30d.avg_mm}
												unit=" mm/h"
											/>
										</Stack>
									</Box>
								)}

								{field.forecast?.length > 0 && (
									<Box>
										<SectionHeader
											icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
											title="Prakiraan 5 Hari"
										/>
										<Stack spacing={1}>
											{field.forecast.map((f, i) => (
												<Box
													key={i}
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
														p: 1,
														bgcolor: "grey.100",
														borderRadius: 1,
													}}
												>
													<Typography
														variant="caption"
														sx={{
															minWidth: 36,
															color: "text.secondary",
															fontWeight: 500,
														}}
													>
														{f.date?.slice(5)}
													</Typography>
													<Typography variant="caption" sx={{ flex: 1 }}>
														{f.description}
													</Typography>
													<Typography variant="caption" fontWeight={600}>
														{f.tempMin}–{f.tempMax}°C
													</Typography>
													<Chip
														label={`${f.precipMm}mm`}
														size="small"
														sx={{
															height: 20,
															fontSize: "0.65rem",
															fontWeight: 700,
															...(f.precipMm > 5
																? {
																		bgcolor: "success.light",
																		color: "success.dark",
																	}
																: { bgcolor: "grey.300", color: "grey.700" }),
														}}
													/>
												</Box>
											))}
										</Stack>
									</Box>
								)}
							</Box>
						</Collapse>
					</Paper>
				);
			})}
		</Stack>
	);
}

export default function Map() {
	const [fields, setFields] = useState([]);
	const [loading, setLoading] = useState(false);
	const [locBtn, setLocBtn] = useState(false);
	const [drawPoints, setDrawPoints] = useState([]);
	const [finishedPolygons, setFinishedPolygons] = useState([]);
	const [center, setCenter] = useState([-6.2, 106.8]);
	const [zoom, setZoom] = useState(8);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "info",
	});
	const [fieldForm, setFieldForm] = useState({ name: "", plantingDate: "" });
	const [showFieldModal, setShowFieldModal] = useState(false);
	const [editField, setEditField] = useState(null);
	const nameInputRef = useRef(null);

	useEffect(() => {
		if (showFieldModal && nameInputRef.current) {
			setTimeout(() => nameInputRef.current?.focus(), 100);
		}
	}, [showFieldModal]);

	const showMsg = (message, severity = "info") => {
		setSnackbar({ open: true, message, severity });
	};

	const handleModalConfirm = () => {
		if (!fieldForm.name.trim()) {
			showMsg("Nama lahan wajib diisi", "warning");
			return;
		}
		const saved = { ...fieldForm };
		setShowFieldModal(false);
		setFieldForm({ name: "", plantingDate: "" });
		handleDrawn(drawPoints, saved);
	};

	const handleModalClose = () => setShowFieldModal(false);

	const handleEditOpen = (field) => {
		setEditField({ ...field });
	};

	const handleEditSave = async () => {
		if (!editField?.name?.trim()) {
			showMsg("Nama lahan wajib diisi", "warning");
			return;
		}
		try {
			const updated = await updateField(editField.id, editField);
			calculateRisk(editField)
				.then((risk) => {
					const withRisk = { ...updated, riskScore: Math.round(risk.riskScore * 100) };
					setFields((prev) => prev.map((f) => (f.id === updated.id ? withRisk : f)));
				})
				.catch((e) => console.error("risk calc error:", e));
			setEditField(null);
			showMsg("Lahan diperbarui", "success");
		} catch (e) {
			showMsg(`Gagal: ${e.message}`, "error");
		}
	};

	useEffect(() => {
		getFields()
			.then((data) => {
				setFields(data);
				setFinishedPolygons(
					data.filter((f) => f.polygonPoints).map((f) => f.polygonPoints),
				);
			})
			.catch((e) => console.error("restore fields error:", e));
	}, []);

	const handleLocate = async () => {
		setLocBtn(true);
		try {
			const { lat, lon } = await getBrowserLocation();
			setCenter([lat, lon]);
			setZoom(14);
			showMsg("Lokasi ditemukan", "success");
		} catch (e) {
			if (e?.code === 1) showMsg("Izin lokasi ditolak", "warning");
			else if (e?.code === 2) showMsg("Lokasi tidak tersedia", "warning");
			else showMsg("Gagal mendapat lokasi", "error");
		} finally {
			setLocBtn(false);
		}
	};

	const handleDrawn = useCallback(async (points, fieldData) => {
		setLoading(true);
		try {
			const poly = { getLatLngs: () => [points] };
			const { lat, lon } = getPolygonCentroid(poly);
			const area_ha = calcPolygonAreaHectares(poly);
			const newField = {
				name: fieldData.name,
				lat,
				lon,
				area_ha,
				plantingDate: fieldData.plantingDate || null,
				crop_type: "Padi",
			};

			const weather = await getWeatherSummary(lat, lon);
			const soil = await getSoilSummary(lat, lon);
			const rainfallArr = await getLast30DaysRainfall(lat, lon);

			const rainfall30d =
				rainfallArr?.length > 0
					? {
							total_mm: Number(rainfallArr.reduce((a, b) => a + b, 0)).toFixed(
								1,
							),
							avg_mm: Number(
								rainfallArr.reduce((a, b) => a + b, 0) / rainfallArr.length,
							).toFixed(1),
						}
					: null;

			const finalField = {
				...newField,
				...(weather ?? {}),
				...(soil ?? {}),
				rainfall30d,
				polygonPoints: points,
			};
			setFields((prev) => [...(prev ?? []), finalField]);
			setFinishedPolygons((prev) => [...prev, points]);
			setDrawPoints([]);
			setFieldForm({ name: "", plantingDate: "" });
			storeField(finalField)
			.then((saved) => {
				calculateRisk(finalField)
					.then((risk) => {
						const withRisk = { ...saved, riskScore: Math.round(risk.riskScore * 100) };
						setFields((prev) => prev.map((f) => (f.id === saved.id ? withRisk : f)));
					})
					.catch((e) => console.error("risk calc error:", e));
			})
			.catch((e) => console.error("backend sync error:", e));
		} catch (e) {
			console.error("handleDrawn error:", e);
			showMsg(`Gagal: ${e.message}`, "error");
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
				<Box
					sx={{
						bgcolor: "primary.main",
						px: 3,
						py: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						boxShadow: 2,
					}}
				>
					<Stack direction="row" alignItems="center" spacing={3}>
						<Box sx={{ bgcolor: "white", borderRadius: 1.5, p: 1 }}>
							<LayersIcon sx={{ color: "primary.main", fontSize: 28 }} />
						</Box>
						<Box>
							<Typography
								variant="h6"
								fontWeight={800}
								sx={{ color: "white", lineHeight: 1.2, letterSpacing: 1 }}
							>
								HARVEY
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}
							>
								Pantau Risiko Lahan
							</Typography>
						</Box>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Button
							component={Link}
							to="/dashboard"
							startIcon={<DashboardIcon />}
							variant="contained"
							size="small"
						>
							Dashboard
						</Button>
						<Button
							startIcon={<MyLocationIcon />}
							onClick={handleLocate}
							disabled={locBtn}
							variant="contained"
							size="small"
						>
							{locBtn ? "Mendapat lokasi…" : "Lokasi Saya"}
						</Button>
					</Stack>
				</Box>

				<Box sx={{ p: 3 }}>
					<Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
						<Box
							sx={{
								flex: 1,
								borderRadius: 2,
								overflow: "hidden",
								border: "1px solid",
								borderColor: "divider",
								boxShadow: 1,
								position: "relative",
							}}
						>
							<MapContainer
								center={center}
								zoom={zoom}
								style={{ height: 560, width: "100%" }}
							>
								<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
								<MapUpdater center={center} zoom={zoom} />
								<MapClicker
									onClick={(latlng) => setDrawPoints((p) => [...p, latlng])}
								/>

								{finishedPolygons.map((pts, i) => (
									<Polygon
										key={i}
										positions={pts}
										pathOptions={{
											color: "#2e7d32",
											weight: 2,
											fillColor: "#2e7d32",
											fillOpacity: 0.12,
										}}
									/>
								))}

								{drawPoints.length > 0 && (
									<>
										<Polyline
											positions={drawPoints}
											pathOptions={{
												color: "#4caf50",
												weight: 2.5,
												dashArray: "6 4",
											}}
										/>
										{drawPoints.map((p, i) => (
											<CircleMarker
												key={i}
												center={p}
												radius={i === 0 ? 8 : 5}
												pathOptions={{
													color: "#2e7d32",
													fillColor: i === 0 ? "#2e7d32" : "#ffffff",
													fillOpacity: 1,
													weight: 2,
												}}
											/>
										))}
										{drawPoints.length >= 2 && (
											<Polyline
												positions={[
													drawPoints[drawPoints.length - 1],
													drawPoints[0],
												]}
												pathOptions={{
													color: "#4caf50",
													weight: 1.5,
													dashArray: "4 4",
													opacity: 0.6,
												}}
											/>
										)}
									</>
								)}
							</MapContainer>

							<Box
								sx={{
									position: "absolute",
									top: 1,
									right: 1,
									zIndex: 600,
									display: "flex",
									gap: 1,
								}}
							>
								<Button
									startIcon={<UndoIcon />}
									onClick={() => setDrawPoints((p) => p.slice(0, -1))}
									disabled={drawPoints.length === 0}
									size="small"
									variant="contained"
									sx={{
										bgcolor: "white",
										color: "primary.main",
										"&:hover": { bgcolor: "#f5f5f5" },
									}}
								>
									Undo
								</Button>
								<Button
									startIcon={<ClearIcon />}
									onClick={() => setDrawPoints([])}
									disabled={drawPoints.length === 0}
									size="small"
									variant="contained"
									sx={{
										bgcolor: "white",
										color: "primary.main",
										"&:hover": { bgcolor: "#f5f5f5" },
									}}
								>
									Clear
								</Button>
								<Button
									startIcon={<CheckIcon />}
									onClick={() =>
										drawPoints.length >= 3 && setShowFieldModal(true)
									}
									disabled={drawPoints.length < 3}
									size="small"
									variant="contained"
								>
									Finish
								</Button>
							</Box>

							{drawPoints.length > 0 && (
								<Box
									sx={{ position: "absolute", bottom: 1, left: 1, zIndex: 50 }}
								>
									<Chip
										label={`${drawPoints.length} titik${drawPoints.length < 3 ? ` (min ${3 - drawPoints.length} lagi)` : ""}`}
										size="small"
										sx={{ bgcolor: "white", fontWeight: 600, boxShadow: 2 }}
									/>
								</Box>
							)}
						</Box>

						<Box sx={{ width: 384, flexShrink: 0 }}>
							{loading ? (
								<Paper
									elevation={0}
									sx={{
										p: 3,
										textAlign: "center",
										border: "1px solid",
										borderColor: "divider",
										borderRadius: 2,
									}}
								>
									<CircularProgress
										size={36}
										sx={{ mb: 1.5, color: "primary.main" }}
									/>
									<Typography variant="body2" color="text.secondary">
										Memuat data…
									</Typography>
								</Paper>
							) : (
								<FieldPanel fields={fields} onEdit={handleEditOpen} />
							)}
							{fields.length === 0 && !loading && (
								<Box
									sx={{
										mt: 1.5,
										p: 3,
										border: "2px dashed",
										borderColor: "divider",
										borderRadius: 2,
										textAlign: "center",
									}}
								>
									<TerrainIcon
										sx={{ color: "text.disabled", fontSize: 48, mb: 1 }}
									/>
									<Typography variant="body2" color="text.secondary">
										Klik peta untuk menggambar polygon
									</Typography>
									<Typography variant="caption" color="text.disabled">
										Minimal 3 titik
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
				</Box>

				<Snackbar
					open={snackbar.open}
					autoHideDuration={4000}
					onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				>
					<Alert
						onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
						severity={snackbar.severity}
						variant="filled"
						sx={{ borderRadius: 2 }}
					>
						{snackbar.message}
					</Alert>
				</Snackbar>

				{/* Save field modal */}
				<Dialog
					open={showFieldModal}
					onClose={handleModalClose}
					maxWidth="xs"
					fullWidth
				>
					<DialogTitle fontWeight={700}>Simpan Lahan</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{ mb: 1 }}>
							Lengkapi info lahan sebelum menyimpan.
						</DialogContentText>
						<Stack spacing={2} mt={1}>
							<TextField
								inputRef={nameInputRef}
								label="Nama Lahan"
								value={fieldForm.name}
								onChange={(e) =>
									setFieldForm((f) => ({ ...f, name: e.target.value }))
								}
								onKeyDown={(e) => e.key === "Enter" && handleModalConfirm()}
								fullWidth
								size="small"
							/>
							<FormControl variant="outlined" size="small" fullWidth>
								<InputLabel shrink htmlFor="planting-date">
									Tanggal Tanam
								</InputLabel>
								<OutlinedInput
									id="planting-date"
									type="date"
									value={fieldForm.plantingDate}
									onChange={(e) =>
										setFieldForm((f) => ({
											...f,
											plantingDate: e.target.value,
										}))
									}
									label="Tanggal Tanam"
								/>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions sx={{ px: 2, pb: 1.5 }}>
						<Button onClick={handleModalClose} color="inherit" size="small">
							Batal
						</Button>
						<Button
							onClick={handleModalConfirm}
							variant="contained"
							size="small"
						>
							OK
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={!!editField}
					onClose={() => setEditField(null)}
					maxWidth="xs"
					fullWidth
				>
					<DialogTitle fontWeight={700}>Edit Lahan</DialogTitle>
					<DialogContent>
						<Stack spacing={2} mt={1}>
							<TextField
								label="Nama Lahan"
								value={editField?.name ?? ""}
								onChange={(e) =>
									setEditField((f) => ({ ...f, name: e.target.value }))
								}
								onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
								fullWidth
								size="small"
							/>
							<FormControl variant="outlined" size="small" fullWidth>
								<InputLabel shrink htmlFor="edit-planting-date">
									Tanggal Tanam
								</InputLabel>
								<OutlinedInput
									id="edit-planting-date"
									type="date"
									value={editField?.plantingDate ?? ""}
									onChange={(e) =>
										setEditField((f) => ({
											...f,
											plantingDate: e.target.value,
										}))
									}
									label="Tanggal Tanam"
								/>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions sx={{ px: 2, pb: 1.5 }}>
						<Button
							onClick={() => setEditField(null)}
							color="inherit"
							size="small"
						>
							Batal
						</Button>
						<Button onClick={handleEditSave} variant="contained" size="small">
							Simpan
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</ThemeProvider>
	);
}

/** @format */

import { Link } from 'react-router-dom';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import GrassIcon from '@mui/icons-material/Grass';
import LayersIcon from '@mui/icons-material/Layers';
import TerrainIcon from '@mui/icons-material/Terrain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
	Box,
	Button,
	IconButton,
	Paper,
	Stack,
	Typography,
} from '@mui/material';

import { WeatherTrendsChart } from '../components/WeatherTrendsChart';
import { getGrowthStage } from '../utils/growthUtils';

export { getGrowthStage };

function MetricTile({ icon, label, value, unit, trend }) {
	return (
		<Paper
			sx={{
				p: { xs: 1.5, md: 2.5 },
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				minHeight: { xs: 90, md: 110 },
			}}
		>
			<Stack spacing={2}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
				>
					<Box
						sx={{
							bgcolor: "rgba(45,106,79,0.1)",
							borderRadius: 1.5,
							p: 1,
							color: "primary.main",
							display: "flex",
						}}
					>
						{icon}
					</Box>
				</Stack>
				<Box>
					<Typography
						variant="h4"
						fontWeight={800}
						sx={{ color: "text.primary", lineHeight: 1, fontSize: { xs: '1.5rem', md: 'h4' } }}
					>
						{value ?? ""}
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: "text.secondary",
							textTransform: "uppercase",
							letterSpacing: 1,
						}}
					>
						{unit}
					</Typography>
				</Box>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{label}
				</Typography>
			</Stack>
		</Paper>
	);
}

function GrowthCard({ fields }) {
	const stages = ["Vegetatif", "Generatif", "Pra-Panen", "Panen"];
	const colors = {
		Vegetatif: "#4ade80",
		Generatif: "#38bdf8",
		"Pra-Panen": "#fb923c",
		Panen: "#f87171",
	};
	const counts = {};
	stages.forEach((s) => {
		counts[s] = 0;
	});
	fields.forEach((f) => {
		const g = getGrowthStage(f.plantingDate);
		if (g) counts[g.stage]++;
	});
	const total = fields.filter((f) => f.plantingDate).length;

	return (
		<Paper
			sx={{
				p: 2.5,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
			}}
		>
			<Stack spacing={2}>
				<Typography
					variant="subtitle2"
					fontWeight={700}
					sx={{
						color: "text.primary",
						textTransform: "uppercase",
						letterSpacing: 1,
					}}
				>
					Tahap Pertumbuhan
				</Typography>
				<Stack spacing={1.5}>
					{stages.map((stage) => (
						<Box key={stage}>
							<Stack direction="row" justifyContent="space-between" mb={0.5}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Box
										sx={{
											width: 8,
											height: 8,
											borderRadius: "50%",
											bgcolor: colors[stage],
										}}
									/>
									<Typography variant="body2" fontWeight={500}>
										{stage}
									</Typography>
								</Stack>
								<Typography
									variant="body2"
									fontWeight={700}
									sx={{ color: colors[stage] }}
								>
									&nbsp; {counts[stage]}{" "}
									<Typography
										component="span"
										variant="caption"
										color="text.secondary"
									>
										/ {total}
									</Typography>
								</Typography>
							</Stack>
							<Box sx={{ height: 4, bgcolor: "grey.100", borderRadius: 2 }}>
								<Box
									sx={{
										height: "100%",
										width:
											total > 0 ? `${(counts[stage] / total) * 100}%` : "0%",
										bgcolor: colors[stage],
										borderRadius: 2,
										transition: "width 0.6s ease",
									}}
								/>
							</Box>
						</Box>
					))}
				</Stack>
			</Stack>
		</Paper>
	);
}

export function HomePage({ fields, onDelete }) {
	const totalArea = fields.reduce((s, f) => s + (f.area_ha || 0), 0);
	const avgTemp = fields.filter((f) => f.temp).length
		? (
				fields.reduce((s, f) => s + (f.temp || 0), 0) /
				fields.filter((f) => f.temp).length
			).toFixed(1)
		: null;
	const avgHumid = fields.filter((f) => f.humidity).length
		? Math.round(
				fields.reduce((s, f) => s + (f.humidity || 0), 0) /
					fields.filter((f) => f.humidity).length,
			)
		: null;
	const planted = fields.filter((f) => f.plantingDate).length;
	const soilTypes = [...new Set(fields.map((f) => f.soilType).filter(Boolean))]
		.length;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: 0,
				overflow: "hidden",
			}}
		>
		<Box
			sx={{
				px: { xs: 1.5, md: 3 },
				py: 2.5,
				borderBottom: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
			}}
		>
				<Typography
					variant="h5"
					fontWeight={800}
					sx={{ color: "text.primary" }}
				>
					Dashboard
				</Typography>
				<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
					Pantau semua lahan pertanian kamu di satu tempat.
				</Typography>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
					gap: 1,
					px: { xs: 1, md: 2 },
					py: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<MetricTile
					icon={<LayersIcon />}
					label="Total Lahan"
					value={fields.length}
					unit="lahan"
				/>
				<MetricTile
					icon={<TerrainIcon />}
					label="Luas Total"
					value={totalArea.toFixed(1)}
					unit="hektar"
				/>
				<MetricTile
					icon={<CalendarMonthIcon />}
					label="Sudah Tanam"
					value={planted}
					unit={`dari ${fields.length}`}
				/>
				<MetricTile
					icon={<GrassIcon />}
					label="Jenis Tanah"
					value={soilTypes}
					unit="jenis"
				/>
			</Box>

			<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, flex: 1, minHeight: 0, gap: 2, p: { xs: 1, md: 2 } }}>
				<Paper
					sx={{
						flex: 1,
						bgcolor: "background.paper",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 2,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						p: 2.5,
						overflow: "hidden",
					}}
				>
					<Typography
						variant="subtitle2"
						fontWeight={700}
						sx={{ textTransform: "uppercase", letterSpacing: 1 }}
					>
						Cuaca Rata-rata
					</Typography>
					<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
						<Stack direction="row" spacing={2} alignItems="center">
							<Box>
								<Typography variant="h4" fontWeight={800}>
									{avgTemp ?? ""}°C
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Suhu
								</Typography>
							</Box>
						</Stack>
						<Stack direction="row" spacing={3}>
							<Box>
								<Typography variant="h6" fontWeight={700}>
									{avgHumid ?? ""}%
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Humid
								</Typography>
							</Box>
							<Box>
								<Typography variant="h6" fontWeight={700}>
									{fields[0]?.rainfall30d?.avg_mm ?? ""} mm
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Hujan/hr
								</Typography>
							</Box>
						</Stack>
					</Box>
				</Paper>
				<Box sx={{ flex: { xs: 1, md: 2 } }}>
					<GrowthCard fields={fields} />
				</Box>
			</Box>

			{fields.length > 0 && (
				<Box sx={{ px: 2, pb: 2 }}>
					<WeatherTrendsChart fields={fields} />
				</Box>
			)}

		<Paper
			sx={{
				mx: { xs: 1, md: 2 },
				mb: 2,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				overflow: "hidden",
				flex: 1,
				display: "flex",
				flexDirection: "column",
				minHeight: 0,
			}}
		>
				<Box
					sx={{
						px: 2.5,
						py: 2,
						borderBottom: "1px solid",
						borderColor: "divider",
					}}
				>
					<Typography
						variant="subtitle2"
						fontWeight={700}
						sx={{ textTransform: "uppercase", letterSpacing: 1 }}
					>
						Lahan Terbaru
					</Typography>
				</Box>
				{fields.length === 0 ? (
					<Box sx={{ p: 4, textAlign: "center" }}>
						<Typography color="text.secondary">Belum ada lahan.</Typography>
						<Button
							component={Link}
							to="/"
							variant="outlined"
							size="small"
							sx={{ mt: 2 }}
						>
							Buat di Peta
						</Button>
					</Box>
				) : (
					<Box sx={{ overflow: "auto", flex: 1 }}>
						{[...fields]
							.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
							.slice(0, 6)
							.map((f) => (
								<FieldItem key={f.id} field={f} onDelete={onDelete} />
							))}
					</Box>
				)}
			</Paper>
		</Box>
	);
}

function FieldItem({ field, onDelete }) {
	const g = getGrowthStage(field.plantingDate);
	return (
		<Box
			sx={{
				p: 2,
				borderBottom: "1px solid",
				borderColor: "divider",
				"&:last-child": { borderBottom: 0 },
				"&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
			}}
		>
			<Stack spacing={1.5}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<Box
							sx={{
								width: 10,
								height: 10,
								borderRadius: "50%",
								bgcolor: g?.color ?? "#64748b",
								border: "2px solid",
								borderColor: g?.color ?? "#64748b",
								opacity: 0.3,
							}}
						/>
						<Typography variant="subtitle2" fontWeight={700}>
							{field.name}
						</Typography>
					</Stack>
					<IconButton
						size="small"
						onClick={() => onDelete(field.id)}
						sx={{ color: "error.main" }}
					>
						<DeleteIcon sx={{ fontSize: 16 }} />
					</IconButton>
				</Stack>
				<Stack direction="row" spacing={2} flexWrap="wrap">
					<Stack direction="row" spacing={0.5} alignItems="center">
						<TerrainIcon sx={{ fontSize: 12, color: "text.disabled" }} />
						<Typography variant="caption" color="text.secondary">
							{field.area_ha?.toFixed(2)} ha
						</Typography>
					</Stack>
					<Stack direction="row" spacing={0.5} alignItems="center">
						<WbSunnyIcon sx={{ fontSize: 12, color: "text.disabled" }} />
						<Typography variant="caption" color="text.secondary">
							{field.temp?.toFixed(1)}°C
						</Typography>
					</Stack>
					<Stack direction="row" spacing={0.5} alignItems="center">
						<WaterDropIcon sx={{ fontSize: 12, color: "text.disabled" }} />
						<Typography variant="caption" color="text.secondary">
							{field.humidity}%
						</Typography>
					</Stack>
					{g && (
						<Box
							sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: `${g.color}20` }}
						>
							<Typography
								variant="caption"
								fontWeight={700}
								sx={{ color: g.color }}
							>
								{g.stage} · {g.days}h
							</Typography>
						</Box>
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

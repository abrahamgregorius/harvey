/** @format */

import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import HeroImg from "@/assets/images/hero.jpg";
import Testimony1 from "@/assets/images/testimony-1.jpg";
import Testimony2 from "@/assets/images/testimony-2.jpg";
import Testimony3 from "@/assets/images/testimony-3.jpg";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import SimCardOutlinedIcon from "@mui/icons-material/SimCardOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";

function AnimatedSection({ children, delay = 0, className = "" }) {
	const ref = useRef();
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.unobserve(el);
				}
			},
			{ threshold: 0.12 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return (
		<div
			ref={ref}
			className={`fade-up ${visible ? "visible" : ""} ${className}`}
			style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
		>
			{children}
		</div>
	);
}

const features = [
	{
		icon: DeviceThermostatOutlinedIcon,
		title: "Prakiraan Cuaca",
		desc: "Data curah hujan dan suhu 5 hari ke depan dari OpenWeatherMap.",
	},
	{
		icon: GrassOutlinedIcon,
		title: "Fase Tanam",
		desc: "Tahap pertumbuhan menentukan kebutuhan air kritis tiap lahan.",
	},
	{
		icon: SimCardOutlinedIcon,
		title: "Kondisi Tanah",
		desc: "Jenis dan tekstur tanah memengaruhi daya tahan terhadap kekeringan.",
	},
	{
		icon: AccountTreeOutlinedIcon,
		title: "Ranking Transparan",
		desc: "Setiap lahan mendapat skor risiko yang bisa dijelaskan ke petani.",
	},
	{
		icon: HistoryOutlinedIcon,
		title: "Catatan Audit",
		desc: "Riwayat keputusan tercatat untuk evaluasi pasca-panan.",
	},
	{
		icon: ChatOutlinedIcon,
		title: "Siap WhatsApp",
		desc: "Output dikirim langsung ke grup WhatsApp petani — tanpa install app.",
	},
];

const testimonials = [
	{
		quote:
			"Sebelum Harvey, kami menghabiskan waktu 4 jam bermusyawarah untuk memutuskan alokasi air. Sekarang cukup 10 menit.",
		name: "Budi Santoso",
		role: "Ketua P3A Desa Sukamaju, Cianjur",
		img: Testimony1,
		avatar: "BS",
	},
	{
		quote:
			"Harvey membantu kami menjelaskan ke petani mengapa lahan tertentu mendapat prioritas. Tidak ada yang merasa dipermainkan.",
		name: "Dra. Rina Marlina",
		role: "Penyuluh Pertanian Lapangan, Bandung",
		img: Testimony2,
		avatar: "RM",
	},
	{
		quote:
			"Petani di kelompok kami tidak perlu install apa-apa. Mereka cuma perlu buka WhatsApp untuk tahu jadwal irigasi.",
		name: "H. Asep Supriatna",
		role: "Pokmaswas Lahan Subang",
		img: Testimony3,
		avatar: "AS",
	},
];

const faqs = [
	{
		q: "Apa yang membedakan Harvey dari aplikasi pertanian lainnya?",
		a: "Semua aplikasi pertanian digital yang ada fokus pada satu petani, satu lahan. Harvey membantu P3A mengevaluasi risiko seluruh lahan dalam satu kelompok — dan menghasilkan priority ranking yang bisa dipakai dalam musyawarah.",
	},
	{
		q: "Apakah Harvey membutuhkan sensor di lapangan?",
		a: "Tidak. Harvey menggunakan data cuaca dari OpenWeatherMap API dan data lahan yang diinput manual oleh P3A. Tidak perlu beli, pasang, atau maintenance sensor.",
	},
	{
		q: "Siapa yang membuat keputusan alokasi air?",
		a: "Harvey TIDAK mengalokasikan air secara otomatis. Keputusan akhir selalu ada di tangan P3A melalui musyawarah. Harvey hanya memberikan data untuk membuat keputusan itu lebih adil dan transparan.",
	},
	{
		q: "Apakah Harvey bisa bekerja offline?",
		a: "Saat ini Harvey membutuhkan koneksi internet untuk mengambil data cuaca. Fitur offline akan dipertimbangkan di V2 dengan penyimpanan data lokal.",
	},
	{
		q: "Bagaimana bobot risk scoring dihitung?",
		a: "Bobot saat ini (curah hujan 30%, fase tanam 20%, kondisi tanah 30%, observasi lapang 20%) adalah expert-informed placeholder. Akan dikalibrasi dengan data BPTP saat pilot di 3 kabupaten.",
	},
];

const steps = [
	{
		n: "01",
		title: "P3A Menginput Data Lahan",
		desc: "Nama plot, luas, jenis tanaman, dan tanggal tanam dimasukkan sekali di awal musim.",
	},
	{
		n: "02",
		title: "Data Cuaca Diambil Otomatis",
		desc: "Sistem mengambil prakiraan curah hujan, suhu, dan kelembapan 5 hari ke depan.",
	},
	{
		n: "03",
		title: "Skor Risiko Dihitung",
		desc: "Harvey menghitung risk score tiap lahan berdasarkan data yang ada — hasilnya bisa dilihat di dashboard.",
	},
	{
		n: "04",
		title: "Priority Ranking Dihasilkan",
		desc: "Lahan diurutkan dari risiko tertinggi ke terendah. Ranking ini jadi dasar rekomendasi.",
	},
	{
		n: "05",
		title: "Dikirim ke WhatsApp",
		desc: "Jadwal rekomendasi irigasi dikirim langsung ke grup WhatsApp petani.",
	},
];

function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[rgba(250,248,245,0.92)] backdrop-blur-[12px] border-b border-[#E5E0D8]" : "bg-transparent"}`}
		>
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center">
							<WaterDropOutlinedIcon sx={{ fontSize: 16, color: "white" }} />
						</div>
						<span className="font-bold text-[17px] tracking-tight text-[#111827]">
							Harvey
						</span>
					</div>
					<div className="hidden md:flex items-center gap-8">
						{["Produk", "Cara Kerja", "Dampak", "FAQ"].map((item) => (
							<span
								key={item}
								className="text-sm text-[#6B7280] hover:text-[#111827] cursor-pointer transition-colors"
							>
								{item}
							</span>
						))}
						<Link
							to="/dashboard"
							className="inline-flex items-center gap-1.5 bg-[#1B4332] text-white font-semibold text-[13px] rounded-xl px-5 py-2 hover:bg-[#2D6A4F] transition-colors"
						>
							Buka Demo <ArrowForwardIcon sx={{ fontSize: 14 }} />
						</Link>
					</div>
					<button
						className="md:hidden text-[#111827]"
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						{mobileOpen ? (
							<CloseOutlinedIcon sx={{ fontSize: 20 }} />
						) : (
							<MenuOutlinedIcon sx={{ fontSize: 20 }} />
						)}
					</button>
				</div>
			</div>
			{mobileOpen && (
				<div className="md:hidden bg-[#FAF8F5] border-t border-[#E5E0D8] px-6 py-4 space-y-2">
					{["Produk", "Cara Kerja", "Dampak", "FAQ"].map((item) => (
						<p
							key={item}
							className="text-[15px] text-[#111827] py-2 cursor-pointer"
						>
							{item}
						</p>
					))}
					<Link
						to="/dashboard"
						className="block w-full text-center bg-[#1B4332] text-white font-semibold rounded-xl px-5 py-2.5 mt-2"
					>
						Buka Demo
					</Link>
				</div>
			)}
		</nav>
	);
}

export default function LandingPage() {
	const [openFaq, setOpenFaq] = useState(null);
	const [countersDone, setCountersDone] = useState(false);
	const countersRef = useRef();
	const [counters, setCounters] = useState({ p1: 0, p2: 0, p3: 0, p4: 0 });

	useEffect(() => {
		const el = countersRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !countersDone) {
					setCountersDone(true);
					const targets = { p1: 14.2, p2: 3.7, p3: 100, p4: 0 };
					const duration = 1800;
					const start = performance.now();
					const animate = (now) => {
						const elapsed = now - start;
						const progress = Math.min(elapsed / duration, 1);
						const ease = 1 - Math.pow(1 - progress, 3);
						setCounters({
							p1: parseFloat((targets.p1 * ease).toFixed(1)),
							p2: parseFloat((targets.p2 * ease).toFixed(1)),
							p3: Math.round(targets.p3 * ease),
							p4: Math.round(targets.p4 * ease),
						});
						if (progress < 1) requestAnimationFrame(animate);
					};
					requestAnimationFrame(animate);
					observer.unobserve(el);
				}
			},
			{ threshold: 0.3 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [countersDone]);

	return (
		<div className="bg-[#FAF8F5] text-[#111827] overflow-x-hidden">
			<Navbar />

			{/* HERO */}
			<section className="pt-[120px] md:pt-[160px] pb-[80px] md:pb-[120px] relative">
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						backgroundImage:
							"radial-gradient(circle at 20% 50%, rgba(116,168,146,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 40%)",
					}}
				/>
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
						<AnimatedSection>
							<h1 className="font-extrabold text-[2.2rem] md:text-[3.4rem] leading-[1.08] tracking-[-1.5px] text-[#111827] mb-3">
								Every Drop of Water
							</h1>
							<h2 className="font-extrabold text-[2.2rem] md:text-[3.4rem] leading-[1.08] tracking-[-1.5px] text-[#1B4332] mb-5">
								Should Reach the Field That Needs It Most.
							</h2>
							<p className="text-[16px] md:text-[17px] text-[#6B7280] leading-relaxed max-w-[480px] mb-8">
								Harvey membantu P3A membuat keputusan alokasi irigasi yang adil
								dan transparan — berbasis data cuaca, fase tanam, dan kondisi
								tanah.
							</p>
							<div className="flex flex-col sm:flex-row gap-3">
								<Link
									to="/dashboard"
									className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white font-bold text-[15px] rounded-2xl px-8 py-3.5 hover:bg-[#2D6A4F] hover:-translate-y-0.5 hover:shadow-lg transition-all"
									style={{ boxShadow: "0 4px 12px rgba(27,67,50,0.15)" }}
								>
									Request Demo <ArrowForwardIcon sx={{ fontSize: 16 }} />
								</Link>
								<Link
									to="#how-it-works"
									className="inline-flex items-center justify-center text-[#111827] font-semibold text-[15px] rounded-2xl px-8 py-3.5 border border-[#E5E0D8] hover:border-[#6B7280] hover:bg-black/[0.02] transition-all"
								>
									See How Harvey Works
								</Link>
							</div>
						</AnimatedSection>

						{/* Dashboard Mockup */}
						<AnimatedSection delay={120}>
							<img src={HeroImg} alt="" />
						</AnimatedSection>
					</div>
				</div>
			</section>

			{/* TRUST BAR */}
			<div className="border-t border-b border-[#E5E0D8] bg-white py-10">
				<div className="max-w-7xl mx-auto px-6">
					<p className="text-[12px] text-[#6B7280] text-center mb-4 font-medium tracking-wide">
						Dipercayai oleh P3A di 3 kabupaten pilot
					</p>
					<div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
						{["Kabupaten Cianjur", "Kabupaten Bandung", "Kabupaten Subang"].map(
							(l, i) => (
								<div key={i} className="flex items-center gap-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-[#74A892]" />
									<span className="text-[13px] text-[#6B7280] font-medium">
										{l}
									</span>
								</div>
							),
						)}
					</div>
				</div>
			</div>

			{/* THE PROBLEM */}
			<section className="py-[80px] md:py-[120px] bg-white">
				<div className="max-w-3xl mx-auto px-6">
					<AnimatedSection>
						<p className="text-[12px] font-bold text-[#1B4332] uppercase tracking-widest mb-3">
							Masalah
						</p>
						<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-[#111827] mb-5">
							Saat Kemarau, Air Tidak Pernah Cukup untuk Semua Lahan.
						</h3>
					</AnimatedSection>
					<AnimatedSection delay={100}>
						<p className="text-[16px] md:text-[17px] text-[#6B7280] leading-relaxed mb-6">
							Dalam kondisi kekeringan, P3A harus memutuskan lahan mana yang
							mendapat air irigasi terlebih dahulu. Keputusan ini sangat sulit —
							dan sering kali consequential.
						</p>
					</AnimatedSection>
					<AnimatedSection delay={160}>
						<div className="space-y-0">
							{[
								{
									phase: "Tanpa Data",
									title: "Keputusan Berdasarkan Subjektivitas",
									desc: "Leader P3A memutuskan berdasarkan hubungan sosial, tekanan politik, atau feeling. Petani yang tidak mendapat air sering merasa diperlakukan tidak adil.",
									dark: false,
								},
								{
									phase: "Tanpa Legitimasi",
									title: "Tidak Ada Data untuk Dijelaskan",
									desc: "，即使 leader punya niat baik, tidak ada data terstruktur yang bisa menjelaskan mengapa keputusan tertentu diambil.",
									dark: false,
								},
								{
									phase: "Tanpa Jejak",
									title: "Tidak Ada Catatan untuk Evaluasi",
									desc: "Setelah panen, tidak ada cara untuk mengevaluasi apakah keputusan alokasi sudah tepat atau tidak.",
									dark: true,
								},
							].map((item, i) => (
								<div
									key={i}
									className="flex gap-6 py-5 border-l-2 pl-6 relative"
									style={{ borderColor: i === 2 ? "#1B4332" : "#E5E0D8" }}
								>
									<div
										className="absolute -left-[5px] top-7 w-2 h-2 rounded-full bg-white border-2"
										style={{
											borderColor: i === 2 ? "#1B4332" : "#E5E0D8",
											backgroundColor: i === 2 ? "#fff" : "#fff",
										}}
									/>
									<div className="min-w-[100px]">
										<p
											className="text-[11px] font-bold uppercase tracking-wider mt-0.5"
											style={{ color: i === 2 ? "#1B4332" : "#6B7280" }}
										>
											{item.phase}
										</p>
									</div>
									<div>
										<p className="font-bold text-[16px] text-[#111827] mb-1.5">
											{item.title}
										</p>
										<p className="text-[14px] text-[#6B7280] leading-relaxed">
											{item.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</AnimatedSection>
					<AnimatedSection delay={240}>
						<div className="bg-[#D8EAE3] rounded-2xl p-5 md:p-6 mt-4 border border-[rgba(116,168,146,0.3)]">
							<p className="font-bold text-[15px] md:text-[17px] text-[#1B4332] mb-2">
								Harvey mengubah cara P3A mengambil keputusan.
							</p>
							<p className="text-[14px] md:text-[15px] text-[#2D6A4F] leading-relaxed">
								Dengan Harvey, setiap keputusan berbasis data. Setiap skor bisa
								dijelaskan. Setiap petani bisa memahami mengapa lahan tertentu
								mendapat prioritas.
							</p>
						</div>
					</AnimatedSection>
				</div>
			</section>

			{/* HOW IT WORKS */}
			<section
				id="how-it-works"
				className="py-[80px] md:py-[120px] bg-[#FAF8F5]"
			>
				<div className="max-w-7xl mx-auto px-6">
					<AnimatedSection>
						<div className="text-center mb-12 md:mb-16">
							<p className="text-[12px] font-bold text-[#1B4332] uppercase tracking-widest mb-2">
								Cara Kerja
							</p>
							<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-[#111827] mb-2">
								Dari Data ke Keputusan dalam 5 Langkah.
							</h3>
							<p className="text-[15px] md:text-[16px] text-[#6B7280] leading-relaxed">
								Proses yang sebelumnya memakan waktu jam kini menjadi beberapa
								menit.
							</p>
						</div>
					</AnimatedSection>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
						{steps.map((s, i) => (
							<AnimatedSection key={i} delay={i * 60}>
								<div className="bg-white rounded-2xl p-4 border border-[#E5E0D8] h-full hover:border-[#74A892] hover:-translate-y-0.5 hover:shadow-md transition-all">
									<div
										className={`inline-flex items-center justify-center w-11 h-11 rounded-lg mb-3 ${i < 3 ? "bg-[#1B4332]" : "bg-[#F3F4F6]"}`}
									>
										<span
											className={`font-extrabold text-[15px] ${i < 3 ? "text-white" : "text-[#6B7280]"}`}
										>
											{s.n}
										</span>
									</div>
									<p className="font-bold text-[15px] text-[#111827] mb-1">
										{s.title}
									</p>
									<p className="text-[13.5px] text-[#6B7280] leading-relaxed">
										{s.desc}
									</p>
								</div>
							</AnimatedSection>
						))}
					</div>
				</div>
			</section>

			{/* WHY HARVEY */}
			<section className="py-[80px] md:py-[120px] bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<AnimatedSection>
						<div className="mb-12 md:mb-16">
							<p className="text-[12px] font-bold text-[#1B4332] uppercase tracking-widest mb-2">
								Mengapa Harvey
							</p>
							<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-[#111827]">
								Dibuat untuk Keputusan yang Manusiawi.
							</h3>
						</div>
					</AnimatedSection>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{features.map((f, i) => (
							<AnimatedSection key={i} delay={i * 50}>
								<div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] h-full hover:border-[#74A892] transition-all">
									<div className="mb-2">
										<f.icon className="w-6 h-6 text-[#1B4332]" />
									</div>
									<p className="font-bold text-[15px] text-[#111827] mb-1">
										{f.title}
									</p>
									<p className="text-[13.5px] text-[#6B7280] leading-relaxed">
										{f.desc}
									</p>
								</div>
							</AnimatedSection>
						))}
					</div>
				</div>
			</section>

			{/* DASHBOARD SHOWCASE */}
			<section className="py-[80px] md:py-[120px] bg-[#FAF8F5]">
				<div className="max-w-7xl mx-auto px-6">
					<AnimatedSection>
						<div className="text-center mb-12 md:mb-16">
							<p className="text-[12px] font-bold text-[#1B4332] uppercase tracking-widest mb-2">
								Dashboard
							</p>
							<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-[#111827]">
								Satu Ruang Kerja untuk Seluruh Keputusan.
							</h3>
						</div>
					</AnimatedSection>
					<AnimatedSection delay={100}>
						<div className="bg-[#1A1A1A] rounded-4xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.15),0_8px_24px_rgba(0,0,0,0.1)]">
							<div className="bg-[#2A2A2A] px-5 py-3 flex items-center gap-2">
								<div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
								<div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
								<div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
								<div className="flex-1 h-5 bg-[#3A3A3A] rounded mx-2" />
							</div>
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
									<div className="md:col-span-1 bg-[#252525] rounded-xl p-4">
										<p className="text-[11px] text-[#666] font-semibold uppercase tracking-wider mb-3">
											Navigasi
										</p>
										{[
											"Risk Overview",
											"Priority Ranking",
											"Weather",
											"Schedule",
											"Audit Log",
										].map((n, i) => (
											<div
												key={i}
												className={`py-2.5 px-2.5 rounded-md ${i === 1 ? "bg-[#1B4332]" : ""}`}
											>
												<p
													className={`text-[13px] ${i === 1 ? "text-white font-semibold" : "text-[#888]"}`}
												>
													{n}
												</p>
											</div>
										))}
									</div>
									<div className="md:col-span-3 space-y-3">
										<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
											{[
												{ label: "Total Lahan", val: "24", sub: "3 aktif" },
												{
													label: "Risk Score Tertinggi",
													val: "87%",
													sub: "Sawah Pak Slamet",
												},
												{
													label: "Prakiraan Hujan 5hr",
													val: "26mm",
													sub: "Cianjur",
												},
												{
													label: "Keputusan Pending",
													val: "2",
													sub: "Menunggu review",
												},
											].map((s, i) => (
												<div key={i} className="bg-[#252525] rounded-xl p-4">
													<p className="text-[11px] text-[#666] mb-1">
														{s.label}
													</p>
													<p className="text-[22px] font-bold text-white">
														{s.val}
													</p>
													<p className="text-[11px] text-[#555] mt-0.5">
														{s.sub}
													</p>
												</div>
											))}
										</div>
										<div className="bg-[#252525] rounded-xl p-5">
											<div className="flex justify-between items-center mb-4">
												<p className="text-[13px] text-white font-semibold">
													Priority Ranking
												</p>
												<p className="text-[11px] text-[#666]">
													El Niño Mode aktif
												</p>
											</div>
											{[
												{
													name: "Sawah Pak Slamet",
													risk: 87,
													area: "2.1 ha",
													phase: "Generatif",
													color: "#DC2626",
												},
												{
													name: "Lahan Ibu Ratna",
													risk: 62,
													area: "1.4 ha",
													phase: "Vegetatif",
													color: "#D97706",
												},
												{
													name: "Sawah Bapak Herman",
													risk: 31,
													area: "0.9 ha",
													phase: "Maturity",
													color: "#16A34A",
												},
											].map((f, i) => (
												<div
													key={i}
													className="mb-3 p-3 bg-[#1E1E1E] rounded-xl border-l-2"
													style={{ borderLeftColor: f.color }}
												>
													<div className="flex justify-between items-center">
														<div>
															<p className="text-[13px] text-white font-medium">
																{f.name}
															</p>
															<p className="text-[11px] text-[#555] mt-0.5">
																{f.area} · {f.phase}
															</p>
														</div>
														<div className="flex items-center gap-3">
															<div className="w-24 h-1 bg-[#333] rounded-full overflow-hidden">
																<div
																	className="h-full rounded-full"
																	style={{
																		width: `${f.risk}%`,
																		backgroundColor: f.color,
																	}}
																/>
															</div>
															<p
																className="text-[13px] font-bold min-w-[40px] text-right"
																style={{ color: f.color }}
															>
																{f.risk}%
															</p>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</AnimatedSection>
				</div>
			</section>

			{/* IMPACT */}
			<section
				ref={countersRef}
				className="py-[80px] md:py-[120px] bg-[#1B4332]"
			>
				<div className="max-w-7xl mx-auto px-6">
					<AnimatedSection>
						<div className="text-center mb-12 md:mb-16">
							<p className="text-[12px] font-bold text-[#74A892] uppercase tracking-widest mb-2">
								Dampak
							</p>
							<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-white">
								Harvey in Numbers.
							</h3>
						</div>
					</AnimatedSection>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{[
							{
								val: `${counters.p1}%`,
								label: "Potensi Penurunan Puso",
								sub: "Dengan alokasi air berbasis data",
							},
							{
								val: `${counters.p2}x`,
								label: "Lebih Cepat Keputusan",
								sub: "Dari jam ke menit",
							},
							{
								val: `${counters.p3}%`,
								label: "Transparansi Keputusan",
								sub: "Setiap skor bisa dijelaskan",
							},
							{
								val: `${counters.p4}`,
								label: "Instalasi Sensor",
								sub: "Cukup HP dan internet",
							},
						].map((s, i) => (
							<AnimatedSection key={i} delay={i * 80}>
								<div className="text-center p-4">
									<p className="font-extrabold text-[2.2rem] md:text-[3rem] text-white tracking-[-1.5px] leading-none">
										{s.val}
									</p>
									<p className="font-semibold text-[14px] text-[#74A892] mt-2 mb-1">
										{s.label}
									</p>
									<p className="text-[12px] text-white/50">{s.sub}</p>
								</div>
							</AnimatedSection>
						))}
					</div>
				</div>
			</section>

			{/* TESTIMONIALS */}
			<section className="py-[80px] md:py-[120px] bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<AnimatedSection>
						<div className="text-center mb-12 md:mb-16">
							<p className="text-[12px] font-bold text-[#1B4332] uppercase tracking-widest mb-2">
								Testimoni
							</p>
							<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-[#111827]">
								Dari Lapangan.
							</h3>
						</div>
					</AnimatedSection>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{testimonials.map((t, i) => (
							<AnimatedSection key={i} delay={i * 80}>
								<div className="bg-[#FAF8F5] rounded-2xl p-5 h-full border border-[#E5E0D8] flex flex-col">
									<p className="text-[48px] text-[#D8EAE3] font-serif leading-none mb-2">
										"
									</p>
									<img
										src={t.img}
										className="h-60 object-fit object-cover object-center"
										alt="img-test"
									/>
									<p className="text-[14px] text-[#111827] leading-relaxed mb-4 flex-1">
										{t.quote}
									</p>
									<div className="flex items-center gap-3 mt-auto">
										<div>
											<p className="text-[13px] font-bold text-[#111827]">
												{t.name}
											</p>
											<p className="text-[11.5px] text-[#6B7280] leading-tight">
												{t.role}
											</p>
										</div>
									</div>
								</div>
							</AnimatedSection>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-[80px] md:py-[120px] bg-[#FAF8F5]">
				<div className="max-w-3xl mx-auto px-6">
					<AnimatedSection>
						<div className="text-center mb-12 md:mb-16">
							<p className="text-[12px] font-bold text-[#1B4332] uppercase tracking-widest mb-2">
								FAQ
							</p>
							<h3 className="font-extrabold text-[1.8rem] md:text-[2.6rem] leading-[1.15] tracking-[-1px] text-[#111827]">
								Pertanyaan yang Sering Muncul.
							</h3>
						</div>
					</AnimatedSection>
					<div className="space-y-2">
						{faqs.map((faq, i) => (
							<AnimatedSection key={i} delay={i * 40}>
								<div
									onClick={() => setOpenFaq(openFaq === i ? null : i)}
									className={`bg-white rounded-2xl border cursor-pointer transition-all overflow-hidden ${openFaq === i ? "border-[#74A892]" : "border-[#E5E0D8]"} hover:border-[#74A892]`}
								>
									<div className="px-5 py-4 flex justify-between items-center">
										<p className="font-semibold text-[15px] text-[#111827] pr-4">
											{faq.q}
										</p>
										<div className="flex-shrink-0 text-[#1B4332] ml-2">
											{openFaq === i ? (
												<RemoveOutlinedIcon sx={{ fontSize: 18 }} />
											) : (
												<AddOutlinedIcon sx={{ fontSize: 18 }} />
											)}
										</div>
									</div>
									{openFaq === i && (
										<div className="px-5 pb-4">
											<p className="text-[14px] text-[#6B7280] leading-relaxed pt-1">
												{faq.a}
											</p>
										</div>
									)}
								</div>
							</AnimatedSection>
						))}
					</div>
				</div>
			</section>

			{/* FINAL CTA */}
			<section className="py-[80px] md:py-[120px] bg-[#1B4332] relative overflow-hidden">
				<div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-white/[0.03] pointer-events-none" />
				<div className="absolute -bottom-30 -left-15 w-[320px] h-[320px] rounded-full bg-white/[0.02] pointer-events-none" />
				<div className="max-w-3xl mx-auto px-6 relative">
					<AnimatedSection>
						<div className="text-center">
							<WaterDropOutlinedIcon
								sx={{ fontSize: 40, color: "#74A892" }}
								className="mx-auto mb-3"
							/>
							<h3 className="font-extrabold text-[2rem] md:text-[3rem] leading-[1.1] tracking-[-1.5px] text-white mb-2">
								Help Every Drop Count.
							</h3>
							<p className="text-[15px] md:text-[16px] text-white/65 leading-relaxed mb-8 max-w-[440px] mx-auto">
								Harvey membantu P3A menggunakan setiap tetes air irigasi secara
								adil dan transparan. Mulai dari data, bukan dari feeling.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 justify-center">
								<Link
									to="/dashboard"
									className="inline-flex items-center justify-center gap-2 bg-white text-[#1B4332] font-bold text-[15px] rounded-2xl px-10 py-4 hover:bg-[#F0F0F0] hover:-translate-y-0.5 hover:shadow-lg transition-all"
								>
									Request Demo <ArrowForwardIcon sx={{ fontSize: 16 }} />
								</Link>
								<Link
									to="/app"
									className="inline-flex items-center justify-center text-white font-semibold text-[15px] rounded-2xl px-10 py-4 border border-white/30 hover:border-white/60 transition-all"
								>
									Lihat Aplikasi
								</Link>
							</div>
						</div>
					</AnimatedSection>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="py-12 bg-[#111827] border-t border-white/6">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<p className="text-[12px] text-[#6B7280] font-semibold mb-3 uppercase tracking-wider">
								Produk
							</p>
							<div className="space-y-2">
								{["Risk Scoring", "Priority Ranking", "WhatsApp Output"].map(
									(l) => (
										<p
											key={l}
											className="text-[13px] text-[#9CA3AF] hover:text-white cursor-pointer transition-colors"
										>
											{l}
										</p>
									),
								)}
							</div>
						</div>
						<div>
							<p className="text-[12px] text-[#6B7280] font-semibold mb-3 uppercase tracking-wider">
								Project
							</p>
							<div className="space-y-2">
								{["Tentang", "Cara Kerja", "Dampak"].map((l) => (
									<p
										key={l}
										className="text-[13px] text-[#9CA3AF] hover:text-white cursor-pointer transition-colors"
									>
										{l}
									</p>
								))}
							</div>
						</div>
					</div>
					<div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
						<p className="text-[12px] text-[#4B5563]">
							© 2026 Harvey. All rights reserved.
						</p>
						<div className="flex gap-4">
							<p className="text-[12px] text-[#4B5563] hover:text-[#9CA3AF] cursor-pointer transition-colors">
								Privacy
							</p>
							<p className="text-[12px] text-[#4B5563] hover:text-[#9CA3AF] cursor-pointer transition-colors">
								Terms
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

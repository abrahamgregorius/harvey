/** @format */

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import LoginBgImg from '@/assets/images/login-bg.jpg';

import { signInWithPassword } from '../services/authService';

function Spinner() {
	return (
		<svg
			className="animate-spin h-5 w-5 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			/>
		</svg>
	);
}

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleEmailLogin(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const { error } = await signInWithPassword(email, password);
		setLoading(false);
		if (error) {
			setError(error.message);
		} else {
			navigate("/dashboard/home");
		}
	}

	return (
		<div className="min-h-screen flex">
			{/* Left Section - Image */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				<img
					src={LoginBgImg}
					alt="Login Background"
					className="absolute inset-0 w-full h-full object-cover"
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent" />

				{/* Optional Content */}
				<div className="relative z-10 flex flex-col justify-end p-12 text-white">
					<h1 className="text-5xl font-bold mb-4">HARVEY</h1>
					<p className="max-w-md text-lg text-white/90">
						Decision Support System for Irrigation
					</p>
				</div>
			</div>

			{/* Right Section - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-stone-50">
				<div className="w-full max-w-sm">
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-stone-800">Masuk</h2>
						<p className="text-stone-500 text-sm mt-1">
							Masukkan email dan password Anda.
						</p>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
							{error}
						</div>
					)}

					<form onSubmit={handleEmailLogin} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-stone-700 mb-1.5">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
								placeholder="nama@email.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-stone-700 mb-1.5">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
								placeholder="••••••••"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-emerald-900 hover:bg-emerald-800 disabled:bg-emerald-800 text-white font-semibold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2"
						>
							{loading ? <Spinner /> : "Masuk"}
						</button>
					</form>

					<p className="text-stone-400 text-xs text-center mt-6">
						Belum punya akun? Hubungi admin P3A Anda.
					</p>
				</div>
			</div>
		</div>
	);
}

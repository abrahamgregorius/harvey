/** @format */

import { createContext, useContext, useEffect, useState } from "react";
import {
	getSession,
	onAuthStateChange,
	signOut as authSignOut,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	async function signOut() {
		await authSignOut();
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, loading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}

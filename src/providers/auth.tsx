import { createContext, useContext, useMemo, useState } from "react";

export interface AuthSession {
	loggedIn: boolean;

	logIn: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthSession>({
	loggedIn: false,
	logIn: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [loggedIn, setLoggedIn] = useState(false);

	const logIn = async (email: string, password: string) => {
		try {
			console.log(`Logging in with email: ${email} & password: ${password}`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setLoggedIn(true);
		} catch (error) {
			console.error(error);
		}
	};

	const value = useMemo(
		() => ({
			loggedIn,
			logIn,
		}),
		[loggedIn]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

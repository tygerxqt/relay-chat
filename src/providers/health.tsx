import pb from "@/lib/pocketbase";
import { createContext, useContext, useEffect, useState } from "react";

export interface Health {
	online: boolean;
	checkHealth: () => Promise<void>;
}

export const HealthContext = createContext<Health>({
	online: true,
	checkHealth: async () => {},
});

export const HealthProvider = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);
	const [online, setOnline] = useState(false);

	let interval: NodeJS.Timeout;

	async function checkHealth() {
		await pb.health
			.check()
			.then((res) => {
				setOnline(res.code === 200);
			})
			.catch((err) => {
				console.log(err);
				setOnline(false);
			});

		// Move this here to prevent the Offline component flashing when the app starts
		setMounted(true);
	}

	useEffect(() => {
		interval = setInterval(() => {
			checkHealth();
		}, 5000);

		// If offline, let the Offline component handle the retry logic
		if (!online) {
			clearInterval(interval);
		}

		checkHealth();
	}, [online]);

	return (
		<HealthContext.Provider value={{ online, checkHealth }}>
			{mounted && children}
		</HealthContext.Provider>
	);
};

export const useHealth = () => {
	const context = useContext(HealthContext);
	if (context === undefined) {
		throw new Error("useHealth must be used within a HealthProvider");
	}
	return context;
};

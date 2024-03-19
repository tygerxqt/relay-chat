import Authentication from "./components/auth";
import { ThemeSwitch } from "./components/theme-switch";
import { useAuth } from "./providers/auth";

export default function App() {
	const { loggedIn } = useAuth();
	return (
		<>
			{loggedIn ? (
				<main className="w-full min-h-screen text-center items-center justify-center">
					<ThemeSwitch />
				</main>
			) : (
				<Authentication />
			)}
		</>
	);
}

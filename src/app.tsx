import { ThemeSwitch } from "./components/theme-switch";
import { ThemeProvider } from "./providers/theme";

export default function App() {
	return (
		<>
			<ThemeProvider>
				<main className="w-full min-h-screen text-center items-center justify-center">
					<ThemeSwitch />
				</main>
			</ThemeProvider>
		</>
	);
}

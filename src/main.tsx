import ReactDOM from "react-dom/client";

import App from "./app";
import { ThemeProvider } from "./providers/theme";
import { AuthProvider } from "./providers/auth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeProvider defaultTheme="dark" storageKey="relay-theme">
		<AuthProvider>
			<App />
		</AuthProvider>
	</ThemeProvider>
);

import ReactDOM from "react-dom/client";

import { typesafeBrowserRouter } from "react-router-typesafe";
import { RouterProvider } from "react-router-dom";

import App from "./app";

import { ThemeProvider } from "./providers/theme";
import { AuthProvider } from "./providers/auth";
import { HealthProvider } from "./providers/health";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";

import NotFound from "./pages/not-found";
import Error from "./pages/error";

import DirectMessagePage, {
	loader as DirectMessageLoader,
} from "./pages/friends/direct-message";
import AccountSettingsPage from "./pages/settings/account";
import SettingsLayout from "./pages/settings";

// Styles for image cropper
import "react-image-crop/dist/ReactCrop.css";

// Add buffer polyfills
import { Buffer as BufferPolyfill } from "buffer";
import DangerSettingsPage from "./pages/settings/danger";
declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;

const router = typesafeBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				// An empty path will match the parent route
				path: "",
				element: <div>Home</div>,
				errorElement: <Error />,
			},
			{
				path: "friends/:id",
				element: <DirectMessagePage />,
				errorElement: <Error />,
				loader: DirectMessageLoader,
			},
		],
	},
	{
		path: "/settings",
		element: <SettingsLayout />,
		children: [
			{
				path: "account",
				element: <AccountSettingsPage />,
				errorElement: <Error />,
			},
			{
				path: "danger",
				element: <DangerSettingsPage />,
				errorElement: <Error />,
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeProvider defaultTheme="dark" storageKey="relay-theme">
		<HealthProvider>
			<AuthProvider>
				<TooltipProvider>
					<Toaster />
					<RouterProvider router={router.router} />
				</TooltipProvider>
			</AuthProvider>
		</HealthProvider>
	</ThemeProvider>
);

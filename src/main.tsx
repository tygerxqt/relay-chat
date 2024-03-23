import ReactDOM from "react-dom/client";

import App from "./app";
import { ThemeProvider } from "./providers/theme";
import { AuthProvider } from "./providers/auth";
import { RouterProvider } from "react-router-dom";
import { typesafeBrowserRouter } from "react-router-typesafe";
import NotFound from "./pages/not-found";
import Error from "./pages/error";
import DirectMessagePage, { loader as DirectMessageLoader } from "./pages/direct-message";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";

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
	{ path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeProvider defaultTheme="dark" storageKey="relay-theme">
		<AuthProvider>
			<TooltipProvider>
				<Toaster />
				<RouterProvider router={router.router} />
			</TooltipProvider>
		</AuthProvider>
	</ThemeProvider>
);

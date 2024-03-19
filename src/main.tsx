import ReactDOM from "react-dom/client";

import App from "./app";
import { ThemeProvider } from "./providers/theme";
import { AuthProvider } from "./providers/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/not-found";
import Error from "./pages/error";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <Error />,
		children: [
			{
				// An empty path will match the parent route
				path: "",
				element: <div>Home</div>,
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeProvider defaultTheme="dark" storageKey="relay-theme">
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</ThemeProvider>
);

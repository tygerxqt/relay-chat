import Authentication from "./components/auth/authentication";
import { Outlet } from "react-router-dom";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./components/ui/resizable";
import { useAuth } from "./providers/auth";
import Sidebar from "./components/app/side-bar";

export default function App() {
	const { loggedIn } = useAuth();

	return (
		<main className="flex flex-row w-full min-h-screen">
			{loggedIn ? (
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel minSize={20} maxSize={30}>
						<Sidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>
						<Outlet />
					</ResizablePanel>
				</ResizablePanelGroup>
			) : (
				<Authentication />
			)}
		</main>
	);
}

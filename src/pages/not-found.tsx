import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<>
			<main className="flex flex-col items-center justify-center w-full min-h-screen gap-4">
				<h1 className="text-3xl font-black">┐(￣∀￣)┌</h1>
				<h2 className="text-lg text-center">
					This page doesn&apos;t exist or you don&apos;t have access to it.
				</h2>
				<Link to="/">
					<Button variant="outline">Back to safety</Button>
				</Link>
			</main>
		</>
	);
}

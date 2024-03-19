import { useRouteError } from "react-router-dom";

export default function Error() {
	let error = useRouteError();
	console.error(error);

	return (
		<>
			<main className="flex flex-col items-center justify-center w-full min-h-screen gap-4">
				<h1 className="text-3xl font-black">┐(￣∀￣)┌</h1>
				<h2 className="text-lg text-center">
					This is embarrassing, but an error occurred.
				</h2>
				{/* @ts-ignore */}
				<code>{error.statusText || error.message}</code>
			</main>
		</>
	);
}

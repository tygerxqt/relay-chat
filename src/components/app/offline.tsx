import Spinner from "@/components/spinner";
import { useHealth } from "@/providers/health";
import { useEffect, useState } from "react";

export default function Offline() {
	const { checkHealth } = useHealth();

	const initialDelay = 1000;
	const maxDelay = 60000;

	const [delay, setDelay] = useState(initialDelay);
	const [loading, setLoading] = useState(false);
	const [secondsLeft, setSecondsLeft] = useState(delay / 1000);

	useEffect(() => {
		retryWithDelay();

		return () => {
			// Clear any ongoing retry process when component unmounts
			clearInterval(interval);
		};
	}, [delay]);

	let interval: NodeJS.Timeout; // Declare interval outside useEffect to access it in cleanup function

	async function retryWithDelay() {
		setLoading(true);
		interval = setInterval(() => {
			setSecondsLeft((prevSecondsLeft) => {
				if (prevSecondsLeft === 1) {
					clearInterval(interval);
					const newDelay = Math.min(delay * 2, maxDelay);
					setDelay(newDelay);
					setSecondsLeft(newDelay / 1000);
					checkHealth().finally(() => {
						setLoading(false); // Set loading to false after retry completes
					});
				}
				return prevSecondsLeft - 1;
			});
		}, 1000);
	}

	return (
		<>
			<main className="flex flex-col gap-8 items-center min-h-screen w-full justify-center">
				<div className="flex flex-col items-center gap-2">
					<h1 className="text-3xl font-black">(￣ヘ￣)</h1>
					<h2 className="text-3xl font-bold">You're offline</h2>
					<p className="text-neutral-500 dark:text-neutral-400">
						Relay is unable to connect to the database, either because you're
						offline or the server is down.
					</p>
				</div>
				<div className="flex flex-row gap-2 items-center justify-center text-center">
					{loading ? (
						<>
							<Spinner size={18} />
							<p className="font-medium">Attempting to connect...</p>
						</>
					) : (
						<>
							<p className="font-medium">
								Retrying in {secondsLeft} seconds...
							</p>
						</>
					)}
				</div>
			</main>
		</>
	);
}

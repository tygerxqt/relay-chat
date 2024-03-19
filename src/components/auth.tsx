import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { useAuth } from "@/providers/auth";
import Spinner from "./spinner";

export default function Authentication() {
	const [mode, setMode] = useState<"login" | "register" | "reset">("login");

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);

	const { logIn } = useAuth();

	const switchMode = (mode: "login" | "register" | "reset") => {
		if (!loading) {
			setFullName("");
			setEmail("");
			setUsername("");
			setPassword("");
			setMode(mode);
		} else {
			console.warn("Cannot switch mode while loading");
		}
	};

	const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		await logIn(email, password).catch((error) => console.error(error));
		setLoading(false);
	};

	const onRegister = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);

		try {
			console.log(
				`Submitting register with data: ${name}, ${username}, ${email}, ${password}`
			);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const onPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);

		try {
			console.log(`Submitting password reset with email: ${email}`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<main className="flex flex-row w-full h-full bg-neutral-100 dark:bg-neutral-950">
				<div className="w-full min-w-[350px] max-w-[500px] min-h-screen items-center flex flex-col justify-center border-r border-black/10 dark:border-white/10">
					<div className="flex flex-col items-center w-full gap-6 px-12">
						<div className="flex flex-col w-full gap-1">
							<h1 className="text-3xl font-bold">
								{mode === "login" && "Welcome Back"}
								{mode === "register" && "Join the club!"}
								{mode === "reset" && "Reset password"}
							</h1>
							<p className="text-sm text-neutral-400">
								{mode === "login" &&
									"Please log in with your Relay account to continue."}
								{mode === "register" &&
									"Create a Relay account and join the club!"}
								{mode === "reset" &&
									"Please enter your email address to reset your password."}
							</p>
						</div>
						<div className="flex flex-col w-full gap-3">
							{mode === "login" && (
								<>
									<form
										className="flex flex-col w-full gap-3"
										onSubmit={async (e) => await onSignIn(e)}
									>
										<Input
											placeholder="Email"
											type="email"
											autoComplete="off"
											required
											value={email}
											onInput={(e) => setEmail(e.currentTarget.value)}
										/>
										<Input
											placeholder="Password"
											type="password"
											required
											value={password}
											onInput={(e) => setPassword(e.currentTarget.value)}
										/>
										<Button
											size="sm"
											variant="primary"
											disabled={loading}
											type="submit"
										>
											{loading ? <Spinner size={22} /> : "Submit"}
										</Button>
									</form>
								</>
							)}
							{mode === "register" && (
								<>
									<form
										className="flex flex-col w-full gap-3"
										onSubmit={async (e) => await onRegister(e)}
									>
										<Input
											placeholder="Full Name"
											type="text"
											required
											value={fullName}
											onInput={(e) => setFullName(e.currentTarget.value)}
										/>
										<Input
											placeholder="Username"
											type="text"
											required
											value={username}
											onInput={(e) => setUsername(e.currentTarget.value)}
										/>
										<Input
											placeholder="Email"
											type="email"
											autoComplete="off"
											required
											value={email}
											onInput={(e) => setEmail(e.currentTarget.value)}
										/>
										<Input
											placeholder="Password"
											type="password"
											required
											value={password}
											onInput={(e) => setPassword(e.currentTarget.value)}
										/>
										<Button
											size="sm"
											variant="primary"
											disabled={loading}
											type="submit"
										>
											{loading ? <Spinner size={22} /> : "Submit"}
										</Button>
									</form>
								</>
							)}
							{mode === "reset" && (
								<>
									<form
										className="flex flex-col w-full gap-3"
										onSubmit={async (e) => await onPasswordReset(e)}
									>
										<Input
											placeholder="Email"
											autoComplete="off"
											required
											value={email}
											onInput={(e) => setEmail(e.currentTarget.value)}
										/>
										<Button
											size="sm"
											variant="primary"
											disabled={loading}
											type="submit"
										>
											{loading ? <Spinner size={22} /> : "Send"}
										</Button>
									</form>
								</>
							)}
						</div>

						<div className="flex flex-col w-full gap-2">
							{mode === "login" && (
								<>
									<div className="flex flex-row w-full gap-1">
										<p className="text-sm text-neutral-400">
											Don't have an account?
										</p>
										<p
											className="text-sm text-blue-500 cursor-pointer hover:text-blue-400"
											onClick={() => switchMode("register")}
										>
											Register.
										</p>
									</div>
									<div className="flex flex-row w-full gap-1">
										<p className="text-sm text-neutral-400">
											Forgot your password?
										</p>
										<p
											className="text-sm text-blue-500 cursor-pointer hover:text-blue-400"
											onClick={() => switchMode("reset")}
										>
											Reset it.
										</p>
									</div>
								</>
							)}
							{mode === "register" && (
								<>
									<div className="flex flex-row w-full gap-1">
										<p className="text-sm text-neutral-400">
											Already have an account?
										</p>
										<p
											className="text-sm text-blue-500 cursor-pointer hover:text-blue-400"
											onClick={() => switchMode("login")}
										>
											Log in.
										</p>
									</div>
								</>
							)}
							{mode === "reset" && (
								<>
									<div className="flex flex-row w-full gap-1">
										<p className="text-sm text-neutral-400">
											Remember your password?
										</p>
										<p
											className="text-sm text-blue-500 cursor-pointer hover:text-blue-400"
											onClick={() => switchMode("login")}
										>
											Log in.
										</p>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<div className="w-full min-h-screen">
					<img
						src="/auth.png"
						alt="bg"
						width={1920}
						height={1080}
						className="relative object-cover w-full h-full"
					/>
				</div>
			</main>
		</>
	);
}

import { AddFriends } from "@/components/chat/add-friends";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/providers/auth";
import { Cog, LogOut, UserSearchIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
	const { user, avatar, logOut } = useAuth();
	const [friends, setFriends] = useState(false);
	return (
		<>
			<main className="flex flex-col w-full min-h-screen items-center justify-center gap-4 p-16">
				<div className="flex flex-col gap-0 items-center">
					<h1 className="font-bold text-4xl">Relay</h1>
					<p className="font-medium">Effortless. Digital. Communication.</p>
				</div>
				<AddFriends open={friends} setOpen={setFriends} />
				<div className="flex flex-col gap-2 items-center justify-center">
					{user && (
						<div className="flex flex-row gap-2 items-center justify-center w-full">
							<div className="flex flex-row items-center gap-3 border rounded-md px-4 justify-center py-2">
								<div className="relative inline-block">
									<img
										src={avatar}
										alt="Profile Picture"
										className="w-12 h-12 rounded-full"
									/>
									<span className="absolute bottom-0 right-0 border-2 border-transparent w-[12px] h-[12px] bg-green-600 rounded-full"></span>
								</div>
								<div className="flex flex-col gap-0">
									<span className="text-md font-semibold">{user.name}</span>
									<span className="text-sm text-neutral-500 dark:text-neutral-400">
										@{user.username}
									</span>
								</div>
							</div>
							<Tooltip delayDuration={0}>
								<TooltipContent>
									<span>Add Friends</span>
								</TooltipContent>
								<TooltipTrigger>
									<Button
										variant="secondary"
										size="icon"
										className="w-16 h-16"
										onClick={() => setFriends(true)}
									>
										<UserSearchIcon size={24} />
									</Button>
								</TooltipTrigger>
							</Tooltip>

							<Tooltip delayDuration={0}>
								<TooltipContent>
									<span>Settings</span>
								</TooltipContent>
								<TooltipTrigger>
									<Link to="/settings/account">
										<Button
											variant="secondary"
											size="icon"
											className="w-16 h-16"
										>
											<Cog size={24} />
										</Button>
									</Link>
								</TooltipTrigger>
							</Tooltip>
							<Tooltip delayDuration={0}>
								<TooltipContent>
									<span>Sign Out</span>
								</TooltipContent>
								<TooltipTrigger>
									<Button
										variant="destructive"
										size="icon"
										className="w-16 h-16"
										onClick={() => logOut()}
									>
										<LogOut size={24} />
									</Button>
								</TooltipTrigger>
							</Tooltip>
						</div>
					)}
				</div>
			</main>
		</>
	);
}

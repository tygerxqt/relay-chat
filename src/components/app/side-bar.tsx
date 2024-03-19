import QuickSettings from "@/components/app/quick-settings";
import { Button } from "@/components/ui/button";
import { HomeIcon, UserSearchIcon } from "lucide-react";

export default function Sidebar() {
	return (
		<>
			<div className="z-10 flex-1 w-full h-full grow bg-neutral-100/50 dark:bg-neutral-900/50">
				<div className="flex flex-col h-full">
					<div className="flex flex-col justify-between gap-2 p-3 flex-cols rounded-tl-3xl">
						<Button
							variant={"ghost"}
							className="flex flex-row items-center justify-start w-full gap-3 text-medium"
						>
							<HomeIcon size={24} />
							Home
						</Button>
						<Button
							variant={"ghost"}
							className="flex flex-row items-center justify-start w-full gap-3 text-medium"
						>
							<UserSearchIcon size={24} />
							Add Friend
						</Button>
					</div>
					<hr className="border-1/2 border-black/10 dark:border-white/10" />
					{/* Friends */}
					<div className="flex flex-col w-full h-full gap-6 py-2 overflow-y-auto">
						<div className="flex flex-col items-center justify-center min-h-full gap-2 px-3 py-2 text-center">
							<UserSearchIcon size={32} />
							<p className="text-neutral-500 dark:text-neutral-400">
								Add some friends to start chatting with them!
							</p>
							<Button size="sm" className="mt-3" variant="primary">
								Add Friend
							</Button>
						</div>
					</div>
					{/* Quick settings */}
					<section className="z-40 flex flex-col pl-1 border-t bg-neutral-100 dark:bg-neutral-900 border-black/10 dark:border-white/10">
						<QuickSettings />
					</section>
				</div>
			</div>
		</>
	);
}

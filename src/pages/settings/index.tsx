import ProfileHeader from "@/components/auth/profile-header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/providers/auth";
import { LogOut, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function SettingsLayout() {
	const { logOut } = useAuth();
	return (
		<>
			<main className="w-full min-h-screen">
				<ScrollArea className="w-full h-screen">
					<div className="flex flex-row items-start justify-center gap-4 p-8">
						<div className="flex flex-col items-start w-full gap-2 p-4 max-w-64">
							<NavLink to="/settings/account" className="w-full">
								{({ isActive }) => (
									<Button
										variant="ghost"
										className={
											isActive
												? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50 w-full"
												: "w-full text-start"
										}
									>
										Account
									</Button>
								)}
							</NavLink>
							<NavLink to="/settings/danger" className="w-full">
								{({ isActive }) => (
									<Button
										variant="ghost"
										className={
											isActive
												? "bg-red-100 text-neutral-900 dark:bg-red-800 dark:text-neutral-50 hover:bg-red-100 dark:hover:bg-red-800 w-full"
												: "w-full text-start"
										}
									>
										Danger
									</Button>
								)}
							</NavLink>
							<hr className="w-full border-neutral-200 dark:border-neutral-700" />
							<Button
								className="hover:bg-red-100 flex flex-row gap-2 items-center hover:dark:bg-red-800 w-full"
								variant="ghost"
								onClick={async () => await logOut()}
							>
								<LogOut size={16} /> Log out
							</Button>
						</div>
						<div className="max-w-[800px] w-full">
							<ProfileHeader />
							<Outlet />
						</div>
						<div className="">
							<Link to="/">
								<Button variant="outline" size="icon">
									<X size={24} />
								</Button>
							</Link>
						</div>
					</div>
				</ScrollArea>
			</main>
		</>
	);
}

import QuickSettings from "@/components/app/quick-settings";
import { useAuth } from "@/providers/auth";
import { Button } from "../ui/button";
import { HomeIcon, PlusIcon, UserSearchIcon, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import { AddFriends } from "../chat/add-friends";
import pb from "@/lib/pocketbase";
import User from "@/types/user";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function Sidebar() {
	const { user, friends } = useAuth();
	const [friendsOpen, setFriendsOpen] = useState(false);
	const [incomingRequests, setIncomingRequests] = useState<
		{ user: User; record: string }[]
	>([]);

	async function fetchRequests() {
		await pb
			.collection("friend_requests")
			.getFullList({ expand: "to,from" })
			.then((res) => {
				console.log(res);

				const incoming = res
					.filter((record) => record.expand?.to.id === pb.authStore.model?.id)
					.map((record) => ({ user: record.expand?.from, record: record.id }));

				console.log("Incoming friend requests: ", incoming);

				setIncomingRequests(incoming);
			});
	}

	async function acceptRequest(record: { user: User; record: string }) {
		await pb.collection("friend_requests").delete(record.record);
		await pb.collection("users").update(pb.authStore.model?.id, {
			friends: [...friends, record.user.id],
		});
	}

	async function declineRequest(record: { user: User; record: string }) {
		await pb.collection("friend_requests").delete(record.record);
	}

	useEffect(() => {
		fetchRequests();

		pb.collection("friend_requests").subscribe("*", async () => {
			await fetchRequests();
		});

		return () => {
			pb.collection("friend_requests").unsubscribe("*");
		};
	}, []);

	return (
		<>
			{user && (
				<>
					<div className="z-10 flex-1 flex flex-col gap-2 min-h-screen h-screen w-full grow bg-neutral-100/50 dark:bg-neutral-900/50">
						<div className="flex flex-col h-full">
							<div className="flex flex-col justify-between gap-2 p-3 flex-cols rounded-tl-3xl">
								<Link to="/" className="w-full">
									<Button
										variant={"ghost"}
										className="flex flex-row items-center justify-start w-full gap-3 text-medium"
									>
										<HomeIcon size={24} />
										Home
									</Button>
								</Link>
								<AddFriends open={friendsOpen} setOpen={setFriendsOpen} />
								<Button
									variant={"ghost"}
									className="flex flex-row items-center justify-start w-full gap-3 text-medium"
									onClick={() => setFriendsOpen(true)}
								>
									<UserSearchIcon size={24} />
									Add Friend
								</Button>
							</div>
							<hr className="border-1/2 border-black/10 dark:border-white/10" />

							{/* Friends */}
							<div className="flex flex-col w-full h-full gap-6 py-2 overflow-y-auto">
								<Suspense fallback={<div>Loading...</div>}>
									{friends.length >= 1 ? (
										<div className="flex flex-col items-center justify-start min-h-full gap-2 px-2 text-center">
											<ScrollArea className="h-full flex flex-col w-full grow">
												<div className="flex flex-row gap-2 items-center justify-between px-3 py-2  text-neutral-500 dark:text-neutral-400">
													<span className="text-start text-xs font-semibold">
														Your Friends
													</span>
													<button onClick={() => setFriendsOpen(true)}>
														<PlusIcon size={18} />
													</button>
												</div>

												{friends.map((friend) => {
													return (
														<>
															<Link
																to={`/friends/${friend.id}`}
																className="w-full"
															>
																<Button
																	id={friend.id}
																	variant={"ghost"}
																	className="flex flex-row items-center justify-start w-full gap-3 text-medium"
																>
																	<img
																		src={`${
																			import.meta.env.VITE_AUTH_URL
																		}/api/files/_pb_users_auth_/${friend.id}/${
																			friend.avatar
																		}`}
																		alt={friend.username}
																		className="w-8 h-8 rounded-full"
																	/>
																	<span className="font-medium overflow-hidden text-ellipsis">
																		{friend.username}
																	</span>
																</Button>
															</Link>
														</>
													);
												})}
											</ScrollArea>
										</div>
									) : (
										<>
											{incomingRequests.length >= 1 ? (
												<>
													<div className="flex flex-col items-center justify-start min-h-full gap-2 px-2 text-center">
														<ScrollArea className="h-full flex flex-col w-full grow">
															<div className="flex flex-row gap-2 items-center justify-between px-3 py-2  text-neutral-500 dark:text-neutral-400">
																<span className="text-start text-xs font-semibold">
																	Incoming Friend Requests
																</span>
																<span className="text-sm">
																	{incomingRequests.length}
																</span>
															</div>

															{incomingRequests.map((record) => {
																return (
																	<>
																		<div
																			id={record.user.id}
																			className="flex flex-row gap-2 items-center justify-between px-3 py-2"
																		>
																			<div>
																				<img
																					src={`${
																						import.meta.env.VITE_AUTH_URL
																					}/api/files/_pb_users_auth_/${
																						record.user.id
																					}/${record.user.avatar}`}
																					alt={record.user.username}
																					className="w-8 h-8 rounded-full"
																				/>
																				<span className="font-medium overflow-hidden text-ellipsis">
																					{record.user.username}
																				</span>
																			</div>
																			<div className="flex flex-row gap-2 items-center">
																				<Tooltip delayDuration={0}>
																					<TooltipContent>
																						<span>Decline</span>
																					</TooltipContent>
																					<TooltipTrigger>
																						<Button
																							size="icon"
																							variant="destructive"
																							className="w-8 h-8"
																							onClick={() =>
																								declineRequest(record)
																							}
																						>
																							<X size={24} />
																						</Button>
																					</TooltipTrigger>
																				</Tooltip>
																				<Tooltip delayDuration={0}>
																					<TooltipContent>
																						<span>Accept</span>
																					</TooltipContent>
																					<TooltipTrigger>
																						<Button
																							size="icon"
																							className="w-8 h-8"
																							onClick={() => {
																								acceptRequest(record);
																							}}
																						>
																							<PlusIcon size={24} />
																						</Button>
																					</TooltipTrigger>
																				</Tooltip>
																			</div>
																		</div>
																	</>
																);
															})}
														</ScrollArea>
													</div>
												</>
											) : (
												<div className="flex flex-col items-center justify-center min-h-full gap-2 px-3 py-2 text-center">
													<UserSearchIcon size={32} />
													<p className="text-neutral-500 dark:text-neutral-400">
														Add some friends to start chatting with them!
													</p>
													<Button
														size="sm"
														className="mt-3"
														onClick={() => setFriendsOpen(true)}
													>
														Add Friend
													</Button>
												</div>
											)}
										</>
									)}
								</Suspense>
							</div>
							{/* Quick settings */}
							<section className="z-40 flex flex-col pl-1 border-t bg-neutral-100 dark:bg-neutral-900 border-black/10 dark:border-white/10">
								<QuickSettings />
							</section>
						</div>
					</div>
				</>
			)}
		</>
	);
}

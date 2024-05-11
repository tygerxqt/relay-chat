import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth";
import Spinner from "../spinner";
import User from "@/types/user";

export function AddFriends({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<User[]>([]);

	const { friends } = useAuth();

	async function fetchQuery() {
		setLoading(true);

		const res = await pb.collection<User>("users").getFullList({
			expand: "friends",
			filter: `username ~ "${query}"`,
		});

		console.log(res);

		const nextUsers = res
			// Remove the auth user
			.filter((user) => user.id !== pb.authStore.model?.id)
			// Exclude users who are already part of the state
			.filter((user) => !results.find((result) => result.id === user.id));

		setResults([...results, ...nextUsers]);
		setLoading(false);
	}

	// Fetch query every 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchQuery();
		}, 3000);

		return () => clearTimeout(timer);
	}, [query]);

	useEffect(() => {
		fetchQuery();
	}, []);

	const addFriend = (id: string) => {
		async function addFriend() {
			let currentFriends = pb.authStore.model?.friends;

			if (currentFriends && currentFriends.includes(id)) {
				throw new Error("You are already friends with this user.");
			}

			await pb.collection("users").update(pb.authStore.model?.id, {
				friends: [...currentFriends, id],
			});
		}

		toast.promise(addFriend(), {
			loading: "Adding friend...",
			success: `Success!`,
			error(error) {
				return error.message;
			},
		});
	};

	if (results.length >= 1) {
		results.map((result) => {
			// If user is friends with result

			if (
				typeof friends.find((friend) => friend.id === result.id) !==
					"undefined" &&
				typeof result.friends.find((id) => id === pb.authStore.model?.id) !==
					"undefined"
			) {
				console.log("Already Friends");
			} else if (
				typeof friends.find((friend) => friend.id === result.id) !==
					"undefined" &&
				typeof result.friends.find((id) => id === pb.authStore.model?.id) ===
					"undefined"
			) {
				console.log("Request Sent");
			} else if (
				typeof friends.find((friend) => friend.id === result.id) ===
					"undefined" &&
				typeof result.friends.find((id) => id === pb.authStore.model?.id) !==
					"undefined"
			) {
				console.log("Incoming");
			} else if (
				typeof friends.find((friend) => friend.id === result.id) ===
					"undefined" &&
				typeof result.friends.find((id) => id === pb.authStore.model?.id) ===
					"undefined"
			) {
				console.log("Not Friends");
			} else {
				console.log(
					"Auth is friends with result: ",
					friends.find((friend) => friend.id === result.id) ? true : false
				);

				// If result is friends with auth
				console.log(
					"Result is friends with auth: ",
					result.friends.find((id) => id === pb.authStore.model?.id)
						? true
						: false
				);
			}
		});
	}

	const isDesktop = useMediaQuery("(min-width: 768px)");

	const children = (
		<>
			<Command>
				<CommandInput
					placeholder="Search for a friend..."
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					<CommandGroup className="py-2">
						<div className="flex flex-row gap-2 items-center text-neutral-500 p-2 justify-between">
							<p className="text-sm">{results.length} results found</p>
							{loading && <Spinner size={16} />}
						</div>
						{results.length >= 1 &&
							results.map((result) => (
								<CommandItem
									id={result.id}
									className="flex flex-row items-center justify-between w-full gap-2 bg-transparent dark:bg-transparent"
									disabled={false}
								>
									{" "}
									<div className="flex flex-row items-center gap-2">
										<Avatar>
											<AvatarImage
												src={`https://db.relay.tygr.dev/api/files/_pb_users_auth_/${result.id}/${result.avatar}`}
												alt={result.username}
											/>
											<AvatarFallback>
												{result.username.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium text-md">
											{result.username}
										</span>
									</div>
									<div>
										{
											// Auth Added + User Added = Friends
											typeof friends.find(
												(friend) => friend.id === result.id
											) !== "undefined" &&
												typeof result.friends.find(
													(id) => id === pb.authStore.model?.id
												) !== "undefined" && (
													<>
														<Button
															size="sm"
															variant="outline"
															className="flex flex-row gap-2"
															disabled
														>
															<Plus size={16} />
															Already Friends
														</Button>
													</>
												)
										}

										{
											// Auth Added + User Not Added = Request Sent
											typeof friends.find(
												(friend) => friend.id === result.id
											) !== "undefined" &&
												typeof result.friends.find(
													(id) => id === pb.authStore.model?.id
												) === "undefined" && (
													<>
														<Button
															size="sm"
															variant="outline"
															className="flex flex-row gap-2"
															disabled
														>
															<Plus size={16} />
															Request Sent
														</Button>
													</>
												)
										}

										{
											// Auth not added + User added = Incoming
											typeof friends.find(
												(friend) => friend.id === result.id
											) === "undefined" &&
												typeof result.friends.find(
													(id) => id === pb.authStore.model?.id
												) !== "undefined" && (
													<>
														<Button
															size="sm"
															variant="outline"
															className="flex flex-row gap-2"
															onClick={() => addFriend(result.id)}
														>
															<Plus size={16} />
															Accept Request
														</Button>
													</>
												)
										}

										{
											// Auth not added + User not added = Add
											typeof friends.find(
												(friend) => friend.id === result.id
											) === "undefined" &&
												typeof result.friends.find(
													(id) => id === pb.authStore.model?.id
												) === "undefined" && (
													<>
														<Button
															size="sm"
															className="flex flex-row gap-2"
															onClick={() => addFriend(result.id)}
														>
															<Plus size={16} />
															Add
														</Button>
													</>
												)
										}
									</div>
								</CommandItem>
							))}
					</CommandGroup>
					<CommandEmpty className="py-6 text-sm text-center">
						No results found.
					</CommandEmpty>
				</CommandList>
			</Command>
		</>
	);

	if (isDesktop) {
		return (
			<>
				<CommandDialog open={open} onOpenChange={setOpen}>
					{children}
				</CommandDialog>
			</>
		);
	}

	return (
		<>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent handle={false}>{children}</DrawerContent>
			</Drawer>
		</>
	);
}

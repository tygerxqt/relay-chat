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
import { RecordModel } from "pocketbase";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth";
import Spinner from "../spinner";

export function AddFriends({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<RecordModel[]>([]);
	const { friends } = useAuth();

	useEffect(() => {
		async function fetchFriends() {
			setLoading(true);
			const res = await pb.collection("users").getFullList({
				filter: `username ~ "${query}"`,
			});

			const nextUsers = res
				.filter((user) => user.id !== pb.authStore.model?.id)
				.filter((user) => !results.find((result) => result.id === user.id));

			setResults([...results, ...nextUsers]);
			setLoading(false);
		}

		const timer = setTimeout(() => {
			fetchFriends();
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	const sendFriendRequest = (id: string) => {
		async function sendRequest() {
			let currentFriends = pb.authStore.model?.friends;

			await pb.collection("users").update(pb.authStore.model?.id, {
				friends: [...currentFriends, id],
			});
		}

		toast.promise(sendRequest(), {
			loading: "Adding friend...",
			success: "Success! Friend request sent.",
			error(error) {
				return error.message;
			},
		});
	};

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
						{results.map((result) => (
							<CommandItem
								id={result.id}
								className="flex flex-row items-center justify-between w-full gap-2 bg-transparent dark:bg-transparent"
								disabled={false}
							>
								<div className="flex flex-row items-center gap-2">
									<Avatar>
										<AvatarImage
											src={`${
												import.meta.env.VITE_AUTH_URL
											}/api/files/_pb_users_auth_/${result.id}/${
												result.avatar
											}`}
											alt={result.username}
										/>
										<AvatarFallback>
											{result.username.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="font-medium text-md">{result.username}</span>
								</div>
								<div>
									{friends.find((friend) => friend.id === result.id) ? (
										<Button
											size="sm"
											variant="outline"
											className="flex flex-row gap-2"
											disabled
										>
											<Plus size={16} />
											Already Friends
										</Button>
									) : (
										<Button
											size="sm"
											className="flex flex-row gap-2"
											onClick={() => sendFriendRequest(result.id)}
										>
											<Plus size={16} />
											Add
										</Button>
									)}
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

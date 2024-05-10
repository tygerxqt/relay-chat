import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { DirectMessage } from "@/types/message";
import { SendHorizontalIcon, UserMinusIcon } from "lucide-react";
import { makeLoader, useLoaderData } from "react-router-typesafe";
import { useEffect, useState } from "react";
import User from "@/types/user";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";
import Message from "@/components/chat/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecordSubscription } from "pocketbase";
import { useNavigate, useRevalidator } from "react-router-dom";
import Spinner from "@/components/spinner";

export default function DirectMessagePage() {
	const { recipient, friends, requestSent, requestRecieved } =
		useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const revalidator = useRevalidator();

	const [msg, setMsg] = useState("");
	const [msgs, setMsgs] = useState<DirectMessage[]>([]);

	const onMessageSubmit = async () => {
		if (!msg) {
			return;
		}

		await pb
			.collection<DirectMessage>("direct_messages")
			.create(
				{
					recipient: recipient.id,
					author: pb.authStore.model?.id,
					content: msg,
				},
				{ expand: "author, recipient" }
			)
			.then(() => {
				// setMsgs([...msgs, res]);
				setMsg("");
			})
			.catch((err) => {
				toast.error(err.message);
			});
	};

	const onFriendRemove = async () => {
		// Remove them from your friends list
		await pb.collection<User>("users").update(pb.authStore.model?.id, {
			friends: pb.authStore.model?.expand.friends?.filter(
				(f: any) => f.id !== recipient.id
			),
		});

		// Navigate home
		navigate("/");

		toast.success("Friend removed successfully");
	};

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

	useEffect(() => {
		pb.collection<DirectMessage>("direct_messages")
			.getFullList({
				filter: `(recipient.id = "${recipient.id}" || recipient.id = "${pb.authStore.model?.id}")`,
				expand: "author, recipient",
				sort: "+created",
			})
			.then((res) => {
				setMsgs(res);
				console.log("Messages: ", res);
			});

		pb.collection<DirectMessage>("direct_messages").subscribe(
			"*",
			(e: RecordSubscription<DirectMessage>) => {
				switch (e.action) {
					case "create": {
						if (
							[
								e.record.expand.author.id,
								e.record.expand.recipient.id,
							].includes(recipient.id || pb.authStore.model?.id)
						) {
							setMsgs((prev) => [...prev, e.record]);
						}
						break;
					}

					case "update": {
						// update the message in the list
						setMsgs((prev) =>
							prev.map((msg) => {
								if (msg.id === e.record.id) {
									return e.record;
								}

								return msg;
							})
						);
						break;
					}

					case "delete": {
						// remove the message from the list
						setMsgs((prev) => prev.filter((msg) => msg.id !== e.record.id));
						break;
					}
				}
			},
			{
				expand: "author, recipient",
			}
		);

		return () => {
			pb.collection("direct_messages").unsubscribe("*");
		};
	}, [recipient.id]);

	useEffect(() => {
		const handleKeyDown = async (e: KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				await onMessageSubmit();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [msg]);

	return (
		<>
			<main className="flex flex-col gap-2 min-h-screen h-screen w-full">
				<div className="w-full p-2 border-b border-black/10 dark:border-white/10">
					<div className="flex flex-row gap-2 items-center justify-between">
						{recipient && (
							<>
								<div className="flex flex-row gap-2 items-center">
									<img
										src={`${
											import.meta.env.VITE_AUTH_URL
										}/api/files/_pb_users_auth_/${recipient.id}/${
											recipient.avatar
										}`}
										alt={recipient.username}
										className="w-8 h-8 rounded-full"
									/>
									<span className="font-medium">{recipient.username}</span>
								</div>
								<div className="flex flex-row items-center">
									<Tooltip delayDuration={150}>
										<TooltipTrigger>
											<Button
												size="icon"
												variant="ghost"
												onClick={async () => await onFriendRemove()}
											>
												<UserMinusIcon size={24} />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Remove Friend</TooltipContent>
									</Tooltip>
								</div>
							</>
						)}
					</div>
				</div>
				{friends && (
					<>
						<ScrollArea className="h-full flex flex-col w-full grow">
							{msgs && msgs.length === 0 ? (
								<>
									<div className="h-full flex flex-col w-full grow">
										<div className="flex flex-col gap-3 justify-center items-center w-full min-h-full grow">
											<p className="font-medium">No messages yet.</p>
										</div>
									</div>
								</>
							) : (
								<>
									{msgs.map((msg) => {
										return <Message msg={msg} />;
									})}
								</>
							)}
						</ScrollArea>
						<div className="flex flex-row gap-2 p-2 border-t border-black/10 dark:border-white/10 w-full">
							<div className="flex flex-row items-center border rounded-md gap-2 w-full h-full">
								<input
									className="w-full max-h-32 bg-neutral-50 dark:bg-neutral-950 focus:outline-none text-pretty pl-2	"
									value={msg}
									onChange={(e) => setMsg(e.target.value)}
								/>
								<Tooltip delayDuration={300}>
									<TooltipTrigger>
										<Button
											variant="ghost"
											size="icon"
											onClick={async () => await onMessageSubmit()}
										>
											<SendHorizontalIcon size={18} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Send</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</>
				)}
				{requestSent && (
					<div className="h-full flex flex-col w-full grow">
						<div className="flex flex-col gap-3 justify-center items-center w-full min-h-full grow">
							<h1 className="text-3xl font-black">(｡•́︿•̀｡)</h1>
							<span className="text-medium">
								<b>{recipient.username}</b> hasn't accepted your friends request
								yet.
							</span>
							{revalidator.state === "loading" ? (
								<Spinner />
							) : (
								<Button size="sm" onClick={() => revalidator.revalidate()}>
									Refresh
								</Button>
							)}
						</div>
					</div>
				)}
				{requestRecieved && (
					<div className="h-full flex flex-col w-full grow">
						<div className="flex flex-col gap-3 justify-center items-center w-full min-h-full grow">
							<h1 className="text-3xl font-black">(°ロ°)</h1>
							<span className="text-medium">
								<b>{recipient.username}</b> has sent you a friend request.
							</span>
							{revalidator.state === "loading" ? (
								<Spinner />
							) : (
								<Button size="sm" onClick={() => addFriend(recipient.id)}>
									Accept
								</Button>
							)}
						</div>
					</div>
				)}
			</main>
		</>
	);
}

export const loader = makeLoader(async ({ params }) => {
	if (params.id === undefined) {
		throw new Error("Invalid user ID");
	}

	const user = await pb
		.collection<User>("users")
		.getOne(pb.authStore.model?.id, {
			expand: "friends",
		});

	const recipient = await pb.collection<User>("users").getOne(params.id, {
		expand: "friends",
	});

	if (
		typeof user.friends.find((friend) => friend === recipient.id) !==
			"undefined" &&
		typeof recipient.friends.find((id) => id === pb.authStore.model?.id) !==
			"undefined"
	) {
		return {
			recipient,
			friends: true,
			requestSent: false,
			requestRecieved: false,
		};
	} else if (
		typeof user.friends.find((friend) => friend === recipient.id) !==
			"undefined" &&
		typeof recipient.friends.find((id) => id === pb.authStore.model?.id) ===
			"undefined"
	) {
		// The recipient has not accepted your friend request yet
		return {
			recipient,
			friends: false,
			requestSent: true,
			requestRecieved: false,
		};
	} else if (
		typeof user.friends.find((friend) => friend === recipient.id) ===
			"undefined" &&
		typeof recipient.friends.find((id) => id === pb.authStore.model?.id) !==
			"undefined"
	) {
		// "You have not accepted the recipient's friend request yet."
		return {
			recipient,
			friends: false,
			requestSent: false,
			requestRecieved: true,
		};
	} else if (
		typeof user.friends.find((friend) => friend === recipient.id) ===
			"undefined" &&
		typeof recipient.friends.find((id) => id === pb.authStore.model?.id) ===
			"undefined"
	) {
		// "You are not friends with this user."
		return {
			recipient,
			friends: false,
			requestSent: false,
			requestRecieved: false,
		};
	} else {
		console.log(
			"Auth is friends with result: ",
			user.friends.find((friend) => friend === recipient.id) ? true : false
		);

		// If result is friends with auth
		console.log(
			"Result is friends with auth: ",
			recipient.friends.find((id) => id === pb.authStore.model?.id)
				? true
				: false
		);

		return {
			recipient,
			friends: false,
			requestSent: false,
			requestRecieved: false,
		};
	}
});

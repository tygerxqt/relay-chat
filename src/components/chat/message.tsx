import { DirectMessage } from "@/types/message";
import { formatRelative } from "date-fns";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import pb from "@/lib/pocketbase";

export default function Message({ msg }: { msg: DirectMessage }) {
	return (
		<>
			<div
				key={msg.id}
				className="flex flex-row gap-2 p-2 w-full group hover:bg-neutral-200/50 hover:dark:bg-neutral-800/50 transition-colors"
			>
				<div className="flex flex-row w-full gap-2 items-center">
					<img
						src={
							msg.expand.author.avatar.length <= 0
								? `https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${msg.expand.author.username}&radius=50`
								: `https://relay.pockethost.io/api/files/_pb_users_auth_/${msg.expand.author.id}/${msg.expand.author.avatar}`
						}
						alt={msg.expand.author.username}
						className="w-10 h-10 rounded-full"
					/>
					<div className="flex flex-col w-full gap-0">
						<div className="flex flex-row gap-2 items-center">
							<span className="font-medium">{msg.expand.author?.username}</span>
							<span className="text-neutral-500 text-xs dark:text-neutral-400">
								{formatRelative(new Date(msg.created), new Date())}
							</span>
						</div>
						<span className="text-wrap">{msg.content}</span>
					</div>
					{msg.author === pb.authStore.model?.id && (
						<div className="group-hover:block hidden">
							<Button
								variant="destructive"
								size="icon"
								onClick={async () => {
									console.log(msg.id);
									await pb
										.collection("direct_messages")
										.delete(msg.id)
										.catch((err) => {
											console.error(err);
										});
								}}
							>
								<Trash2 size={16} />
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
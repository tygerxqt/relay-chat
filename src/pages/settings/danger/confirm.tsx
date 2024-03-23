"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth";
import { MessageCircleWarning, TriangleAlert } from "lucide-react";

export function DeleteAccountConfirm({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, deleteAccount } = useAuth();

	const [open, setOpen] = React.useState(false);
	const [username, setUsername] = React.useState("");
	const [phrase, setPhrase] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [enabled, setEnabled] = React.useState(false);

	const toggleOpen = React.useCallback(() => {
		setOpen(!open);
		setUsername("");
		setPhrase("");
		setLoading(false);
		setEnabled(false);
	}, [open]);

	React.useEffect(() => {
		if (user) {
			if (username === user.username && phrase === "delete my account") {
				setEnabled(true);
			} else {
				setEnabled(false);
			}
		} else {
			toggleOpen();
		}
	}, [username, phrase, user, toggleOpen]);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<>
				{user && (
					<Dialog open={open} onOpenChange={toggleOpen}>
						<DialogTrigger asChild>{children}</DialogTrigger>
						<DialogContent className="p-0 sm:max-w-[425px]">
							<DialogHeader className="px-6 pt-6">
								<DialogTitle>Delete Account</DialogTitle>
								<DialogDescription>
									Relay will <b>permanently</b> delete all data associated with
									your account.
									<br /> <br />
									We recommend you export your data before deleting your
									account.
									<div className="flex flex-row items-center gap-2 p-2 mt-4 text-red-500 border border-red-500 rounded-md dark:border-red-700">
										<MessageCircleWarning className="w-4 h-4 text-red-500 dark:text-red-700" />
										<span>
											This action is <b>not</b> reversible.
										</span>
									</div>
								</DialogDescription>
							</DialogHeader>
							<div className="flex flex-col items-start gap-4 px-6 pb-6">
								<div className="flex flex-col w-full gap-1">
									<Label htmlFor="name" className="text-sm text-neutral-500">
										Enter your username <b>{user.username}</b> to continue:
									</Label>
									<Input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									/>
								</div>
								<div className="flex flex-col w-full gap-1">
									<Label htmlFor="name" className="text-sm text-neutral-500">
										To verify, type <b>delete my account</b> below:
									</Label>
									<Input
										value={phrase}
										onChange={(e) => setPhrase(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex flex-row justify-between w-full p-3 border-t bg-neutral-200 dark:bg-neutral-900">
								<Button variant="outline" onClick={toggleOpen}>
									Cancel
								</Button>
								<Button
									variant="destructive"
									disabled={!enabled}
									onClick={() => deleteAccount()}
								>
									Confirm Deletion
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</>
		);
	}

	return (
		<>
			{user && (
				<Drawer open={open} onOpenChange={setOpen} onClose={toggleOpen}>
					<DrawerTrigger asChild>{children}</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="p-6 text-left">
							<DrawerTitle>Delete Account</DrawerTitle>
							<DrawerDescription>
								Relay will <b>permanently</b> delete all data associated with
								your account.
								<br /> <br />
								We reccomend you export your data before deleting your account.
								<div className="flex flex-row items-center gap-2 p-2 my-4 text-red-500 border border-red-500 rounded-md dark:border-red-700">
									<TriangleAlert className="w-4 h-4 text-red-500 dark:text-red-700" />
									<span>
										This action is <b>not</b> reversible.
									</span>
								</div>
							</DrawerDescription>
							<div className="flex flex-col items-start gap-4">
								<div className="flex flex-col w-full gap-1">
									<Label className="text-sm text-neutral-500">
										Enter your username <b>{user.username}</b> to continue:
									</Label>
									<Input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									/>
								</div>
								<div className="flex flex-col w-full gap-1">
									<Label className="text-sm text-neutral-500">
										To verify, type <b>delete my account</b> below:
									</Label>
									<Input
										value={phrase}
										onChange={(e) => setPhrase(e.target.value)}
									/>
								</div>
							</div>
						</DrawerHeader>
						<DrawerFooter className="flex flex-row justify-between w-full p-3 border-t bg-neutral-200 dark:bg-neutral-900">
							<Button variant="outline" onClick={toggleOpen}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={() => deleteAccount()}
								disabled={!enabled}
							>
								Delete Account
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
}

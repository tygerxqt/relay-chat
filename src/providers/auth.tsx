import pb, { ClientError } from "@/lib/pocketbase";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";
import type User from "@/types/user";

export interface AuthSession {
	authStore: typeof pb.authStore;

	user: typeof pb.authStore.model;
	loggedIn: typeof pb.authStore.isValid;

	friends: Array<User>;
	friendRequests: Array<User>;

	avatar: string;
	isDefaultAvatar: boolean;
	banner: string;
	isDefaultBanner: boolean;

	logIn: (email: string, password: string) => Promise<boolean>;
	logOut: () => void;

	register: (
		name: string,
		username: string,
		email: string,
		password: string,
		passwordConfirm: string
	) => Promise<boolean>;
	resetPassword: (email: string) => Promise<void>;

	uploadAvatar: (file: File) => Promise<void>;
	removeAvatar: () => Promise<void>;

	uploadBanner: (file: File) => Promise<void>;
	removeBanner: () => Promise<void>;

	deleteAccount: () => Promise<void>;

	update: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthSession>({
	authStore: pb.authStore,

	user: pb.authStore.model,
	loggedIn: pb.authStore.isValid,

	friends: [],
	friendRequests: [],

	avatar: pb.authStore.model?.avatar
		? `${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
				pb.authStore.model.id
		  }/${pb.authStore.model.avatar}`
		: `https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${pb.authStore.model?.username}&radius=50`,

	isDefaultAvatar: pb.authStore.model?.avatar ? false : true,

	banner: pb.authStore.model?.banner
		? `${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
				pb.authStore.model.id
		  }/${pb.authStore.model.banner}`
		: `https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=50`,

	isDefaultBanner: pb.authStore.model?.banner ? false : true,

	logIn: async () => false,
	logOut: () => {},

	register: async () => false,
	resetPassword: async () => {},

	uploadAvatar: async () => {},
	removeAvatar: async () => {},

	uploadBanner: async () => {},
	removeBanner: async () => {},

	deleteAccount: async () => {},

	update: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = React.useState(false);
	const [friends, setFriends] = React.useState<Array<any>>([]);
	const [loggedIn, setLoggedIn] = React.useState(pb.authStore.isValid);
	const [user, setUser] = React.useState(pb.authStore.model);
	const [avatar, setAvatar] = React.useState(
		pb.authStore.model?.avatar
			? `${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
					pb.authStore.model.id
			  }/${pb.authStore.model.avatar}`
			: `https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${pb.authStore.model?.username}&radius=50`
	);
	const [isDefaultAvatar, setIsDefaultAvatar] = React.useState(
		pb.authStore.model?.avatar ? false : true
	);
	const [banner, setBanner] = React.useState(
		pb.authStore.model?.banner
			? `${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
					pb.authStore.model.id
			  }/${pb.authStore.model.banner}`
			: `https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=50`
	);
	const [isDefaultBanner, setIsDefaultBanner] = React.useState(
		pb.authStore.model?.banner ? false : true
	);

	const logIn = async (email: string, password: string) => {
		let res = false;
		await pb
			.collection("users")
			.authWithPassword(email, password, { expand: "friends" })
			.then((record) => {
				console.log(record.record.expand);
				setLoggedIn(true);
				setUser(pb.authStore.model);
				if (record.record.expand && record.record.expand.friends) {
					setFriends(record.record.expand.friends);
				}
				toast.success("Success!", {
					description: `Welcome back, ${record.record.username}`,
				});

				res = true;
			})
			.catch((err: ClientError) => {
				console.error(JSON.stringify(err, null, 2));
				let title = "Invalid ";
				if (err.response.message === "Failed to authenticate.")
					title += "credentials.";
				if (!err.response.data)
					return toast.error("An unexpected error occured!", {
						description: "Check the console for more details.",
					});
				if (
					err.response.data.identity &&
					err.response.data.identity.code === "validation_required"
				)
					title += "email";
				if (
					err.response.data.password &&
					err.response.data.password.code === "validation_required"
				)
					title.length <= 8
						? (title += "password.")
						: (title += " and password.");

				toast.error(title, {
					description: err.response.message,
				});

				res = false;
			});

		return res;
	};

	const logOut = (msg = true) => {
		setUser(null);
		setLoggedIn(false);
		setFriends([]);
		setAvatar("");
		setBanner("");
		setIsDefaultAvatar(false);
		setIsDefaultBanner(false);

		pb.authStore.clear();
		if (msg) toast.success("Logged out. See you soon!");
	};

	const register = async (
		name: string,
		username: string,
		email: string,
		password: string,
		passwordConfirm: string
	) => {
		let res = false;
		async function createUser() {
			if (!name || name.length < 2)
				return toast.error("Missing required field!", {
					description: "Please enter a valid name with at least 2 characters.",
				});
			if (!username || username.length < 2)
				return toast.error("Missing required field!", {
					description:
						"Please enter a valid username with at least 2 characters.",
				});
			if (!email || !email.includes("@"))
				return toast.error("Missing required field!", {
					description: "Please enter a valid email.",
				});
			if (!password || password.length < 8 || password.length > 72)
				return toast.error("Missing required field!", {
					description:
						"Please enter a valid password between 3 and 72 characters long.",
				});
			if (password !== passwordConfirm)
				return toast.error("Passwords mismatch!", {
					description: "The passwords do not match. Please try again.",
				});

			await pb
				.collection("users")
				.create({
					name,
					username,
					email,
					password,
					passwordConfirm,
				})
				.then(async () => {
					await pb.collection("users").requestVerification(email);
					toast.success("Success!", {
						description: "Please check your email for a verification link.",
					});
					res = true;
				})
				.catch((err: ClientError) => {
					if (err.response.data) {
						let e = Object.values(err.response.data)[0];

						toast.error("Something went wrong sending your request.", {
							description: e.message,
						});
					} else {
						toast.error("Something went wrong sending your request.", {
							description: "Check the console for more details.",
						});
					}

					res = false;
				});
		}

		await createUser();

		return res;
	};

	const resetPassword = async (email: string) => {
		toast.promise(pb.collection("users").requestPasswordReset(email), {
			loading: "Sending...",
			success: () => {
				return "If your email is registered, you should receive an email shortly.";
			},
			error: () => {
				return "An invalid email was provided. Please try again.";
			},
		});

		return;
	};

	async function uploadAvatar(file: File) {
		const formData = new FormData();
		formData.append("avatar", file);

		toast.promise(
			pb.collection("users").update(pb.authStore.model?.id as string, formData),
			{
				loading: "Uploading...",
				success: (data) => {
					setAvatar(
						`${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
							data.id
						}/${data.avatar}`
					);
					return "Successfully uploaded avatar.";
				},
				error: () => {
					return "Failed to upload your avatar.";
				},
			}
		);
	}

	async function removeAvatar() {
		toast.promise(
			pb
				.collection("users")
				.update(pb.authStore.model?.id as string, { avatar: null }),
			{
				loading: "Removing...",
				success: () => {
					setAvatar(
						`https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${pb.authStore.model?.username}&radius=50`
					);
					return "Successfully removed avatar.";
				},
				error: () => {
					return "Failed to reset your avatar.";
				},
			}
		);
	}

	async function uploadBanner(file: File) {
		const formData = new FormData();
		formData.append("banner", file);

		toast.promise(
			pb.collection("users").update(pb.authStore.model?.id as string, formData),
			{
				loading: "Uploading...",
				success: (data) => {
					setBanner(
						`${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
							data.id
						}/${data.banner}`
					);
					return "Successfully uploaded banner.";
				},
				error: () => {
					return "Failed to upload your banner.";
				},
			}
		);
	}

	async function removeBanner() {
		toast.promise(
			pb
				.collection("users")
				.update(pb.authStore.model?.id as string, { banner: null }),
			{
				loading: "Removing...",
				success: () => {
					setBanner(
						`https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=50`
					);
					return "Successfully removed banner.";
				},
				error: () => {
					return "Failed to reset your banner.";
				},
			}
		);
	}

	const deleteAccount = useCallback(async () => {
		toast.promise(
			pb.collection("users").delete(pb.authStore.model?.id as string),
			{
				loading: "Loading...",
				success: () => {
					logOut(false);
					return "Successfully deleted your account. So long, partner.";
				},
				error: () => {
					return "Something went wrong. Please contact support for assistance.";
				},
			}
		);
	}, []);

	const update = useCallback(async () => {
		await pb
			.collection("users")
			.authRefresh({ expand: "friends" })
			.then((response) => {
				console.log(response.record);
				setLoggedIn(true);
				setUser(response.record);
				setAvatar(
					response.record?.avatar
						? `${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
								response.record.id
						  }/${response.record.avatar}`
						: `https://api.dicebear.com/7.x/lorelei-neutral/png?seed=${pb.authStore.model?.username}&radius=50`
				);
				setIsDefaultAvatar(response.record?.avatar ? false : true);

				setBanner(
					pb.authStore.model?.banner
						? `${import.meta.env.VITE_AUTH_URL}/api/files/_pb_users_auth_/${
								pb.authStore.model.id
						  }/${pb.authStore.model.banner}`
						: `https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=80`
				);
				setIsDefaultBanner(response.record?.banner ? false : true);

				setFriends(response.record.expand?.friends || []);
			})
			.catch((err: ClientError) => {
				console.error(JSON.stringify(err, null, 2));
				if (err.status === 401) {
					logOut(false);
					toast.warning("Session expired!", {
						description: "Please log in again to continue.",
					});
				} else if (err.isAbort) {
					console.log("Aborted request.");
				} else if (err.status === 0) {
					toast.warning("Failed to connect to the database.", {
						description: "Some functionality may not work.",
						action: {
							label: "Retry",
							onClick: async () => await update(),
						},
						dismissible: true,
						duration: Infinity,
					});
				} else {
					toast.warning("Failed to update state.", {
						description: "You may need to log in again.",
					});
				}
			});
	}, [pb.authStore.isValid]);

	useEffect(() => {
		// Once we are in the client, we can allow the provider to render children
		setMounted(true);

		// Check if the user has a valid session
		if (pb.authStore.isValid) {
			// Get the updated state from the server and update the context
			update();

			// Subscribe to changes to the user's record
			pb.collection("users").subscribe(pb.authStore.model?.id, (res) => {
				switch (res.action.toLowerCase()) {
					case "update": {
						// Any updates to the record will be reflected in the context
						update();
						break;
					}
					case "delete": {
						// If the user's record is deleted, log them out and show a toast
						logOut(false);
						toast.warning("Your account has been deleted.");
						break;
					}
				}
			});
		} else {
			// If the user does not have a valid session, log them out and clear the local data
			logOut(false);
		}

		return () => {
			pb.collection("users").unsubscribe();
			setMounted(false);
		};

		// I want to run this effect when the isValid property changes, shut up eslint
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [update, pb.authStore.isValid]);

	const value = React.useMemo(
		() => ({
			authStore: pb.authStore,

			user,

			friends,

			avatar,
			isDefaultAvatar,
			banner,
			isDefaultBanner,
			loggedIn,

			logIn,
			logOut,

			register,
			resetPassword,
			deleteAccount,

			uploadAvatar,
			removeAvatar,

			uploadBanner,
			removeBanner,

			update,
		}),
		[
			avatar,
			banner,
			deleteAccount,
			isDefaultAvatar,
			isDefaultBanner,
			loggedIn,
			update,
			user,
			friends,
		]
	);

	return (
		<>
			<AuthContext.Provider value={value}>
				{mounted && children}
			</AuthContext.Provider>
		</>
	);
};

export const useAuth = () => {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};

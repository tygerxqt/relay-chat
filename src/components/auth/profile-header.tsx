import { useAuth } from "@/providers/auth";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Badges() {
	return <></>;
}

export default function ProfileHeader({
	children,
}: {
	children?: React.ReactNode;
}) {
	const { user, banner, avatar } = useAuth();

	return (
		<>
			{user && (
				<div className="flex flex-col items-start pb-8">
					<div className="flex flex-col w-full h-full gap-3">
						<AspectRatio ratio={3 / 1}>
							<img
								src={banner}
								width={1400}
								height={250}
								alt="banner"
								className="object-cover w-full h-full border rounded-md border-black/10 dark:border-white/10"
							/>
						</AspectRatio>
					</div>
					<div className="flex flex-row justify-between w-full">
						<div className="flex flex-col w-full h-20 px-2 text-xl font-semibold min-h-20 -translate-y-14 sm:-translate-y-10 sm:flex-row sm:px-4 md:-translate-y-14 md:px-6">
							<Avatar className="w-24 h-24 mb-2 border-2 border-black/10 dark:border-white/10 sm:h-28 sm:w-28 md:h-32 md:w-32">
								<AvatarImage
									src={avatar}
									aria-label="User Avatar"
									alt="Avatar"
								/>
								<AvatarFallback>
									{(user.username ?? "A").slice(0, 1).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-row items-center justify-between w-full sm:pl-4 sm:pt-20 md:pt-24">
								<span className="flex flex-col w-full font-semibold text-black dark:text-white">
									<span className="flex flex-row items-center gap-2">
										<p className="w-full text-2xl font-bold sm:text-xl md:text-2xl">
											{user.name}
										</p>
									</span>
									<span className="text-sm font-normal md:text-md text-neutral-500 sm:text-sm">
										@{user.username}
									</span>
								</span>
								<div className="flex flex-row items-center justify-end w-full gap-2 sm:hidden">
									{children}
								</div>
								<div className="flex flex-row items-start">
									<Badges />
								</div>
							</div>
						</div>
						<div className="flex flex-row items-start sm:hidden">
							<Badges />
						</div>
						<div className="flex-row items-center justify-end hidden w-full gap-2 py-4 sm:flex">
							{children}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

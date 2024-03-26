type User = {
	avatar: string;
	banner: string;
	collectionId: string;
	collectionName: string;
	created: string;
	emailVisibility: boolean;
	friends: Array<string>;
	id: string;
	name: string;
	updated: string;
	username: string;
	verified: boolean;
	expand: {
		friends: Array<User>;
		[key: string]: any;
	}
};

export default User;

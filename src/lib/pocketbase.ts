import PocketBase from "pocketbase";

export interface ClientError {
	url: string;
	status: number;
	response: {
		code: number;
		message: string;
		data: {
			[x: string]: {
				code: string;
				message: string;
			};
		};
	};
	isAbort: boolean;
	originalError: any;
	name: string;
}

const pb = new PocketBase('https://relay.pockethost.io');

export default pb;

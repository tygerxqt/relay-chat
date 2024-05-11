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

const pb = new PocketBase('https://db.relay.tygr.dev');

export default pb;

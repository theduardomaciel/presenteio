export interface EmailPayload {
	from: string;
	to: string;
	subject: string;
	html: string;
}

export interface EmailTransport {
	send(payload: EmailPayload): Promise<void>;
}

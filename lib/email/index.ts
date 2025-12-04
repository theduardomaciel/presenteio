import { GmailTransport } from "./gmail-transport";
import type { EmailTransport } from "./types";

let transport: EmailTransport;

/**
 * Choose which email backend to use here.
 * Later you can swap to Resend easily.
 */
export function getTransport(): EmailTransport {
	if (!transport) {
		transport = new GmailTransport(); // ← replace here later
	}
	return transport;
}

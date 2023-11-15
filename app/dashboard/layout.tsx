import { ToastProvider } from "components/_ui/Toast";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ToastProvider>{children}</ToastProvider>;
}

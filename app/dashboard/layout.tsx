import { ToastProvider } from "components/_ui/Toast";
import LandingFooter from "components/Landing/Footer/Footer";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ToastProvider>
			{children}
			<LandingFooter className="!px-dashboard-wrapper" />
		</ToastProvider>
	);
}

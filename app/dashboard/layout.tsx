import NextTopLoader from "nextjs-toploader";

// Components
import { ToastProvider } from "components/_ui/Toast";
import LandingFooter from "components/Landing/Footer/Footer";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ToastProvider>
			<NextTopLoader color="var(--primary-01)" showSpinner={false} />
			{children}
			<LandingFooter className="!px-dashboard-wrapper" />
		</ToastProvider>
	);
}

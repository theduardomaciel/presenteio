import AuthContext from "./components/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthContext>{children}</AuthContext>
    )
}

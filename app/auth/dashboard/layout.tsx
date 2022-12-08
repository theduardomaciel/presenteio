import './globals.css'

// Components
import DashboardHeader from './components/Header'

export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head />
            <body>
                <DashboardHeader />
                {children}
            </body>
        </html>
    )
}

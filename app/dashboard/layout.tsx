// Stylesheet
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
        </div>
    )
}

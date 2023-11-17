// Styling
import dashboardStyles from "../dashboard.module.css";
import styles from "./settings.module.css";

// Assets
import NameChangeIcon from "@/public/icons/badge.svg";
import PhotoChangeIcon from "@/public/icons/photo.svg";
import PasswordChangeIcon from "@/public/icons/password.svg";

// Components
import DashboardHeader from "@/dashboard/components/Header";
import CreateEventButton from "@/dashboard/components/CreateEventButton";
import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import ThemeSelector from "./subcomponents/ThemeSelector";
import LandingFooter from "components/Landing/Footer/Footer";
import Button from "components/_ui/Button";

const buttonStyles = "px-10 py-2 bg-primary-01 font-extrabold w-full lg:w-56";

export default async function Dashboard() {
	return (
		<>
			<div
				className={`${dashboardStyles.container} ${dashboardStyles.free}`}
			>
				<DashboardHeader profileChildren={<CreateEventButton />} />
				<div
					className={`${dashboardStyles.content}`}
					style={{ height: "fit-content" }}
				>
					<h2 className={dashboardStyles.title}>Configurações</h2>
					<DashboardSectionHeader title="Sua Conta" />
					<SettingsOption
						title="Alterar nome"
						description="Altere seu nome caso tenha cometido algum engano ao criar sua conta."
						children={
							<Button
								className={buttonStyles}
								disabled
								icon={<NameChangeIcon />}
							>
								Alterar nome
							</Button>
						}
					/>
					<SettingsOption
						title="Alterar imagem de perfil"
						description="Altere sua imagem de perfil e deixe ela com a sua cara."
						children={
							<Button
								className={buttonStyles}
								disabled
								icon={<PhotoChangeIcon />}
							>
								Alterar imagem
							</Button>
						}
					/>
					<SettingsOption
						title="Alterar senha"
						description="Altere sua senha para algo mais seguro e que você se lembre."
						children={
							<Button
								className={buttonStyles}
								disabled
								icon={<PasswordChangeIcon />}
							>
								Alterar senha
							</Button>
						}
					/>
					<DashboardSectionHeader title="Personalização" />
					<SettingsOption
						title="Tema"
						description="Modifique a aparência do site de acordo com suas
					preferências, permitindo a alternância entre um modo claro e
					um modo escuro, ou seguindo o esquema de cores padrão do seu
					dispositivo."
						children={<ThemeSelector />}
					/>
				</div>
			</div>
			<LandingFooter className="!px-dashboard-wrapper" />
		</>
	);
}

interface Props {
	title: string;
	description?: string;
	children?: React.ReactNode;
}

function SettingsOption({ title, description, children }: Props) {
	return (
		<div className={styles.option}>
			<header>
				<h3 className={styles.optionTitle}>{title}</h3>
				{description && <p>{description}</p>}
			</header>
			{children}
		</div>
	);
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useState } from "react";

import axios, { AxiosError, AxiosResponse } from "axios";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";

// Styling
import { cn } from "@/utils/ui";
import styles from "../auth.module.css";

// Components
import AuthModal, { Section } from "components/MultipleModal";
import GoogleButton from "../subcomponents/GoogleButton";
import Button from "components/_ui/Button";
import Input from "components/_ui/Input";

interface AccountData {
	email: string;
	password: string;
}

const ERRORS = {
	404: "E-mail ou senha incorretos.",
	400: "Ocorreu um problema por nossa parte. Tente novamente mais tarde.",
	500: "Erro interno do servidor.",
};

export default function Login() {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [actualSection, direction] = ["login", 1];
	const [error, setError] = useState<number | null>(null);

	const resetError = useCallback(() => setError(null), []);

	const Section0 = {
		title: "Log in",
		hideVisibility: {
			background: true,
		},
		description:
			"Faça o login em sua conta para administrar os seus eventos.",
		children: (
			<form onSubmit={handleFormSubmit} className={styles.section1}>
				<GoogleButton
					onClick={() => login()}
					isLoading={isLoading === true}
				/>
				<div className={styles.outro}>
					<div className={styles.divisor} />
					<p>ou</p>
					<div className={styles.divisor} />
				</div>
				<Input
					label="E-mail"
					name="email"
					type={"email"}
					onChange={resetError}
					required
				/>
				<Input
					errorMessage={
						typeof isLoading === "string" ? isLoading : undefined
					}
					label="Senha"
					name="password"
					id="passwordInput"
					type={"password"}
					onChange={resetError}
					required
				/>
				<Button
					isLoading={isLoading === true}
					style={{ width: "100%", paddingBlock: "1rem" }}
				>
					Logar
				</Button>
				{error && (
					<p className="text-primary-01 text-sm text-center font-serif">
						{ERRORS[error as keyof typeof ERRORS]}
					</p>
				)}
			</form>
		),
		footer: (
			<div
				className="modalFooter"
				aria-disabled={isLoading}
				style={{
					pointerEvents: isLoading ? "none" : "auto",
					cursor: isLoading ? "not-allowed" : "pointer",
				}}
			>
				<p>
					Não tem uma conta?{" "}
					<Link
						href={`/register`}
						style={{
							fontWeight: "bold",
						}}
					>
						Criar uma conta
					</Link>
				</p>
			</div>
		),
	} as Section;

	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			setIsLoading(true);
			onLogin(undefined, tokenResponse);
		},
		onError: (errorResponse) => console.log(errorResponse.error),
	});

	async function onLogin(
		accountData?: AccountData,
		tokenResponse?: TokenResponse
	) {
		try {
			const response = await axios.post("/api/auth/login", {
				access_token: tokenResponse?.access_token,
				email: accountData?.email,
				password: accountData?.password,
			});

			console.log(response.data);
			//router.refresh(); // o refresh é necessário para que os cookies sejam atualizados

			router.push(`/dashboard`);
		} catch (error: any) {
			console.log(error);

			setError(error.response.status as number);
			setIsLoading(false);
		}
	}

	async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // evitar que a página seja recarregada
		setIsLoading(true);

		const formData = new FormData(event.currentTarget);
		const accountData = Object.fromEntries(
			formData.entries()
		) as unknown as AccountData;

		await onLogin(accountData);
	}

	return (
		<Fragment>
			<div
				className={cn(
					"fixed top-0 left-0 w-screen h-screen bg-[radial-gradient(50%_50%_at_50%_50%,#FFF_0%,#FFCACA_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,#1E1E1E_0%,#050505_100%)] -z-10"
					/* {
						"animate-fadeIn": isAnimated,
					} */
				)}
			/>
			<AuthModal
				//initial={isAnimated ? true : false}
				initial={false}
				sections={{ login: Section0 }}
				actualSection={actualSection}
				direction={direction}
			/>
		</Fragment>
	);
}

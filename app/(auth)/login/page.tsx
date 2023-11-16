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
import GoogleButton from "../subcomponents/google/GoogleButton";
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
			<form onSubmit={handleSubmit} className={styles.section1}>
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
			<div className="modalFooter">
				<p>
					Não tem uma conta?{" "}
					<Link href={`/register`} style={{ fontWeight: "bold" }}>
						Criar uma conta
					</Link>
				</p>
			</div>
		),
	} as Section;

	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			setIsLoading(true);
			getAccountFromGoogle(tokenResponse);
		},
		onError: (errorResponse) => console.log(errorResponse.error),
	});

	async function getAccountFromGoogle(tokenResponse: TokenResponse) {
		try {
			const response = await axios.post("/api/auth/login", {
				access_token: tokenResponse.access_token,
			});

			console.log(response);

			if (response.status === 200) {
				router.push(`/dashboard`);
			} else {
				setError(500);
				setIsLoading(false);
			}
		} catch (error: any) {
			console.log(error);

			setError(error.response.status as number);
			setIsLoading(false);
		}
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault(); // evitar que a página seja recarregada
		setIsLoading(true);
		console.log("Checando credenciais...");

		const formData = new FormData(event.currentTarget);
		const accountData = Object.fromEntries(
			formData.entries()
		) as unknown as AccountData;
		const { email, password } = accountData;

		try {
			const response = await axios.post("/api/auth/login", {
				email: email,
				password: password,
			});

			if (response.status === 200) {
				router.push(`/dashboard`);
			} else {
				setError(500);
				setIsLoading(false);
			}
		} catch (error: any) {
			console.log(error);

			setIsLoading(false);
			setError(error.response.status as number);
		}
	}

	return (
		<Fragment>
			<div
				className={cn(
					"fixed top-0 left-0 w-screen h-screen bg-[radial-gradient(50%_50%_at_50%_50%,#FFF_0%,#FFCACA_100%)] -z-10"
					/* {
						"animate-fadeIn": isAnimated,
					} */
				)}
			/>
			<AuthModal
				//initial={isAnimated ? true : false}
				sections={{ login: Section0 }}
				actualSection={actualSection}
				direction={direction}
			/>
		</Fragment>
	);
}

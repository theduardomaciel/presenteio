"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import DiceIcon from "@/public/icons/dice1.svg";
import ResetIcon from "@/public/icons/restart.svg";

// Components
import Input from "components/_ui/Input";
import Button from "components/_ui/Button";
import ShuffleConfig from "./Config";

// Utils
import { generateRandomNumbers } from "utils/random";

const MIN_NUMBERS_AMOUNT = 1;
const MIN_FROM = 0;

const MAX_NUMBERS_AMOUNT = 100;
const MAX_FROM = 10000;
const MAX_TO = 100000;

const variants = {
	enter: (direction: number) => {
		return {
			x: direction > 0 ? "100%" : "-100%",
			opacity: 0,
		};
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => {
		return {
			zIndex: 0,
			x: direction < 0 ? "100%" : "-100%",
			opacity: 0,
		};
	},
};

const transition = {
	/* x: { type: "spring", stiffness: 300, damping: 30 }, */
	x: { type: "spring", bounce: 0, duration: 0.35 },
	opacity: { duration: 0.35 },
};

export default function Form() {
	const [[result, direction], setResult] = useState<
		[number[] | undefined, number]
	>([undefined, 1]);

	const [config, setConfig] = useState({
		allowRepeatedResults: true,
		revealOnClick: false,
	});

	const onShuffle = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);

		let numbersAmount = +data.get("numbersAmount")!;
		let from = +data.get("from")!;
		let to = +data.get("to")!;

		const shuffleConfig = JSON.parse(
			window.sessionStorage.getItem("shuffle_config") || "{}"
		);

		if (!numbersAmount) {
			numbersAmount = shuffleConfig.numbersAmount || MIN_NUMBERS_AMOUNT;
		}

		if (!from) {
			from = shuffleConfig.from || MIN_FROM;
		}

		if (!to) {
			to = shuffleConfig.to || MAX_TO;
		}

		window.sessionStorage.setItem(
			"shuffle_config",
			JSON.stringify({
				numbersAmount,
				from,
				to,
			})
		);

		try {
			const randomNumbers = generateRandomNumbers(
				numbersAmount,
				from,
				to,
				config.allowRepeatedResults
			);
			setResult([randomNumbers, 1]);
		} catch (error: any) {
			console.log(error.message);
			alert(error.message);
		}
	};

	return (
		<form
			onSubmit={onShuffle}
			className="flex flex-col w-full items-center justify-center gap-[2.6rem]"
		>
			<AnimatePresence
				initial={false}
				custom={direction}
				mode="popLayout"
			>
				{result ? (
					<motion.div
						key={"result_section"}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={transition}
					>
						<ResultSection
							key={"result_section"}
							result={result}
							revealOnClick={config.revealOnClick}
							onReset={() => {
								const root = document.getElementById(
									"root"
								) as HTMLElement;

								if (root) {
									root.scrollTo({
										top: 0,
										behavior: "smooth",
									});
								}

								setResult([undefined, -direction]);
							}}
						/>
					</motion.div>
				) : (
					<motion.div
						key={"input_section"}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={transition}
					>
						<InputSection key={"input_section"} />
					</motion.div>
				)}
			</AnimatePresence>
			<motion.div layout>
				<ShuffleConfig config={config} setConfig={setConfig} />
			</motion.div>
		</form>
	);
}

function InputSection() {
	const [numbersAmount, setNumbersAmount] = useState<string>("1");
	const [from, setFrom] = useState<string>("1");
	const [to, setTo] = useState<string>("10");

	return (
		<div className="flex w-screen flex-col items-center justify-center gap-[2.6rem]">
			<div className="flex flex-col items-center justify-center">
				<h2 className="text-center text-primary-02 text-2xl font-normal font-serif">
					Offline, simples e prático.
				</h2>
				<h1 className="text-center text-primary-01 text-[92px] font-bold font-title leading-snug">
					Sorteador
				</h1>
			</div>
			<div className="flex flex-row items-center justify-center gap-[2.6rem]">
				<Input
					label="Quantidade de números"
					type="number"
					name="numbersAmount"
					id="numbersAmount"
					value={numbersAmount}
					onChange={(event) =>
						setNumbersAmount(
							+event.target.value > MAX_NUMBERS_AMOUNT
								? MAX_NUMBERS_AMOUNT.toString()
								: Number(event.target.value).toString()
						)
					}
					onBlur={() => {
						if (+numbersAmount < MIN_NUMBERS_AMOUNT) {
							setNumbersAmount(MIN_NUMBERS_AMOUNT.toString());
						}
					}}
					placeholder={MIN_NUMBERS_AMOUNT.toString()}
					style={{
						borderColor: "var(--font-light)",
						textAlign: "center",
					}}
				/>
				<Input
					label="De"
					type="number"
					name="from"
					id="from"
					value={from}
					onChange={(event) =>
						setFrom(
							+event.target.value > MAX_FROM
								? MAX_FROM.toString()
								: Number(event.target.value).toString()
						)
					}
					onBlur={() => {
						if (+from < MIN_FROM) {
							setFrom(MIN_FROM.toString());
						}
					}}
					placeholder={MIN_FROM.toString()}
					style={{
						borderColor: "var(--font-light)",
						textAlign: "center",
					}}
				/>
				<Input
					label="Até"
					type="number"
					name="to"
					id="to"
					value={to}
					onChange={(event) =>
						setTo(
							+event.target.value > MAX_TO
								? MAX_TO.toString()
								: Number(event.target.value).toString()
						)
					}
					onBlur={() => {
						if (+to < +from) {
							setTo(from);
						}
					}}
					placeholder={from}
					style={{
						borderColor: "var(--font-light)",
						textAlign: "center",
					}}
				/>
			</div>
			<h3 className="text-primary-01 font-title text-lg font-bold">
				Você irá sortear {numbersAmount || MIN_NUMBERS_AMOUNT} número
				{numbersAmount !== "1" && numbersAmount !== ""
					? "s"
					: ""} entre {from || MIN_FROM} e {to}
			</h3>
			<Button className="font-bold text-lg" type="submit">
				Sortear
				<DiceIcon />
			</Button>
		</div>
	);
}

interface ResultSectionProps {
	revealOnClick?: boolean;
	result: number[];
	onReset: () => void;
}

function ResultSection({ result, revealOnClick, onReset }: ResultSectionProps) {
	return (
		<div className="flex flex-col w-screen items-center justify-center gap-14">
			<h2 className="text-center text-primary-01 text-5xl font-bold font-title">
				Resultado do Sorteio
			</h2>
			<ul className="flex flex-row items-center justify-center flex-wrap gap-9 px-wrapper">
				{result.map((number, index) => (
					<ResultNumber key={index} index={index} number={number} />
				))}
			</ul>
			<div className="flex flex-row items-center justify-center text-white gap-6">
				<Button
					className="font-bold text-lg py-2"
					onClick={onReset}
					type="button"
				>
					Reiniciar
					<ResetIcon width={24} height={24} />
				</Button>
				<Button className="font-bold text-lg py-2" type="submit">
					Sortear novamente
					<DiceIcon />
				</Button>
			</div>
		</div>
	);
}

interface ResultNumberProps {
	index: number;
	number: number;
	onClick?: () => void;
}

function ResultNumber({ index, number, onClick }: ResultNumberProps) {
	const revealNumber = () => {
		onClick && onClick();
	};

	return (
		<li className="w-24 h-24 bg-primary-01 rounded-full flex-col justify-center items-center inline-flex">
			<button
				type="button"
				className="flex w-full h-full items-center justify-center p-2.5 rounded-full focus:outline outline-[3.5px] outline-offset-4 outline-font-dark"
				onClick={revealNumber}
			>
				<p
					className="text-white text-5xl font-bold font-title leading-none align-middle"
					style={{
						fontSize: `${Math.min(
							(10 / number.toString().length) * 1.5,
							5
						)}rem`,
					}}
				>
					{onClick ? "?" : number}
				</p>
			</button>
		</li>
	);
}

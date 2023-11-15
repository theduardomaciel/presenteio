"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import axios from "axios";

// Styling
import styles from "./eventEdit.module.css";

// Icons
import EditIcon from "@/public/icons/edit.svg";
import SaveIcon from "@/public/icons/save.svg";

// Components
import DashboardToast, { ToastDynamicProps } from "components/_ui/Toast";
import Spinner from "components/_ui/Spinner";

// Types
import type { Event } from "@prisma/client";

interface Props {
	event?: Omit<Event, "createdAt">;
}

export default function EventNameEdit({ event }: Props) {
	const [state, setState] = useState<"default" | "rename">("default");

	const DEFAULT_VALUE = event ? event.name : "Novo Evento";
	const [eventName, setEventName] = useState(DEFAULT_VALUE);

	function onFocus(event: React.FocusEvent<HTMLInputElement>) {
		setState("rename");
		event.target.select();
	}

	function onBlur(event: React.FocusEvent<HTMLInputElement>) {
		setState("default");
		if (event.target.value.length === 0) {
			setEventName(DEFAULT_VALUE);
		}
	}

	const [[isToastVisible, toastProps], setToastVisible] =
		useState<ToastDynamicProps>([false]);
	const [isLoading, setLoading] = useState(false);

	const router = useRouter();

	async function updateName() {
		if (event) {
			setLoading(true);
			try {
				await axios.patch(`/api/events/${event.id}`, {
					name: eventName,
				});

				setToastVisible([
					true,
					{
						title: "Tudo certo!",
						description:
							"O nome do evento foi alterado com sucesso.",
						icon: (
							<EditIcon width={22} fill={`var(--primary-02)`} />
						),
						status: "success",
					},
				]);

				router.refresh();
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.log(error);

				setToastVisible([
					true,
					{
						title: "Algo deu errado...",
						description:
							"Não foi possível alterar o nome do evento :(",
						icon: (
							<EditIcon width={22} fill={`var(--primary-02)`} />
						),
						status: "error",
					},
				]);
			}
		}
	}

	return (
		<div className={`${styles.container} ${styles[state]}`}>
			<p>Amigo Secreto</p>
			<p>/</p>

			<input
				type="text"
				name="eventName"
				className={styles.eventNameInput}
				onFocus={onFocus}
				onBlur={onBlur}
				maxLength={30}
				style={{
					width: (eventName.length + 1) * 16 + "px",
				}}
				value={eventName}
				onChange={(event) => {
					setEventName(event.target.value);

					const newSize = event.currentTarget.scrollWidth + 2;
					/* console.log(
						event.target.value.length * 16,
						(newSize / 3) * 2
					); */

					if (event.target.value.length * 16 < (newSize / 3) * 2) {
						event.currentTarget.style.width = `${
							event.target.value.length + 1
						}ch`;
					} else {
						event.currentTarget.style.width = newSize + "px";
					}
				}}
				onKeyDown={(event) => {
					if (
						event.key === "Enter" ||
						event.key === "Tab" ||
						event.key === "Escape"
					) {
						event.currentTarget.blur();
					}
				}}
				minLength={1}
			/>

			{event &&
				event.name !== eventName &&
				(isLoading ? (
					<Spinner />
				) : (
					<SaveIcon
						color="var(--primary-01)"
						className="icon click"
						onClick={updateName}
					/>
				))}

			<DashboardToast
				toastProps={toastProps}
				isOpened={isToastVisible}
				setDynamicOpened={setToastVisible}
			/>
		</div>
	);
}

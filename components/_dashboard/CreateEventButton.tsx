"use client";
import Link from "next/link";

import AddIcon from "@/public/icons/add.svg";
import Button from "components/_ui/Button";

const CreateEventButton = () => (
	<Link href={`/dashboard/compose`}>
		<Button
			style={{ padding: `0.65rem 3rem`, height: "100%", fontWeight: 700 }}
		>
			<AddIcon width={24} height={24} />
			Criar Evento
		</Button>
	</Link>
);

export default CreateEventButton;

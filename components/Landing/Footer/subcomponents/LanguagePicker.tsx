"use client";
import { useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectGroup,
	SelectTrigger,
	SelectValue,
} from "components/_ui/Select";

export default function LanguagePicker() {
	return (
		<Select defaultValue="pt-BR" disabled>
			<SelectTrigger className="border-0">
				<SelectValue placeholder="Idioma" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Idioma</SelectLabel>
					<SelectItem value="pt-BR">Português (Brasil)</SelectItem>
					<SelectItem value="en">Inglês</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

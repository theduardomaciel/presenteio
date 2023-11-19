"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "components/_ui/Accordion";
import Checkbox from "components/_ui/Checkbox";

const LABEL_CLASS_NAME = "font-serif text-base font-bold text-primary-01";

interface Props {
	config: {
		revealOnClick: boolean;
		allowRepeatedResults: boolean;
	};
	setConfig: (config: Props["config"]) => void;
}

export default function ShuffleConfig({ config, setConfig }: Props) {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="config" className="border-b-transparent">
				<AccordionTrigger className="flex flex-row items-center justify-center text-primary-01 text-sm font-bold font-title gap-4 p-1">
					Configurações do sorteio
				</AccordionTrigger>
				<AccordionContent className="flex flex-col items-center justify-start p-1 mt-4 gap-4">
					{/* <Checkbox
						labelClassName={LABEL_CLASS_NAME}
						checked={config.revealOnClick}
						onCheckedChange={(checked) =>
							setConfig({
								...config,
								revealOnClick:
									checked === "indeterminate"
										? false
										: checked,
							})
						}
						label="Mostrar resultado somente após um clique"
					/> */}
					<Checkbox
						defaultChecked={true}
						labelClassName={LABEL_CLASS_NAME}
						checked={config.allowRepeatedResults}
						onCheckedChange={(checked) =>
							setConfig({
								...config,
								allowRepeatedResults:
									checked === "indeterminate"
										? false
										: checked,
							})
						}
						label="Permitir resultados repetidos"
					/>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

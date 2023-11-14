import Link from "next/link";

// Styling
import { cn } from "@/utils/ui";

// Icons
import Arrow_right_alt from "@/public/icons/arrow_right_alt.svg";

// Components
import { Section2Title } from "./Section2";

export default function LandingSection2_1() {
	return (
		<section
			id="faq"
			className="flex flex-col items-center justify-start gap-14 w-full px-wrapper"
		>
			<Section2Title className="mt-10">
				Perguntas Frequentes
			</Section2Title>

			<div className="flex flex-col items-center justify-start w-full gap-3">
				<table className="text-primary-01 w-full rounded-lg">
					<tbody className="grid grid-cols-2 grid-rows-2">
						<Question
							title="As ferramentas do presenteio serão gratuitas para sempre?"
							description={`Sim! O código de nossas aplicações é aberto e está disponível para todos os usuários verem e verificarem cada linha escrita por nós!\n
Para saber mais sobre o código e por que mantemos nossa abordagem, você pode ler nosso artigo sobre nossa política de código open-source.`}
							link={{
								href: "https://github.com/theduardomaciel/presenteio",
								text: "Acesse o repositório do projeto no Github",
							}}
							className="rounded-tl-lg"
						/>
						<Question
							title="Qual o algoritmo utilizado para realizar os sorteios?"
							description={`Utilizamos a linguagem de programação JavaScript para lidar com a realização de sorteios diretamente pelo seu navegador.\n
                        Nossos cálculos são 100% imparciais e os dados dos sorteios/eventos realizados no presenteio não passam em nossas mãos.\n
                        Caso ainda possua alguma dúvida, visite o código-fonte de nossas aplicações.`}
							className="rounded-tr-lg border-l-0"
						/>
						<Question
							title="Para que é necessário uma conta para criar eventos?"
							description={`A criação de eventos envolve funcionalidades que requerem o armazenamento de dados à longo prazo, visto que eventos podem durar diversos dias.\n
                        Todos os dados armazenados enquanto um evento está ativo são removidos de nosso banco de dados instantaneamente quando um evento termina ou é apagado.`}
							className="rounded-bl-lg border-t-0"
						/>
						<Question
							title="Posso realizar apostas com as ferramentas do presenteio?"
							description={`Não endossamos ou apoiamos práticas nocivas aos nossos usuários, portanto, legalmente, nenhum indivíduo civil ou jurídico deve utilizar nossos serviços para esses fins.\n
                        A fim de respeitar a privacidade dos usuários, não monitoramos para que tipo de fins nossos serviços são utilizados, no entanto, pedimos bom senso.`}
							className="rounded-br-lg border-l-0 border-t-0"
						/>
					</tbody>
				</table>
				<Link
					href={`/help`}
					className="flex items-center justify-center w-full bg-primary-01 text-white font-title font-bold p-3 rounded-bl-lg rounded-br-lg text-lg hover:bg-primary-02 transition-colors duration-300"
				>
					Ver mais perguntas
					<Arrow_right_alt
						width={`2.4rem`}
						height={`2.4rem`}
						fill={`white`}
						className="ml-2"
					/>
				</Link>
			</div>
		</section>
	);
}

interface QuestionProps {
	title: string;
	description: string;
	link?: {
		href: string;
		text: string;
	};
	className?: string;
}

function Question({ title, description, className, link }: QuestionProps) {
	return (
		<tr className={cn("border-2 border-primary-01 p-6", className)}>
			<td className="flex flex-col items-start justify-start gap-3">
				<h3 className="text-font-dark text-lg font-bold font-title">
					{title}
				</h3>
				<p className="text-font-light-02 text-base font-serif whitespace-pre-line leading-snug">
					{description}
				</p>
				{link && (
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary-01 text-base font-serif font-bold hover:underline"
					>
						{link.text}
					</a>
				)}
			</td>
		</tr>
	);
}

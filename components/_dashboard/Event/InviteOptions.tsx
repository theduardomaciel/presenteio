// Assets
import ImageOnIcon from "@/public/icons/invite/image_on.svg";
import ImageOffIcon from "@/public/icons/invite/image_off.svg";

import EmailOnIcon from "@/public/icons/invite/email_on.svg";
import EmailOffIcon from "@/public/icons/invite/email_off.svg";

// Components
import Checkbox from "components/_ui/Checkbox";
import {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "components/_ui/Tooltip";

interface Props {
	defaultValues?: {
		allowInvite?: boolean;
		allowRevealFromPage?: boolean;
		allowProfileChange?: boolean;
		allowEmailChange?: boolean;
	};
}

export default function EventInviteOptions({ defaultValues }: Props) {
	return (
		<>
			<Checkbox
				defaultChecked={defaultValues?.allowInvite || true}
				name="allowInvite"
				label="Permitir que outros usuários participem do evento por meio de convite"
			/>
			<Checkbox
				defaultChecked={defaultValues?.allowProfileChange}
				name="allowRevealFromPage"
				label="Permitir que os convidados possam visualizar seus sorteados por meio da página de convite"
			/>
			<div className="flex flex-row items-start justify-start w-full">
				<p className={"option text-primary-02"}>
					Permitir que os convidados possam alterar:
				</p>
				<div className="flex flex-row items-center justify-end gap-4">
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<span tabIndex={0}>
									<ToggleProperty
										name="allowProfileChange"
										defaultChecked={
											defaultValues?.allowProfileChange
										}
										enabledIcon={ImageOnIcon}
										disabledIcon={ImageOffIcon}
									/>
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Foto de perfil</p>
								<TooltipArrow />
							</TooltipContent>
						</Tooltip>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<span tabIndex={0}>
									<ToggleProperty
										name="allowEmailChange"
										defaultChecked={
											defaultValues?.allowEmailChange
										}
										enabledIcon={EmailOnIcon}
										disabledIcon={EmailOffIcon}
									/>
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>E-mail</p>
								<TooltipArrow />
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</>
	);
}

interface TogglePropertyProps {
	name: string;
	enabledIcon: React.FC<React.SVGProps<SVGSVGElement>>;
	disabledIcon: React.FC<React.SVGProps<SVGSVGElement>>;
	defaultChecked?: boolean;
}

function ToggleProperty({
	name,
	enabledIcon: EnabledIcon,
	disabledIcon: DisabledIcon,
}: TogglePropertyProps) {
	return (
		<label
			className="flex items-center justify-center gap-4 text-primary-02 cursor-pointer"
			htmlFor={name}
		>
			<input
				id={name}
				name={name}
				type="checkbox"
				className="hidden peer"
			/>
			<EnabledIcon
				width={24}
				height={24}
				className="hidden peer-checked:flex"
			/>
			<DisabledIcon
				width={24}
				height={24}
				className="flex peer-checked:hidden"
			/>
		</label>
	);
}

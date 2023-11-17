// Assets
import ImageOnIcon from "@/public/icons/invite/image_on.svg";
import ImageOffIcon from "@/public/icons/invite/image_off.svg";

import EmailOnIcon from "@/public/icons/invite/email_on.svg";
import EmailOffIcon from "@/public/icons/invite/email_off.svg";

import InfoIcon from "@/public/icons/info.svg";

// Components
import Checkbox from "components/_ui/Checkbox";
import {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "components/_ui/Tooltip";
import React from "react";

interface Props {
	hasEventBeenDivulged?: boolean;
	hasGuestsWithoutEmail?: boolean;
	defaultValues?: {
		allowInvite?: boolean;
		allowRevealFromPage?: boolean;
		allowProfileChange?: boolean;
		allowEmailChange?: boolean;
	};
}

export default function EventInviteOptions({
	hasEventBeenDivulged = false,
	hasGuestsWithoutEmail = false,
	defaultValues,
}: Props) {
	//console.log(defaultValues);
	return (
		<TooltipProvider>
			{!hasEventBeenDivulged && (
				<Checkbox
					defaultChecked={
						defaultValues?.allowInvite !== undefined
							? defaultValues.allowInvite
							: true
					}
					name="allowInvite"
					label="Permitir que outros usuários participem do evento por meio de convite"
				/>
			)}
			<Checkbox
				defaultChecked={defaultValues?.allowRevealFromPage}
				name="allowRevealFromPage"
				label="Permitir que os convidados visualizem seus sorteados por meio de seus convites"
			>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						{hasGuestsWithoutEmail && (
							<span tabIndex={0}>
								<InfoIcon
									width={18}
									height={18}
									color="var(--primary-03)"
								/>
							</span>
						)}
					</TooltipTrigger>
					<TooltipContent>
						<p>
							Os convidados que não inseriram seus e-mails ainda
							poderão visualizar seus sorteados por meio de seus
							convites.
						</p>
						<TooltipArrow />
					</TooltipContent>
				</Tooltip>
			</Checkbox>
			{!hasEventBeenDivulged && (
				<div className="flex flex-row items-center justify-center w-full">
					<p className={"option text-primary-02"}>
						Permitir que os convidados possam alterar:
					</p>
					<div className="flex flex-row items-center justify-end gap-4">
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<span tabIndex={0}>
									<ToggleProperty
										name="allowProfileChange"
										defaultChecked={
											defaultValues?.allowProfileChange !==
											undefined
												? defaultValues.allowProfileChange
												: true
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
											defaultValues?.allowEmailChange !==
											undefined
												? defaultValues.allowEmailChange
												: true
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
					</div>
				</div>
			)}
		</TooltipProvider>
	);
}

interface TogglePropertyProps extends React.HTMLProps<HTMLInputElement> {
	name: string;
	enabledIcon: React.FC<React.SVGProps<SVGSVGElement>>;
	disabledIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

function ToggleProperty({
	name,
	enabledIcon: EnabledIcon,
	disabledIcon: DisabledIcon,
	...rest
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
				{...rest}
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

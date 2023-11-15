"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "utils/ui";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;

interface SelectTriggerProps
	extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
	icon?: React.ReactNode;
	hideChevron?: boolean;
}

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	SelectTriggerProps
>(({ className, children, hideChevron, icon, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"flex h-10 items-center justify-between rounded-md border border-white bg-transparent px-4 text-sm placeholder:text-primary-02 focus:outline-none focus:ring-0 dark:focus:ring-2 focus:ring-text-100 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-gray-100 dark:text-text-100 focus:bg-primary-02 focus:ring-offset-transparent gap-x-select enabled:hover:bg-primary-02 transition-colors gap-2 font-sans",
			className
		)}
		{...props}
	>
		<SelectPrimitive.Icon asChild>{icon && icon}</SelectPrimitive.Icon>
		{children}
		<SelectPrimitive.Icon asChild>
			{!hideChevron && <ChevronDownIcon className="h-4 w-4" />}
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				"animate-in fade-in-80 relative z-50 overflow-hidden rounded-md border text-text-100 dark:text-text-100 shadow-md dark:border-dark-gray-100 border-primary-03 bg-white font-sans",
				className
			)}
			{...props}
		>
			<SelectScrollUp />
			<SelectPrimitive.Viewport className="">
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDown />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn(
			"py-2.5 px-4 text-[13px] font-medium text-primary-02 font-sans",
			className
		)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const scrollClasses = cn(
	"flex items-center justify-center h-[25px] bg-red-100/50 dark:bg-dark-gray-300 text-primary-02 cursor-default"
);

const SelectScrollUp = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.SelectScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={scrollClasses}
		{...props}
	>
		<ChevronUpIcon width={14} height={14} />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUp.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDown = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.SelectScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={scrollClasses}
		{...props}
	>
		<ChevronDownIcon width={14} height={14} />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDown.displayName = SelectPrimitive.ScrollDownButton.displayName;

interface SelectItemProps
	extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
	icon?: React.ReactNode;
	suppressCheckIcon?: boolean;
}

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	SelectItemProps
>(({ className, suppressCheckIcon, children, icon, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex flex-row cursor-default select-none items-center py-2.5 px-4 gap-x-select text-sm font-medium outline-none focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2 text-primary-02",
			className
		)}
		{...props}
	>
		{icon && icon}
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		{!suppressCheckIcon && (
			<span className="absolute right-4 flex h-3.5 w-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="h-4 w-4" color="var(--primary-02)" />
				</SelectPrimitive.ItemIndicator>
			</span>
		)}
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn(
			"-mx-1 my-1 h-px bg-slate-100 dark:bg-dark-gray-100 opacity-50",
			className
		)}
		{...props}
	/>
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

interface SelectWithLabelProps
	extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
	label: string;
	options: { label: string; value: string }[];
}

const SelectWithLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	SelectWithLabelProps
>(({ children, label, options, ...rest }, ref) => (
	<div className="flex flex-col w-full gap-y-3.5">
		<label className="text-primary-02 text-base text-left">{label}</label>
		<Select {...rest}>
			<SelectTrigger className="w-full py-3 h-fit bg-transparent dark:bg-dark-gray-300 hover:bg-primary-03">
				<SelectValue placeholder="-" />
			</SelectTrigger>
			<SelectContent
				className="w-[var(--radix-select-trigger-width)]"
				position="popper"
				sideOffset={5}
			>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
));
SelectWithLabel.displayName = "SelectWithLabel";

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectWithLabel,
};

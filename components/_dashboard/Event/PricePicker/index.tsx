"use client";

import React from "react";
import * as Slider from "@radix-ui/react-slider";

// Stylesheets
import sliderStyles from "./slider.module.css";
import styles from "./styles.module.css";
import DashboardCheckbox from "components/_ui/Checkbox";

const DEFAULT_MIN_VALUE = 25;
const DEFAULT_MAX_VALUE = 75;

interface ManualPickerProps {
	type: "min" | "max";
	value?: number | false;
	fixedWidth?: boolean;
	setValue?: React.Dispatch<React.SetStateAction<number | false>>;
}

function ManualPicker({
	type,
	value,
	setValue,
	fixedWidth,
}: ManualPickerProps) {
	return (
		<div
			className={`${styles.priceManualPicker} ${
				fixedWidth ? styles.fixed : ""
			}`}
		>
			<h6>Preço {type === "min" ? "mínimo" : "máximo"}</h6>
			<div>
				{value !== false && (
					<div className={styles.input}>
						<p>R$</p>
						<input
							type="number"
							name={type}
							value={value}
							placeholder={
								type === "min"
									? DEFAULT_MIN_VALUE.toString()
									: DEFAULT_MAX_VALUE.toString()
							}
							onChange={(e) =>
								setValue?.(
									Math.min(500, parseInt(e.target.value))
								)
							}
						/>
					</div>
				)}
				<DashboardCheckbox
					checked={value !== false}
					onCheckedChange={(checked) =>
						checked === false
							? setValue?.(false)
							: setValue?.(
									type === "min"
										? DEFAULT_MIN_VALUE
										: DEFAULT_MAX_VALUE
							  )
					}
				/>
			</div>
		</div>
	);
}

function CustomSlider(props: Slider.SliderProps) {
	const isDisabled = props.disabled ? sliderStyles.disabled : "";
	return (
		<Slider.Root
			{...props}
			className={sliderStyles.sliderRoot}
			defaultValue={[DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE]}
			max={500}
			step={1}
			minStepsBetweenThumbs={10}
			aria-label="Price Range"
		>
			<Slider.Track className={sliderStyles.sliderTrack}>
				<Slider.Range
					className={`${sliderStyles.sliderRange} ${isDisabled}`}
				/>
			</Slider.Track>
			<Slider.Thumb
				className={`${sliderStyles.sliderThumb} ${isDisabled}`}
			/>
			{props.value && props.value.length > 1 && (
				<Slider.Thumb
					className={`${sliderStyles.sliderThumb} ${isDisabled}`}
				/>
			)}
		</Slider.Root>
	);
}

export default function DashboardPricePicker({
	defaultValues,
	fixedWidth = false,
}: {
	defaultValues?: { min?: number; max?: number };
	fixedWidth?: boolean;
}) {
	const [minValue, setMinValue] = React.useState<number | false>(
		defaultValues?.min || false
	);
	const [maxValue, setMaxValue] = React.useState<number | false>(
		defaultValues?.max || false
	);

	const VALUE =
		minValue && maxValue
			? [
					minValue ? minValue : DEFAULT_MIN_VALUE,
					maxValue ? maxValue : DEFAULT_MAX_VALUE,
			  ]
			: minValue && maxValue == false
			? [minValue]
			: maxValue && minValue == false
			? [maxValue]
			: [DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE];

	return (
		<div className={styles.pricePicker}>
			<div className={styles.manualPickers}>
				<ManualPicker
					fixedWidth={fixedWidth}
					type="min"
					value={minValue}
					setValue={setMinValue}
				/>
				<ManualPicker
					fixedWidth={fixedWidth}
					type="max"
					value={maxValue}
					setValue={setMaxValue}
				/>
			</div>
			<CustomSlider
				value={VALUE}
				/* inverted={minValue === false && maxValue !== false} */
				disabled={minValue === false && maxValue === false}
				onValueChange={(value) => {
					// Um dos dois intervalos está desativado (falso)
					if (value.length === 1) {
						if (minValue === false) {
							setMaxValue(value[0]);
						} else {
							setMinValue(value[0]);
						}
					} else {
						setMinValue(value[0]);
						setMaxValue(value[1]);
					}
				}}
			/>
			{/* <div className={styles.sliderHolder}>
                <p>R$0</p>
                <CustomSlider />
                <p></p>
                <p>R$500</p>
            </div> */}
		</div>
	);
}

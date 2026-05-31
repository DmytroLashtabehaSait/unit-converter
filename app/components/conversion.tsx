/*
Student Name: Daniil Sakov & Deema Lashtabeha.
Date: May 30, 2026.
Description: This application is a responsive unit conversion tool built with Next.js, TypeScript, and Tailwind CSS.
Inputs: The user inputs numerical values into the left or right fields, selects a measurement tab, or builds an array of numbers.
Processing: A higher-order function dynamically generates a conversion utility based on the active units and processes single items or arrays.
Outputs: The application outputs the converted single metric/imperial values or arrays directly in UI.
*/

import React, { useState } from "react";

// Higher-Order Function
const createConverter = (fromUnit: string, toUnit: string) => {
	// Returns an arrow function capable of handling a single number or an array
	return (value: number | number[]): number | number[] => {
		const isArray = Array.isArray(value);
		const targetArray = isArray ? value : [value];

		const convertedArray = targetArray.map((val) => {
			// Weight Conversions (Pounds <-> Kilograms)
			if (fromUnit === "lb" && toUnit === "kg") return val * 0.453592;
			if (fromUnit === "kg" && toUnit === "lb") return val / 0.453592;

			// Distance Conversions (Miles <-> Kilometres)
			if (fromUnit === "mi" && toUnit === "km") return val * 1.60934;
			if (fromUnit === "km" && toUnit === "mi") return val / 1.60934;

			// Temperature Conversions (Celsius <-> Fahrenheit)
			if (fromUnit === "c" && toUnit === "f") return val * 1.8 + 32;
			if (fromUnit === "f" && toUnit === "c") return (val - 32) / 1.8;

			return val;
		});

		return isArray ? convertedArray : convertedArray[0];
	};
};

const Conversion = () => {
	const [mode, setMode] = useState("Weight");
	const [leftInput, setLeftInput] = useState<number>(0);
	const [rightInput, setRightInput] = useState<number>(0);
	const [inputArray, setInputArray] = useState<number[]>([]);
	const [outputArray, setOutputArray] = useState<number[]>([]);
	const [arrayHandlerModeIsLeft, setArrayHandlerModeIsLeft] = useState(true);

	// Track which side the user is typing in
	const [lastActiveInput, setLastActiveInput] = useState<"left" | "right">(
		"left"
	);

	// Do convertion
	const handleCalculation = (e: React.FormEvent) => {
		e.preventDefault();

		// Determine unit labels based on active tab state
		let fromUnit = "kg";
		let toUnit = "lb";

		if (mode === "Distance") {
			fromUnit = "km";
			toUnit = "mi";
		} else if (mode === "Temperature") {
			fromUnit = "c";
			toUnit = "f";
		}

		// Handle Single Value Conversions
		if (inputArray.length === 0) {
			if (lastActiveInput === "left") {
				const convert = createConverter(fromUnit, toUnit);
				setRightInput(convert(leftInput) as number);
			} else {
				// Swap units if converting right-to-left
				const convert = createConverter(toUnit, fromUnit);
				setLeftInput(convert(rightInput) as number);
			}
		} else {
			// Handle Array Conversions
			const dynamicFrom = arrayHandlerModeIsLeft ? fromUnit : toUnit;
			const dynamicTo = arrayHandlerModeIsLeft ? toUnit : fromUnit;
			const convert = createConverter(dynamicFrom, dynamicTo);
			setOutputArray(convert(inputArray) as number[]);
		}
	};

	return (
		<div>
			<header>
				<h1 className="text-2xl font-semibold text-center my-5">
					Welcome to my unit conversion web page
				</h1>
				<span className="flex justify-center rounded-2xl bg-gray-200 mx-5">
					<button
						onClick={() => {
							setMode("Weight");
							setInputArray([]);
							setOutputArray([]);
						}}
						className={`m-5 p-3 rounded-2xl text-white hover:bg-gray-700 transition-colors ${mode === "Weight" ? "bg-gray-900" : "bg-gray-500"}`}
					>
						Weight
					</button>
					<button
						onClick={() => {
							setMode("Distance");
							setInputArray([]);
							setOutputArray([]);
						}}
						className={`m-5 p-3 rounded-2xl text-white hover:bg-gray-700 transition-colors ${mode === "Distance" ? "bg-gray-900" : "bg-gray-500"}`}
					>
						Distance
					</button>
					<button
						onClick={() => {
							setMode("Temperature");
							setInputArray([]);
							setOutputArray([]);
						}}
						className={`m-5 p-3 rounded-2xl text-white hover:bg-gray-700 transition-colors ${mode === "Temperature" ? "bg-gray-900" : "bg-gray-500"}`}
					>
						Temperature
					</button>
				</span>
			</header>

			<section className="rounded-2xl bg-gray-200 mx-5 my-5 flex justify-center flex-col">
				<h2 className="font-bold capitalize text-center pt-5">
					{mode} Mode (
					{mode === "Weight"
						? "KG / LB"
						: mode === "Distance"
							? "KM / MI"
							: "°C / °F"}
					)
				</h2>

				<form
					className="flex justify-center"
					onSubmit={handleCalculation}
				>
					<input
						value={leftInput}
						type="number"
						onChange={(e) => {
							setLeftInput(Number(e.target.value));
							setLastActiveInput("left");
						}}
						className="m-5 border rounded-xl border-gray-500 p-2 text-center"
					/>

					<input
						value={rightInput}
						type="number"
						onChange={(e) => {
							setRightInput(Number(e.target.value));
							setLastActiveInput("right");
						}}
						className="m-5 border rounded-xl border-gray-500 p-2 text-center"
					/>
					<button
						type="submit"
						className="bg-gray-500 m-5 p-3 rounded-2xl text-white hover:bg-gray-700"
					>
						Calculate
					</button>
				</form>

				<span className="flex justify-center">
					<button
						className="bg-gray-500 m-5 p-3 rounded-2xl text-white hover:bg-gray-700"
						onClick={() => {
							setInputArray((prev) => [
								...prev,
								arrayHandlerModeIsLeft ? leftInput : rightInput,
							]);
						}}
					>
						Add value to an array
					</button>
					<button
						className="bg-gray-500 m-5 p-3 rounded-2xl text-white hover:bg-gray-700"
						onClick={() => {
							setInputArray([]);
							setOutputArray([]);
						}}
					>
						Clear array
					</button>
					<button
						type="button"
						className={`m-5 p-3 rounded-2xl text-white ${arrayHandlerModeIsLeft ? "bg-green-500" : "bg-gray-500"}`}
						onClick={() =>
							setArrayHandlerModeIsLeft(!arrayHandlerModeIsLeft)
						}
						disabled={inputArray.length !== 0}
					>
						{arrayHandlerModeIsLeft
							? "Converting Left Side"
							: "Converting Right Side"}
					</button>
				</span>

				<span className="flex flex-col text-center pb-5">
					<p>Input Array: [{inputArray.join(", ")}]</p>
					<p>
						Output Array: [
						{outputArray.map((n) => n.toFixed(2)).join(", ")}]
					</p>
				</span>
			</section>
		</div>
	);
};

export default Conversion;

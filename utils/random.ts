function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomNumbers(
	x: number,
	from: number,
	to: number,
	allowRepetition: boolean
): number[] {
	if (!allowRepetition && x > to - from + 1) {
		throw new Error(
			"Não é possível gerar números únicos sem repetição no intervalo fornecido. Gere um intervalo maior ou permita a repetição."
		);
	}

	const result: number[] = [];
	const allNumbers = Array.from(
		{ length: to - from + 1 },
		(_, i) => i + from
	);

	if (!allowRepetition) {
		if (x > allNumbers.length) {
			throw new Error(
				"Cannot generate unique numbers without repetition in the given range."
			);
		}

		// Shuffle the array and select the first x elements
		for (let i = allNumbers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
		}
		result.push(...allNumbers.slice(0, x));
	} else {
		// Repetition is allowed, so simply select x random numbers
		for (let i = 0; i < x; i++) {
			const random = getRandomIntInclusive(from, to);
			result.push(random);
		}
	}

	return result;
}

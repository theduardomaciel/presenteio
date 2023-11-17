export const toBase64 = (file: File) =>
	new Promise((resolve, reject) => {
		if (file.type !== "image/jpeg" && file.type !== "image/png") {
			//reject("Formato de arquivo inválido");
			console.warn("Formato de arquivo inválido");
			resolve(null);
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (!reader.result) {
				console.warn("Erro ao ler a imagem");
				resolve(null);
			} //reject("Erro ao ler a imagem");

			return compressImage(reader.result as string).then((image) => {
				if (image) {
					//console.log("Imagem: " + image);
					resolve(image);
				} else {
					console.warn("Erro ao comprimir a imagem");
					resolve(null);
				}
			});
		};
		reader.onerror = (error) => reject(error);
	}) as Promise<string | null>;

const extractBase64 = (image: string) => {
	if (!image) {
		return null;
	} else {
		if (typeof image !== "string") return null;
		const base64 = image.replace(/^data:image\/[a-z]+;base64,/, "");
		return base64;
	}
};

const byteSize = (string: string) => new Blob([string]).size;

const compressImage = async (imageString: string) => {
	const stringSizeInBytes = byteSize(imageString);

	// Caso a imagem possua mais de 10MB
	if (stringSizeInBytes > 10000000) {
		const image = new Image();
		image.src = imageString;
		await image.decode();

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (ctx) {
			canvas.width = image.width;
			canvas.height = image.height;

			ctx.drawImage(image, 0, 0);

			const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5);
			console.log("Compressed image size: ", byteSize(compressedBase64));

			return extractBase64(compressedBase64);
		}
	} else {
		console.log("No compression needed.");
		return extractBase64(imageString);
	}
};

// API
import { ImgurClient } from "imgur";

const client = new ImgurClient({
	clientId: process.env.IMGUR_CLIENT_ID,
	clientSecret: process.env.IMGUR_CLIENT_SECRET,
});

export async function getImageUrl(image_base64: string, name?: string) {
	if (image_base64) {
		try {
			const response = await client.upload({
				image: image_base64,
				title: `${name}_eventImage`,
				type: "base64",
			});
			if (response.status === 200) {
				console.log("✅ Image uploaded with success!");
				return {
					image_url: response.data.link,
					image_deleteHash: response.data.deletehash,
				};
			} else {
				console.log(response.data);
				console.log("❌ There was not possible to upload the image.");
				throw new Error("There was not possible to upload the image.");
			}
		} catch (error: any) {
			console.log(error.response.data);
			console.log("❌ There was not possible to upload the image.");
			throw new Error("There was not possible to upload the image.");
		}
	} else {
		console.log("Nenhuma string informada.");
		throw new Error("Nenhuma string informada.");
	}
}

export async function deleteImage(image_deleteHash: string) {
	if (image_deleteHash) {
		try {
			const response = await client.deleteImage(image_deleteHash);
			if (response.status === 200) {
				console.log("✅ Image deleted with success!");
				return true;
			} else {
				console.log("❌ There was not possible to delete the image.");
				throw new Error("There was not possible to delete the image.");
			}
		} catch (error) {
			console.log(error);
			console.log("❌ There was not possible to delete the image.");
			throw new Error("There was not possible to delete the image.");
		}
	} else {
		throw new Error("Nenhum delete hash informado.");
	}
}

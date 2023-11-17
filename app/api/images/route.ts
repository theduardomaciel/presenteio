import { type NextRequest } from "next/server";

// API
import { ImgurClient } from "imgur";
const client = new ImgurClient({
	clientId: process.env.IMGUR_CLIENT_ID,
	clientSecret: process.env.IMGUR_CLIENT_SECRET,
});

export async function POST(request: NextRequest) {
	const { image_base64, name } = await request.json();

	try {
		const image_url = await getImageUrl(image_base64, name);
		return Response.json({
			image_url: image_url,
		});
	} catch (error) {
		return new Response("Internal error.", {
			status: 500,
			statusText: "Internal error.",
		});
	}
}

export async function DELETE(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const image_deleteHash = searchParams.get("image_deleteHash");

	if (!image_deleteHash)
		return new Response("The image_deleteHash was not provided.", {
			status: 400,
			statusText: "Bad request.",
		});

	try {
		await client.deleteImage(image_deleteHash as string);
		console.log("✅ DELETED image with success!");
		return new Response("Image deleted with success.", {
			status: 200,
			statusText: "OK",
		});
	} catch (error) {
		console.log(error);
		return new Response("There was not possible to delete the image.", {
			status: 500,
			statusText: "Internal server error.",
		});
	}
}

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
				return null;
			}
		} catch (error: any) {
			console.log(error.response.data);
			console.log("❌ There was not possible to upload the image.");
			return null;
		}
	} else {
		console.log("Nenhuma string informada.");
		return null;
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
				return null;
			}
		} catch (error) {
			console.log(error);
			console.log("❌ There was not possible to delete the image.");
			return null;
		}
	} else {
		console.log("Nenhum delete hash informado.");
		return null;
	}
}

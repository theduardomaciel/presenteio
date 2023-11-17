import { type NextRequest } from "next/server";

// Helpers
import { deleteImage, getImageUrl } from "./helper";

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
		await deleteImage(image_deleteHash);
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

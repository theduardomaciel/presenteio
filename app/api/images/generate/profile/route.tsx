import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const COLORS = ["#FF2626", "#FF3D3D", "#FD7979"];

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const queryWidth = searchParams.get("width");

		const name = searchParams.get("name") || "Guest";
		const width = queryWidth ? parseInt(queryWidth) : 200;

		const RANDOM_COLORS = Array.from({ length: 3 }, () => {
			return COLORS[(Math.random() * COLORS.length) | 0];
		});

		const INITIALS = name
			.split(" ")
			.map((word) => word[0])
			.join("");

		return new ImageResponse(
			(
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundImage: `linear-gradient(45deg, ${RANDOM_COLORS[0]}, ${RANDOM_COLORS[1]}, ${RANDOM_COLORS[2]})`,
						fontSize: width / 2,
						color: "white",
						fontWeight: 900,
					}}
				>
					<div>{INITIALS}</div>
				</div>
			),
			{
				width: width,
				height: width,
			}
		);
	} catch (error: any) {
		console.log(`${error.message}`);
		return new Response(`Failed to generate the image`, {
			status: 500,
		});
	}
}

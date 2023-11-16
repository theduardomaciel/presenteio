import { ChangeEvent, useEffect, useState } from "react";

export default function useImagePreview(
	imageUrl?: string,
	preventCacheClear?: boolean
) {
	const [preview, setPreview] = useState<string | undefined>(imageUrl);

	const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || event.target.files.length === 0) {
			return null;
		}

		const selectedFile = event.target.files[0];
		setPreview(URL.createObjectURL(selectedFile));
	};

	useEffect(() => {
		if (preview && !preventCacheClear) {
			// free memory whenever this component is unmounted
			return () => {
				URL.revokeObjectURL(preview);
			};
		}
	}, []);

	return { preview, setPreview, onSelectFile };
}

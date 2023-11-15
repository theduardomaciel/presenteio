import { Dispatch, SetStateAction, useEffect } from "react";

export default function useImagePreview(
	setPreview: Dispatch<SetStateAction<string | undefined>>,
	preventCacheClear?: boolean
) {
	let objectUrl: string | undefined;

	const onSelectFile = (event: any) => {
		if (!event.target.files || event.target.files.length === 0) {
			return null;
		}
		const selectedFile = event.target.files[0];

		objectUrl = URL.createObjectURL(selectedFile);
		setPreview(objectUrl);
	};

	useEffect(() => {
		if (objectUrl && !preventCacheClear) {
			// free memory whenever this component is unmounted
			return () => {
				URL.revokeObjectURL(objectUrl as string);
			};
		}
	}, []);

	return onSelectFile;
}

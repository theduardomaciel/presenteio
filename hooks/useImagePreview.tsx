import { Dispatch, SetStateAction, useEffect } from "react";

export default function useImagePreview(
    setSelectedFile: Dispatch<SetStateAction<File | undefined>>,
    setPreview: any, selectedFile: File | undefined,
    preventCacheClear?: boolean
) {
    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        if (!preventCacheClear) {
            // free memory when ever this component is unmounted
            return () => {
                console.log("unmounted")
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [selectedFile])

    const onSelectFile = (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(event.target.files[0])
    }

    return onSelectFile;
}
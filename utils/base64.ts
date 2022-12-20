export const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const extractBase64 = (image: string) => {
    const base64 = image.replace(/^data:image\/[a-z]+;base64,/, "");
    return base64;
}
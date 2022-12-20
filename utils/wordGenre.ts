const getWordGenre = (name: string) => name ? (name.split(' ')[0].charAt(name.split(' ')[0].length - 1) === "a" ? "a" : "o") : "o";
// eventNameLastLetterOfFirstWord

export default getWordGenre;
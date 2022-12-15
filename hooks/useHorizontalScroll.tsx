import { useEffect } from "react";

export default function useHorizontalScroll(id?: string, setHorizontalScrollAutomatically?: boolean) {
    function moveScroll(amount: number) {
        if (id) {
            const scroll = document.getElementById(id) as HTMLDivElement;
            /* scroll.scrollLeft -= 20; */
            scroll.scrollTo({
                top: 0,
                left: scroll.scrollLeft + amount,
                behavior: 'smooth'
            });
        } else {
            console.log("Nenhum id foi informado.")
        }
    }

    useEffect(() => {
        if (setHorizontalScrollAutomatically && id) {
            console.log("Horizontal scroll added!")
            setHorizontalScroll(id)
        }
    }, [])

    function setHorizontalScroll(id: string/* scroll: HTMLDivElement */) {
        const scroll = document.getElementById(id) as HTMLDivElement;
        if (scroll) {
            scroll.addEventListener("wheel", function (event) {
                if (event.deltaY > 0) {
                    scroll.scrollTo({
                        top: 0,
                        left: scroll.scrollLeft + 100,
                        behavior: 'smooth'
                    });
                    event.preventDefault();
                    // preventDefault() will help avoid worrisome 
                    // inclusion of vertical scroll 
                } else {
                    scroll.scrollTo({
                        top: 0,
                        left: scroll.scrollLeft - 100,
                        behavior: "smooth"
                    });
                    event.preventDefault();
                }
            });
        }
    }

    return { moveScroll, setHorizontalScroll }
}
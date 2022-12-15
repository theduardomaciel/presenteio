import Image from 'next/image'
import Link from 'next/link'

// Components
import Button from '../../../../../components/Button'

// Stylesheet
import styles from './intro.module.css'

// Assets
//import Logo from "../../../public/logo.svg";
import Gifts from "../../../../../public/images/gifts.png"
import Gift from "../../../../../public/images/gift.png"

export default function Intro() {
    return <>
        <header>
            <h6>Boa tarde, <strong>Fulano</strong>!</h6>
            {/* <p>Não sou fulano, <strong>sair</strong></p> */}
        </header>
        <div className={styles.content}>
            <div className={styles.title}>
                <div>
                    <h3>Chegou a hora do</h3>
                    <h1>Amigo Secreto</h1>
                    <h3>da Família Buscapé</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <Button
                        label='PARTICIPAR'
                        style={{
                            textTransform: "uppercase",
                            fontFamily: "'Gelasio'",
                            fontStyle: "normal",
                            fontWeight: 700,
                            padding: "1rem 3.5rem",
                            fontSize: "1.8rem"
                        }}
                    />
                    {/* <p>Não sou Fulano, <strong>sair</strong></p> */}
                </div>
            </div>

            <Image
                className={styles.giftsImage}
                width={305}
                height={374}
                src={Gifts}
                priority
                draggable={false}
                alt="Vários presentes vermelhos com fita amarela que forma um laço no topo."
            />
            <Image
                className={styles.giftImage}
                width={155}
                height={155}
                src={Gift}
                priority
                draggable={false}
                alt="Presente vermelho único com fita amarela que forma um laço no topo."
            />
        </div>
    </>
}
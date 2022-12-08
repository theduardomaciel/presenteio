// Stylesheets
import styles from './styles.module.css';

const InfiniteLoopSlider = ({ children, duration, reverse = false }: { children: any, duration: number, reverse: boolean | number }) => {
    return (
        <div className={styles.loopSlider}>
            <div className={styles.inner} style={{ animationDirection: reverse === 1 ? 'reverse' : 'normal', animationDuration: `${duration}ms` }}>
                {children}
                {children}
            </div>
        </div>
    );
};

export default InfiniteLoopSlider;
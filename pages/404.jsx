import styles from '@/styles/error.module.css';
export default function GlobalError({ error, reset }) {
    return (
        <div className={styles.container}>
            <div className={styles.error_box}>
                <h2 className={styles.heading}>404 Not Found</h2>
                <p>Page Not Found!!</p>
                <button
                    onClick={() => reset()}
                    className={styles.button}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

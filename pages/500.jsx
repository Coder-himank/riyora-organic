import styles from '@/styles/error.module.css';
export default function GlobalError({ error, reset }) {
    return (
        <div className={styles.container}>
            <div className={styles.error_box}>

                <h2 className={styles.heading}>Server Error</h2>
                <p>Server Responded 500</p>
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

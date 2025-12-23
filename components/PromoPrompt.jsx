import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/PromoPrompt.module.css';
import Link from 'next/link';
export const PromoPrompt = ({ onClose, code, discount }) => {
    return (
        <AnimatePresence>
            <motion.div
                className={styles.cardBackground}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className={styles.promoPrompt}
                    initial={{ scale: 0.85, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <motion.h2
                        className={styles.title}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        🎉 Special Offer
                    </motion.h2>

                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Get <strong>{discount}% off</strong> on your purchase!
                    </motion.p>

                    {/* Promo Code */}
                    <motion.div
                        className={styles.promoCodeBox}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className={styles.promoLabel}>Promo Code</span>
                        <span className={styles.promoCode}>{code}</span>
                    </motion.div>

                    {/* CTA */}
                    <Link href="/products" onClick={onClose}>
                        <motion.button
                            className={styles.ctaButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Shop Now
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

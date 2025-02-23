import { motion } from "framer-motion";

export default function Button({ onClick, label }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="btn"
    >
      {label}
    </motion.button>
  );
}

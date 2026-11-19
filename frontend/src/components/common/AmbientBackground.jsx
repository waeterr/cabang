import { motion } from 'framer-motion';
import './AmbientBackground.css';

const AmbientBackground = () => {
  return (
    <div className="ambient-bg">
      <motion.div
        className="ambient-blob blob-blue"
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -50, 0, 50, 0],
          scale: [1, 1.1, 1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="ambient-blob blob-violet"
        animate={{
          x: [0, -50, 0, 50, 0],
          y: [0, 50, 0, -50, 0],
          scale: [1, 0.9, 1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="ambient-blob blob-cyan"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default AmbientBackground;

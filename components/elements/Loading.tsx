import { motion } from "framer-motion";

interface LoadingProps {
    index: number;
}
  
const Loading: React.FC<LoadingProps> = ({ index }) => {
    return (
        <motion.span
            key={index}
            className="size-3.5 rounded-full bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
            delay: index * 0.2,
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'reverse',
            }}
        ></motion.span>
    )
}

export default Loading;
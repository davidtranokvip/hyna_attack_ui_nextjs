import { motion, AnimatePresence  } from "framer-motion";
import { useEffect } from "react";

interface INoticePassProps {
    success: string;
    myClass?: string;
    setSuccess: (value: string) => void;
}
const NoticePass = ({success, setSuccess, myClass }: INoticePassProps ) => {

    useEffect(() => {
        if (success) {
          const timer = setTimeout(() => {
            setSuccess("");
          }, 3000);
          return () => clearTimeout(timer);
        }
    }, [success, setSuccess]);
    
    return (
        <AnimatePresence mode="wait">
        {success && (
          <motion.div 
            key="success-message"
            className="notice_success w-[35%] absolute top-2/4 left-2/4 transform-50 z-50"
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
          >

            <motion.div 
              className="notice flex py-16	px-8 justify-center items-center opacity-40" 
              data-augmented-ui="border"
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              exit={{ rotateX: 90 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
                <motion.p 
                  className={`${myClass} uppercase text-white text-center font-bold`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  >
                  {success}
                </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}

export default NoticePass
import { WarningOutlined } from "@ant-design/icons";
import { motion, AnimatePresence  } from "framer-motion";
import { useEffect } from "react";

interface INoticeErrorProps {
  error: string;
  myClass: string;
  setError: (value: string) => void;
}

const NoticeError = ({error, setError, myClass }: INoticeErrorProps ) => {

    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError("");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [error, setError]);
    
    return (
        <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            key="error-message"
            className="notice_error w-[35%] absolute top-2/4 left-2/4 transform-50 z-50"
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
              <div className="flex justify-between items-center ml-[20px]">
                <WarningOutlined style={{ fontSize: '200px', color: '#ff0000' }} />
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
                  {error}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}

export default NoticeError
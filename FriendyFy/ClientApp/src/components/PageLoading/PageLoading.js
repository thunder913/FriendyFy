import React from "react";
import { motion } from "framer-motion/dist/es/index.js";

const PageLoading = ({children}) => {
    return(<motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    transition={{duration: 0.4}}>
        {children}
    </motion.div>)
}

export default PageLoading;
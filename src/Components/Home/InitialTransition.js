import {motion} from "framer-motion";

function InitialTransition() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        />
    );
}

export default InitialTransition;
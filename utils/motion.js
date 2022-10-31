const variants1 = {
    hidden: { opacity: 0, x: -100 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
    },
    exit: {
        opacity: 0,
        x: 100,
        transition: { duration: 1, ease: [0.6, 0.05, -0.01, 0.9] },
    },
};
const variants = {
    hidden: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default variants;

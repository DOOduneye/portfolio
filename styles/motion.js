export const variants = {
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

// export const variants = {
//     hidden: { opacity: 0, x: -100 },
//     animate: {
//         opacity: 1,
//         x: 0,
//         transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
//     },
// };


// export const pageTransition = {
//     hidden: { opacity: 0 },
//     animate: { opacity: 1 },
//     exit: { opacity: 0 },
// };


// const variants = {
//     hidden: { opacity: 0, x: 100 },
//     animate: {
//         opacity: 1,
//         x: 0,
//         transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
//     },
// };

// const gradientVariants = {
//     hidden: { color: '#000000' },
//     animate: {
//         color: 'transparent',
//         background: 'linear-gradient(90deg, #B4A0E5 0%, #4ECDC4 100%)',
//         WebkitBackgroundClip: 'text',
//         WebkitTextFillColor: 'transparent',
//         transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.03, 0.9] },
//     },
// };


const colors = ['#4ECDC4', '#DA4167', '#222222', '#40C9C0', '#DAB894', '#DA4167'];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

export { randomColor };

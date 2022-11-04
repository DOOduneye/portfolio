/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    images: {
        loader: 'akamai',
        path: '.',
    },
    webpack: config => {
        config.resolve.fallback = { fs: false, module: false, path: false }
        return config
    }
};

export default nextConfig;

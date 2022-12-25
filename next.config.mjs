/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    // images: {
    //     loader: 'akamai',
    //     path: '.',
    // },
    images: {
        domains: ['res.craft.do']
    },
    webpack: config => {
        config.resolve.fallback = { fs: false, module: false, path: false }
        return config
    }
};

export default nextConfig;

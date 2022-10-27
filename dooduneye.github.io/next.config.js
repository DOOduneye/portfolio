/** @type {import('next').NextConfig} */

// import nextMDX from '@next/mdx'

// const withMDX = nextMDX({
//   extension: /\.mdx?$/,
//   options: {
//     providerImportSource: '@mdx-js/react',
//   },
// })

// export default withMDX({
//   // Support MDX files as pages:
//   pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
// })

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig


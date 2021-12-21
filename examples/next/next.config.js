/** @type {import('next').NextConfig} */

const path = require('path')

module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    esmExternals: false // Fix chakra ui memory fail, will be node in next release https://github.com/vercel/next.js/issues/30330#issuecomment-952172377
  },
  webpack: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'react-router-dom': path.resolve(__dirname, '../../index.tsx')
      }
    }
  })
}

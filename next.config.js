import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    emotion: true,
  },
}

export default createMDX({})(nextConfig)

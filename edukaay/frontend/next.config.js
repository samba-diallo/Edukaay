/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.edukaay.com', 'res.cloudinary.com'],
  },
  i18n: {
    locales: ['fr', 'wo', 'ar'],
    defaultLocale: 'fr',
  },
};

module.exports = nextConfig;

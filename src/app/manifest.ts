import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أســــــــامه لخدمات الموبايل',
    short_name: 'أسامة موبايل',
    description: 'نظام إدارة صيانة الموبايل المتقدم مع دعم الباركود وتطبيق ويب (PWA).',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#23b936',
    icons: [
      {
        src: 'https://placehold.co/192x192/23b936/white?text=Osama',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://placehold.co/512x512/23b936/white?text=Osama',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

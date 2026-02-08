
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أســــــــامه لخدمات الموبايل',
    short_name: 'أسامة موبايل',
    description: 'نظام إدارة صيانة الموبايل المتقدم مع دعم الباركود وتطبيق ويب (PWA).',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#23b936',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://placehold.co/192x192/23b936/FFFFFF?text=Osama',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://placehold.co/512x512/23b936/FFFFFF?text=Osama',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  }
}

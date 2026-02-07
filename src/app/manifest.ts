import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أســــــــامه لخدمات الموبايل',
    short_name: 'أسامة موبايل',
    description: 'نظام إدارة صيانة الموبايل المتقدم مع دعم الباركود وتطبيق ويب (PWA).',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'window-controls-overlay'],
    background_color: '#F4F4F4',
    theme_color: '#0C2B4E',
    icons: [
      {
        src: 'https://placehold.co/192x192/F4F4F4/0C2B4E?text=Osama',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://placehold.co/512x512/F4F4F4/0C2B4E?text=Osama',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  }
}

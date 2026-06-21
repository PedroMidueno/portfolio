import { useImage } from '#imports'

type ImageModifiers = Parameters<ReturnType<typeof useImage>>[1]

export const useOptimizedImageUrl = (imageUrl: string, modifiers?: ImageModifiers) => {
  const img = useImage()
  const { assetsBaseUrl } = useRuntimeConfig().public

  const cleanUrl = imageUrl.startsWith('/r2/')
    ? imageUrl
    : assetsBaseUrl + imageUrl

  return img(cleanUrl, modifiers)
}

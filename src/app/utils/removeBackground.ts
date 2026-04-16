import { removeBackground } from '@imgly/background-removal'

export async function removeBg(imageSrc: string): Promise<string> {
  const blob = await removeBackground(imageSrc)
  return URL.createObjectURL(blob)
}

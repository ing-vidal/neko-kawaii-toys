import Image from 'next/image';

interface ImageOrFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const defaultPlaceholder = 'https://placehold.co/600x400/fff0f5/db7093?text=Kawaii+Toy';

export function ImageOrFallback({ src, alt, width, height, className = '' }: ImageOrFallbackProps) {
  const imageSrc = src || defaultPlaceholder;

  if (imageSrc.startsWith('data:')) {
    return <img src={imageSrc} alt={alt} className={className} />;
  }

  return <Image src={imageSrc} alt={alt} width={width} height={height} className={className} />;
}

import Image from 'next/image';

interface ImageOrFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ImageOrFallback({ src, alt, width, height, className = '' }: ImageOrFallbackProps) {
  if (src.startsWith('data:')) {
    return <img src={src} alt={alt} className={className} />;
  }

  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}

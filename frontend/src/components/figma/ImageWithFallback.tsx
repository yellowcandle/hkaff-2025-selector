import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='420' viewBox='0 0 280 420'%3E%3Crect fill='%23f3f4f6' width='280' height='420'/%3E%3Cg transform='translate(140,210)'%3E%3Cpath fill='%239ca3af' d='M-35-42h70v84h-70z'/%3E%3Ccircle fill='%239ca3af' cx='-21' cy='0' r='11'/%3E%3Ccircle fill='%239ca3af' cx='21' cy='0' r='11'/%3E%3C/g%3E%3C/svg%3E`;

  return (
    <img
      src={imageError ? fallbackSvg : src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}

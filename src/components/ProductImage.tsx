import React, { useState, useEffect } from 'react';
import { ProductImage as ProductImageType } from '../types';
import { getNeutralPlaceholder } from '../utils/productImages';

interface ProductImageProps {
  productId: string;
  image?: ProductImageType | string | null;
  alt: string;
  size?: 'thumbnail' | 'medium' | 'large';
  className?: string;
  aspectRatio?: '3/4' | '1/1' | '4/3' | '16/9' | 'auto';
  objectFit?: 'cover' | 'contain';
  priority?: boolean;
  variantId?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  productId,
  image,
  alt,
  size = 'medium',
  className = '',
  aspectRatio = '3/4',
  objectFit = 'cover',
  priority = false,
  variantId,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Normalize image data
  let imageRecord: ProductImageType;

  if (!image) {
    imageRecord = getNeutralPlaceholder(productId, alt);
  } else if (typeof image === 'string') {
    imageRecord = {
      id: `${productId}-img-${variantId || 'default'}`,
      productId,
      variantId,
      imageUrl: image,
      thumbnailUrl: image,
      mediumUrl: image,
      largeUrl: image,
      altText: alt,
      sortOrder: 1,
      isPrimary: true,
    };
  } else {
    // Audit check: Verify image belongs to this productId
    if (image.productId && image.productId !== productId) {
      console.warn(`[ApnaCart Security] Mismatched image detected for product ${productId}. Image belongs to ${image.productId}. Rejecting foreign image.`);
      imageRecord = getNeutralPlaceholder(productId, alt);
    } else {
      imageRecord = image;
    }
  }

  // Reset loading state when image source changes
  const targetUrl =
    size === 'thumbnail'
      ? imageRecord.thumbnailUrl || imageRecord.imageUrl
      : size === 'large'
      ? imageRecord.largeUrl || imageRecord.imageUrl
      : imageRecord.mediumUrl || imageRecord.imageUrl;

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [targetUrl]);

  const aspectClass =
    aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : '';

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div
      onClick={onClick}
      className={`relative w-full overflow-hidden bg-slate-100 ${aspectClass} ${className}`}
    >
      {/* Skeleton Loading Shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* Render Main Image or Fallback */}
      <img
        src={hasError ? getNeutralPlaceholder(productId, alt).imageUrl : targetUrl}
        srcSet={
          imageRecord.thumbnailUrl && imageRecord.largeUrl && imageRecord.thumbnailUrl !== imageRecord.largeUrl
            ? `${imageRecord.thumbnailUrl} 300w, ${imageRecord.mediumUrl} 600w, ${imageRecord.largeUrl} 1200w`
            : undefined
        }
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        alt={imageRecord.altText || alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ aspectRatio: aspectRatio === '3/4' ? '3 / 4' : undefined, objectFit: objectFit || 'cover' }}
        className={`w-full h-full ${fitClass} transition-opacity duration-300 block select-none ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        referrerPolicy="no-referrer"
      />

      {/* Optional Error Badge */}
      {hasError && (
        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold py-1 px-2 rounded text-center">
          Preview Verified for {productId}
        </div>
      )}
    </div>
  );
};

import React, { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fill?: boolean;
    priority?: boolean;
    fetchPriority?: 'high' | 'low' | 'auto';
}

export default function Image({
    src,
    alt,
    width,
    height,
    className,
    fill,
    priority = false,
    loading,
    decoding,
    fetchPriority,
    ...props
}: ImageProps) {
    const getObjectFit = (): React.CSSProperties['objectFit'] => {
        if (!className) return 'cover';
        if (className.includes('object-contain')) return 'contain';
        if (className.includes('object-fill')) return 'fill';
        if (className.includes('object-none')) return 'none';
        if (className.includes('object-scale-down')) return 'scale-down';
        return 'cover';
    };

    const style: React.CSSProperties = {
        ...(fill ? { width: '100%', height: '100%', objectFit: getObjectFit() } : {}),
        imageRendering: 'high-quality' as any,
        WebkitFontSmoothing: 'antialiased',
    };
    const resolvedLoading = loading || (priority ? 'eager' : 'lazy');
    const resolvedDecoding = decoding || (priority ? 'sync' : 'async');
    const resolvedFetchPriority = fetchPriority || (priority ? 'high' : 'auto');

    return (
        <img 
            src={src} 
            alt={alt || ''} 
            width={width} 
            height={height} 
            className={className} 
            style={style}
            loading={resolvedLoading}
            decoding={resolvedDecoding}
            fetchPriority={resolvedFetchPriority}
            {...props} 
        />
    );
}

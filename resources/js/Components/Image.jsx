import React from 'react';

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
}) {
    const style = fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {};
    const resolvedLoading = loading || (priority ? 'eager' : 'lazy');
    const resolvedDecoding = decoding || 'async';
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

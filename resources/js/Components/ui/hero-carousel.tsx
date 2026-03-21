import { useEffect, useState } from 'react';
import { HeroCarouselClient } from './hero-carousel-client';

type CarouselImage = {
  id: number;
  title: string;
  altText: string | null;
  imageUrl: string;
  order: number;
  isActive: boolean;
};

export function HeroCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/carousel')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">Loading...</div>;
  }

  if (images.length === 0) {
    return <div className="w-full h-96 bg-gray-200 flex items-center justify-center">No Carousel Images Available</div>;
  }

  return <HeroCarouselClient images={images} />;
}

'use client';

import { useEffect, useState } from 'react';
import { useBanner } from '@/hooks/useBanner';

export const BannerCarousel = () => {
  const { data: bannerData, isLoading } = useBanner();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate banners
  useEffect(() => {
    if (!bannerData?.banners?.length || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === bannerData.banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [bannerData, isPaused]);

  if (isLoading || !bannerData?.banners?.length) return null;

  const activeBanners = bannerData.banners.filter(banner => banner.isActive !== false);
  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex % activeBanners.length];

  return (
    <div 
      className="w-full overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`w-full py-2 px-4 text-center text-white transition-colors duration-500 ${currentBanner.backgroundColor || 'bg-blue-500'}`}
      >
        <div className="container mx-auto flex items-center justify-center">
          <p className="text-sm md:text-base font-medium">
            {currentBanner.message}
          </p>
          
          {activeBanners.length > 1 && (
            <div className="ml-4 flex space-x-2">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex % activeBanners.length === index 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <button 
            onClick={() => setCurrentIndex(prev => (prev + 1) % activeBanners.length)}
            className="ml-4 text-white/80 hover:text-white transition-colors"
            aria-label="Next banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

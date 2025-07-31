import { useEffect, useState } from 'react';

interface BannerItem {
  message: string;
  backgroundColor: string;
  isActive?: boolean;
}

interface BannerData {
  banners: BannerItem[];
}

interface UseBannerReturn {
  data: BannerData | null;
  isLoading: boolean;
  error: string | null;
}

export const useBanner = (): UseBannerReturn => {
  const [data, setData] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/globals/banner');
        if (!response.ok) {
          throw new Error('Failed to fetch banner data');
        }
        const bannerData = await response.json();
        setData(bannerData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  return { data, isLoading, error };
};

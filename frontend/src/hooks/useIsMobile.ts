import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);

    onChange();
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};

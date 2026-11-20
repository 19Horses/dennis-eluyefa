import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import type { SanityImage } from '../sanityImage';
import axios from 'axios';

export type GalleryImage = SanityImage & {
  _key: string;
};

export type GalleryType = {
  _id: string;
  images: GalleryImage[];
};

const query = `
  *[_type == "gallery"][0]{
    _id,
    images[]{
      _key,
      asset->{
        _id
      }
    }
  }
`;

const getGallery = async (): Promise<{ result: GalleryType | null }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: getGallery,
    select: (res) => res.result,
  });
};

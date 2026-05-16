import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import type { SanityImage } from '../sanityImage';
import axios from 'axios';

export type AboutDoc = {
  _id: string;
  bio?: string;
  image?: SanityImage;
  quote?: string;
};

const query = `
  *[_type == "about"][0]{
    _id,
    bio,
    image{
      asset->{
        _id
      }
    },
    quote
  }
`;

const getAbout = async (): Promise<{ result: AboutDoc | null }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetAbout = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: getAbout,
    select: (res) => res.result,
  });
};

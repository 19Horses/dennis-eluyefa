import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import axios from 'axios';

export type LandingImage = {
  _key: string;
  asset?: {
    _id: string;
    url: string;
  };
};

export type LandingType = {
  title: string;
  images: LandingImage[];
};

const query = `
  *[_type == "landing"][0]{
    title,
    images[]{
      _key,
      asset->{
        _id,
        url
      }
    }
  }
`;

const getLanding = async (): Promise<{ result: LandingType | null }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetLanding = () => {
  return useQuery({
    queryKey: ['landing'],
    queryFn: getLanding,
    select: (res) => res.result,
  });
};

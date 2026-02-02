import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import axios from 'axios';
import { formatDate } from '../utils';

export type ProjectImage = {
  _key: string;
  asset?: {
    _id: string;
    url: string;
  };
};

export type ProjectType = {
  _id: string;
  title: string;
  date: string;
  slug: {
    current: string;
  };
  images: ProjectImage[];
};

const query = `
  *[_type == 'project'] | order(order asc){
    _id,
    title,
    date,
    slug,
    images[]{
      _key,
      asset->{
        _id,
        url
      }
    }
  }
`;

const getProjects = async (): Promise<{ result: ProjectType[] }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    select: (res) =>
      res.result?.map((project) => ({
        ...project,
        date: formatDate(project.date),
      })) ?? [],
  });
};

export const useGetProject = (slug: string) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjects(),
    select: (res) =>
      res.result?.find((project) => project.slug.current === slug) ?? null,
  });
};

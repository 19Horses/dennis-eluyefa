import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import axios from 'axios';
import { formatDate } from '../utils';
import type { SanityImage } from '../sanityImage';

export type ProjectImage = SanityImage & {
  _key: string;
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
        _id
      }
    }
  }
`;

const getProjects = async (): Promise<{ result: ProjectType[] }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const PROJECTS_QUERY_KEY = ['projects'] as const;

export const useGetProjects = () => {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
    staleTime: 1000 * 60 * 5,
    select: (res) =>
      res.result?.map((project) => ({
        ...project,
        date: formatDate(project.date),
      })) ?? [],
  });
};

export const useGetProject = (slug: string) => {
  return useQuery({
    // Share the Work page cache — no second full projects fetch on navigate.
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(slug),
    select: (res) =>
      res.result?.find((project) => project.slug.current === slug) ?? null,
  });
};

import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import axios from 'axios';

export type ClientsListDoc = {
  _id: string;
  clients?: string[];
};

const query = `
  *[_type == "clientsList"][0]{
    _id,
    clients
  }
`;

const getClientsList = async (): Promise<{ result: ClientsListDoc | null }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetClients = () => {
  return useQuery({
    queryKey: ['clientsList'],
    queryFn: getClientsList,
    select: (res) => res.result?.clients ?? [],
  });
};

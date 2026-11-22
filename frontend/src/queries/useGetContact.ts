import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../sanityIntegration';
import axios from 'axios';

export type ContactDoc = {
  _id: string;
  email?: string;
  printEmail?: string;
  inquiriesText?: string;
  thanksMessage?: string;
  printText?: string;
};

const query = `
  *[_type == "contact"][0]{
    _id,
    email,
    printEmail,
    inquiriesText,
    thanksMessage,
    printText
  }
`;

const getContact = async (): Promise<{ result: ContactDoc | null }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetContact = () => {
  return useQuery({
    queryKey: ['contact'],
    queryFn: getContact,
    select: (res) => res.result,
  });
};

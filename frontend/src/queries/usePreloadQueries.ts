import { useGetLanding } from './useGetLanding';
import { useGetProjects } from './useGetProjects';
import { useGetAbout } from './useGetAbout';
import { useGetClients } from './useGetClients';

const usePreloadQueries = () => {
  useGetLanding();
  useGetProjects();
  useGetAbout();
  useGetClients();
};

export default usePreloadQueries;

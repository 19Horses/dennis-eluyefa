import { useGetLanding } from './useGetLanding';
import { useGetProjects } from './useGetProjects';
import { useGetAbout } from './useGetAbout';
import { useGetClients } from './useGetClients';
import { useGetGallery } from './useGetGallery';

const usePreloadQueries = () => {
  useGetLanding();
  useGetProjects();
  useGetAbout();
  useGetClients();
  useGetGallery();
};

export default usePreloadQueries;

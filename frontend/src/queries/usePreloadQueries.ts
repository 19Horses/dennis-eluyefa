import { useGetLanding } from './useGetLanding';
import { useGetProjects } from './useGetProjects';
import { useGetAbout } from './useGetAbout';
import { useGetClients } from './useGetClients';
import { useGetGallery } from './useGetGallery';
import { useGetContact } from './useGetContact';

const usePreloadQueries = () => {
  useGetLanding();
  useGetProjects();
  useGetAbout();
  useGetClients();
  useGetGallery();
  useGetContact();
};

export default usePreloadQueries;

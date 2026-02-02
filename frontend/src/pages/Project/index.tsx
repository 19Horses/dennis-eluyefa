import { useParams } from 'react-router';
import Layout from '../../components/Layout';
import { useGetProject } from '../../queries/useGetProjects';
import { ProjectContainer, ProjectImage, ProjectTitle } from './styles';
import { Loading } from '../../components/Loading';

export default function Project() {
  console.log('Project');
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetProject(slug ?? '');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error!</p>;
  }
  return (
    <Layout>
      <ProjectContainer>
        <ProjectImage src={data?.images[0].asset?.url} alt={data?.title} />
        <ProjectTitle>{data?.title}</ProjectTitle>
      </ProjectContainer>
    </Layout>
  );
}
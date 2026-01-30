import Layout from '../components/Layout';
import { useGetProjects } from '../queries/useGetProjects';

function Work() {
  const { data, isLoading, isError } = useGetProjects();

  console.log(data);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <Layout>
      <p>Work</p>
    </Layout>
  );
}

export default Work;

import Layout from '../components/Layout';
import { useGetTest } from '../queries/useGetTests';

function Work() {
  const { data, isLoading, isError } = useGetTest();

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

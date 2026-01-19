import Layout from '../components/Layout';
import { useGetTest } from '../queries/useGetTests';

function About() {
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
      <p>About</p>
    </Layout>
  );
}

export default About;

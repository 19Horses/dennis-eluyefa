import Nav from '../components/Nav';
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
    <div>
      <Nav />
      <p>About</p>
    </div>
  );
}

export default About;

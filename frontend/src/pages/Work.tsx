import Nav from '../components/Nav';
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
    <div>
      <Nav />
      <p>Work</p>
    </div>
  );
}

export default Work;

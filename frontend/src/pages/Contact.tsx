import Nav from '../components/Nav';
import { useGetTest } from '../queries/useGetTests';

function Contact() {
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
      <p>Contact</p>
    </div>
  );
}

export default Contact;

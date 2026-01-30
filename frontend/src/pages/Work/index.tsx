import Layout from '../../components/Layout';
import { Loading } from '../../components/Loading';
import { useGetProjects } from '../../queries/useGetProjects';
import { ProjectCard, ProjectImage, ProjectTitle, WorkContainer } from './styles';

function Work() {
    const { data, isLoading, isError } = useGetProjects();

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <Layout>
                <p>Error!</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <WorkContainer>
                {data?.map((project, index) => (
                    <ProjectCard key={project._id} $index={index}>

                        <ProjectImage src={project.images[0].asset?.url} alt={project.title} />
                        <ProjectTitle>{project.title}</ProjectTitle>
                    </ProjectCard>
                ))}
            </WorkContainer>
        </Layout>
    );
}

export default Work;

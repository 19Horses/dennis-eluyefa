import { styled } from 'styled-components';

export const ProjectContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProjectTitle = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 2rem;
  font-weight: bold;
`;

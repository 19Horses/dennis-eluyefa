import { styled } from 'styled-components';
import { COLORS } from '../../constants';

export const ContactContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: ${COLORS.tertiary};
  padding: 2rem;
`;

export const ContactText = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 35px;
  color: ${COLORS.secondary};
  font-weight: bold;
  text-align: center;
  font-style: italic;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const ContactSubtext = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 20px;
  color: ${COLORS.secondary};
  font-weight: bold;
  text-align: center;
  font-style: italic;
  width: 100%;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const LeftSubtext = styled(ContactSubtext)`
  text-align: left;
  align-self: flex-start;

  @media (max-width: 768px) {
    text-align: center;
    align-self: center;
  }
`;

export const RightSubtext = styled(ContactSubtext)`
  text-align: right;
  align-self: flex-end;

  @media (max-width: 768px) {
    text-align: center;
    align-self: center;
  }
`;

export const Email = styled.span`
  color: ${COLORS.primary};
  font-weight: bold;
  text-decoration: underline;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

export const Underline = styled.span`
  text-decoration: underline;
`;



import styled from 'styled-components';


export const TextArea = styled.textarea`
  padding: 1em;
  border: 2px solid ${({ theme }) => theme.color2};
  border-radius: ${(props) => props.theme.sizes.buttonBorderRadius};
`;



import styled from 'styled-components';


export const Button = styled.button`
  background-color: ${({ theme }) => theme.secondaryBackground};
  padding: 1em 2em;
  color: ${({ theme }) => theme.texts};
  border: ${({ theme }) => `${theme.sizes.buttonBorderWidth} solid ${theme.border}`};
  border-radius: ${(props) => props.theme.sizes.buttonBorderRadius};
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover{
    
    background-color: ${(props) => props.theme.primaryBackground};
  }
`;

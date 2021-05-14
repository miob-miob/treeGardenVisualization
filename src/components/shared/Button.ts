import styled from 'styled-components';

type Props = {
  negative?:boolean,
  disabled?:boolean
};
// todo what abut color1 color2 color3
export const Button = styled.button<Props>`
  background-color: ${({ theme, negative }) => (negative ? theme.color4 : theme.color1)};
  padding: 1em 2em;
  color: ${({ theme, negative }) => (negative ? theme.color1 : theme.color4)};
  border: ${({ theme }) => `${theme.sizes.buttonBorderWidth} solid ${theme.color3}`};
  border-radius: ${(props) => props.theme.sizes.buttonBorderRadius};
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover{
    
    background-color: ${({ theme, negative }) => (negative ? theme.color3 : theme.color2)};
  }
`;

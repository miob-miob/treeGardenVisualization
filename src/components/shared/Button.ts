import styled from 'styled-components';

type Props = {
  negative?:boolean,
  disabled?:boolean
};

export const Button = styled.button<Props>`
  display: flex;
  justify-content: center;
  background-color: ${({ theme, negative }) => (negative ? theme.color4 : theme.color1)};
  padding: 0.9em 2em;
  width: 10em;
  color: ${({ theme, negative }) => (negative ? theme.color1 : theme.color4)};
  border: ${({ theme }) => `${theme.sizes.borderWidth} solid ${theme.color3}`};
  border-radius: ${(props) => props.theme.sizes.borderRadius};
  cursor: pointer;
  transition: background-color 0.4s ease;
  white-space: nowrap;
  &:hover{
    background-color: ${({ theme, negative }) => (negative ? theme.color3 : theme.color2)};
  }
  &:active{
    border-color: ${({ theme }) => theme.color4}
  }
`;

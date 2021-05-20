import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;


export const TextArea = styled.textarea<{ isError:boolean }>`
  min-width: 30em;
  min-height: 13em;
  padding: 1em;
  border: 2px solid ${({ theme, isError }) => (isError ? theme.otherColors.errorBorder : theme.color3)};
  border-radius: ${(props) => props.theme.sizes.buttonBorderRadius};
  resize: none;
  outline:  none;
  white-space: nowrap;
  overflow: auto;
  transition: border-color 0.4s ease;
  &:focus{
    border: 2px solid ${({ theme, isError }) => (isError ? theme.otherColors.errorBorder : theme.color4)};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 0.4em;
  justify-content: space-evenly;
`;

type Props = {
  children?: React.ReactNode;
  currentText: string,
  isError?: boolean
  onChange: (currentText: string) => void
};

export const TextAndButtons = ({
  children, currentText, onChange, isError = false
}:Props) => (
    <Container>
      <TextArea isError={isError} value={currentText} onInput={(event:React.FormEvent<HTMLTextAreaElement>) => onChange(event.currentTarget.value)}/>
      <ButtonsContainer>
        {children}
      </ButtonsContainer>
    </Container>
);



import React, { useContext } from 'react';
import styled from 'styled-components';

import { AppDataContext } from '../state';

const Container = styled.div`
  position: fixed;
  top: 1.5em;
  display: flex;
  flex-direction: column;
`;

const errorItemHeight = '4em';
const ErrorItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5em;
  margin: 0.3em;
  width: 70vw;
  max-height: ${errorItemHeight};
  background-color: ${({ theme }) => theme.color4};
  color: ${({ theme }) => theme.color1};
  border: ${({ theme }) => `${theme.sizes.borderWidth} solid ${theme.color3}`};
  border-radius: ${(props) => props.theme.sizes.borderRadius};
  
`;

const ExclamationMark = styled.div`
  display: flex;
  justify-content: center;
  font-size: 3em;
  width: 1em;
`;

const ErrorText = styled.div`
  max-height: ${errorItemHeight};
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: small;
  padding: 1em;
  overflow: auto;
  
`;
export const Errors = () => {
  const { errors } = useContext(AppDataContext);
  if (errors.length === 0) {
    return null;
  }
  return (
    <Container>
      {
        errors.map(([id, error]) => (
          <ErrorItem key={id}>
            <ExclamationMark>!</ExclamationMark>
            <ErrorText>{error}</ErrorText>
          </ErrorItem>))
      }
    </Container>
  );
};

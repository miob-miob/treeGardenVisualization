import React from 'react';
import styled from 'styled-components';


const width = '8em';
const height = '100%';
const borderWidth = '2px';
const borderColor = 'color2';
const Container = styled.div`
  display: flex;
  margin: 1em;
  align-items: center;
  height: 5em;
`;


const Left = styled.div`
  height: ${height};
  border-top: ${borderWidth} solid ${({ theme }) => theme[borderColor]};
  border-bottom: ${borderWidth} solid ${({ theme }) => theme.color1};
  display: flex;
  width: ${width};
  color: ${({ theme }) => theme.color3};
  
`;

const Right = styled.div`
  height: ${height};
  border-bottom: ${borderWidth} solid ${({ theme }) => theme[borderColor]};
  border-top: ${borderWidth} solid ${({ theme }) => theme.color1};
  display: flex;
  width: ${width};
  color: ${({ theme }) => theme.color3};
`;


const Title = styled.h1`
  display: flex;
  align-items: center;
  height: ${height};
  border-bottom: ${borderWidth} solid ${({ theme }) => theme[borderColor]};
  border-top: ${borderWidth} solid ${({ theme }) => theme[borderColor]};
`;

export const Header = () => (
  <Container>
    <Left/>
      <Title>Tree Garden Explorer</Title>
    <Right/>
  </Container>
);

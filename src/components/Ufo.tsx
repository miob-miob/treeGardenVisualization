import React from 'react';
import styled from 'styled-components';


const UfoContainer = styled.div`
  padding: 1em;
  margin: 1em;
  background-color: #dedeff;
  border: 1px solid #ffddff;
`;


export const UfoComponent = ({ name = 'Defon' }:{ name?:string }) => {
  console.log(name);
  return (
    <UfoContainer>
        <div>{`Ty ses peknej ufon, ${name}`}</div>
    </UfoContainer>
  );
};

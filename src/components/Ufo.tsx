import React from 'react';
import styled from 'styled-components';

// ufo component for debugging :)
const UfoContainer = styled.div`
  padding: 1em;
  margin: 1em;
  background-color: #dedeff;
  border: 2px solid #ff99ff;
`;


export const UfoComponent = ({ name = 'Defon' }:{ name?:string }) => {
  console.log(name);
  return (
    <UfoContainer>
        <div>{`Ty ses peknej ufon, ${name}`}</div>
    </UfoContainer>
  );
};

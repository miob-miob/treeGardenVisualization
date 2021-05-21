import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Button } from './shared/Button';
import { TextAndButtons } from './shared/TextWithButtons';
import { AppDataContext } from '../state';
import { TreeGardenNode } from '../../../treeGarden';

const Container = styled.div`
  //width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  display: flex;
  justify-content: center;
  padding: 0.4em;
  margin-bottom: 0.2em;
  margin-top: 0.2em;
`;

export const TrainedTreeInput = () => {
  const { setCurrentTree, addError } = useContext(AppDataContext);
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState(false);

  const onTreeLoad = () => {
    try {
      setError(false);
      const tree = JSON.parse(rawText);
      setRawText(JSON.stringify(tree, null, 2));
      setCurrentTree(tree as TreeGardenNode);
    } catch (e) {
      addError(`Not valid\n JSON format: ${e}`);
      setError(true);
    }
  };

  const onClear = () => {
    setError(false);
    setCurrentTree(null);
    setRawText('');
  };

  return (
    <Container>
      <Title>Trained Tree</Title>
      <TextAndButtons currentText={rawText} onChange={(text) => setRawText(text)} isError={error}>
        <Button onClick={onTreeLoad}>Load tree</Button>
        <Button onClick={onClear}>Clear</Button>
      </TextAndButtons>
    </Container>

  );
};

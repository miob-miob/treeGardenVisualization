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

export const DataSampleInput = () => {
  const { setCurrentSample, currentTree, addError } = useContext(AppDataContext);
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState(false);

  const onSampleLoad = () => {
    if (!currentTree) {
      setError(true);
      addError('You must load trained tree prior to sample classification!');
      return;
    }
    try {
      setError(false);
      const dataSample = JSON.parse(rawText);
      setRawText(JSON.stringify(dataSample, null, 2));
      setCurrentSample(dataSample as TreeGardenNode);
    } catch (e) {
      addError(`Not valid\n JSON format: ${e}`);
      setError(true);
    }
  };

  const onClear = () => {
    setError(false);
    setCurrentSample(null);
    setRawText('');
  };

  return (
    <Container>
      <Title>Sample to classify</Title>
      <TextAndButtons currentText={rawText} onChange={(text) => setRawText(text)} isError={error}>
        <Button onClick={onSampleLoad}>Classify Sample</Button>
        <Button onClick={onClear}>Clear</Button>
      </TextAndButtons>
    </Container>

  );
};

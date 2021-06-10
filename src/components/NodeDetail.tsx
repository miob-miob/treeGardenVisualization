import React from 'react';
import styled from 'styled-components';
import { TreeGardenNode } from 'tree-garden';
import { getTextsForNode } from '../utils/tree';
import { getMostCommonClassForNode } from '../../../treeGarden/dist/treeNode';
import { ClassesHistogram } from './ClassesHistogram';
import { getSampleCount } from '../utils/helpers';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(p) => p.theme.color4};
`;
const Head = styled.h3`
  padding-bottom: 1em;
  display: flex;
  justify-content: center;
`;

const DetailBody = styled.div`
  display: flex;
  width: 100%;
`;

const dataContainerSize = 60;
const DataContainer = styled.div`
  font-size: small;
  width: ${dataContainerSize}%;
  display: flex;
  flex-direction: column;
`;
const TextFragment = styled.span`
  margin-right: 1em;
`;

const DataRow = styled.div`
  padding-bottom: 1em;
  display: flex;
  justify-content: space-between;
`;

const labelSize = 25;
const DataLabel = styled.div`
  min-width: ${labelSize}%;
  font-weight: bolder;
`;

const DataValue = styled.div`
  min-width: ${100 - labelSize}%;
  display: flex;
  align-items: center;
`;

const ConsideredSplitsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConsideredSplit = styled.div`
  display: flex;
  flex-direction: row;
`;

const ClassHistogramContainer = styled.div`
  width: ${100 - dataContainerSize}%;
`;

type Props = {
  node :TreeGardenNode,
  wholeTree :TreeGardenNode
};

// todo count of samples stat
export const NodeDetail = ({ node, wholeTree }:Props) => (
    <Container>
      <Head>Node detail</Head>
      <DetailBody>
        <DataContainer>
          <DataRow>
            <DataLabel>Node id:</DataLabel>
            <DataValue>{node.id}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Node text:</DataLabel>
            <DataValue>{getTextsForNode(node).map((text) => <TextFragment>{text}</TextFragment>)}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Most common class:</DataLabel>
            <DataValue>{getMostCommonClassForNode(node)}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Number of samples:</DataLabel>
            <DataValue>{getSampleCount(node.classCounts)}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Node depth:</DataLabel>
            <DataValue>{node.depth}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Score of best split:</DataLabel>
            <DataValue>{node.impurityScore}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Children nodes:</DataLabel>
            <DataValue>{node.childNodes ? Object.values(node.childNodes).length : 0}</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>Considered splits:</DataLabel>
            <DataValue>
              <ConsideredSplitsContainer>
                {/* eslint-disable-next-line max-len */}
                {node.bestSplits.map(({ split, score }) => <ConsideredSplit><TextFragment>{split}</TextFragment><TextFragment>{score.toFixed(4)}</TextFragment></ConsideredSplit>)}
              </ConsideredSplitsContainer>
            </DataValue>
          </DataRow>
        </DataContainer>
        <ClassHistogramContainer>
          <ClassesHistogram classCounts={node.classCounts} wholeTree={wholeTree}/>
        </ClassHistogramContainer>
      </DetailBody>

    </Container>
);

import React from 'react';
import { TreeGardenNode } from 'tree-garden';
import styled from 'styled-components';
import { getColorForClass } from '../utils/helpers';


type ClassCounts = TreeGardenNode['classCounts'];


const getSampleCountOfMostCommonClass = (classCounts:ClassCounts) => Math.max(...Object.values(classCounts));
const getClassRatioNormalizedToOne = (classOfInterest:string, classCounts:ClassCounts) => classCounts[classOfInterest] / getSampleCountOfMostCommonClass(classCounts);
const getSortedClassAndRatioPairs = (classCounts:ClassCounts) => Object.keys(classCounts)
  .sort()
  .map((currentClass) => [currentClass, getClassRatioNormalizedToOne(currentClass, classCounts)] as const);


const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistogramContainer = styled.div`
  min-height: 20em;
  display: flex;
  flex-direction: row;
`;

const histogramColumnWidth = 1;
const HistoGramColumn = styled.div`
  padding-left: 0.5em;
  padding-right: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const HistogramBar = styled.div<{ color:string, heightRatio:number }>`
  min-height: ${(p) => p.heightRatio * 100}%;
  width:${histogramColumnWidth}em;
  background-color: ${(p) => p.color};
`;

const HistogramCount = styled.div`
  
`;

const LegendContainer = styled.div`
  
`;


type Props = {
  classCounts: ClassCounts,
  wholeTree:TreeGardenNode // in order to extract all known classes
};
export const ClassesHistogram = ({ classCounts, wholeTree }:Props) => {
  const a = 'v';
  return (
    <MainContainer>
      <HistogramContainer>
        {
          getSortedClassAndRatioPairs(classCounts)
            .map(([currentClass, heightRatio]) => (
              <HistoGramColumn key={currentClass}>
                <HistogramCount>{classCounts[currentClass]}</HistogramCount>
                <HistogramBar heightRatio={heightRatio} color={getColorForClass(wholeTree, currentClass)}/>
              </HistoGramColumn>
            ))
        }
      </HistogramContainer>
      <LegendContainer>
        There will be legend my firend
      </LegendContainer>
    </MainContainer>

  );
};

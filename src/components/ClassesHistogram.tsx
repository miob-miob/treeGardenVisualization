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
  width: 100%;
  height: 100%;
`;

const HistogramContainer = styled.div`
  height: 50%;
  display: flex;
  flex-direction: row;
  //border-bottom: 1px solid ${(p) => p.theme.color3};
`;

const histogramColumnWidth = 1;
const HistoGramColumn = styled.div`
  padding-left: 0.2em;
  padding-right: 0.2em;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const HistogramBar = styled.div<{ color:string, heightRatio:number }>`
  min-height: ${(p) => p.heightRatio * 90}%;
  width:${histogramColumnWidth}em;
  background-color: ${(p) => p.color};
`;

const HistogramCount = styled.div`
  font-size: small;
`;

const LegendContainer = styled.div`
  padding-top: 2em;
  display: flex;
  flex-direction: column;
`;

const LegendRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0.05em;
`;

const LegendBar = styled.div<{ color:string }>`
  height: 0.5em;
  width: 2em;
  background-color: ${(p) => p.color};
  margin-right: 0.2em;
`;

const LegendText = styled.div`
  font-size: small;
`;

type Props = {
  classCounts: ClassCounts,
  wholeTree:TreeGardenNode // in order to extract all known classes
};
export const ClassesHistogram = ({ classCounts, wholeTree }:Props) => (
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
        {Object.keys(classCounts).sort().map((currentClass) => (
          <LegendRow key={currentClass}>
            <LegendBar color={getColorForClass(wholeTree, currentClass)}/>
            <LegendText>{currentClass}</LegendText>
          </LegendRow>
        ))}
      </LegendContainer>
    </MainContainer>

);

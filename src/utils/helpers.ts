import { AlgorithmConfiguration, TreeGardenNode } from 'tree-garden';
import { getLeafNodeOfSample } from 'tree-garden/dist/classifyData';
import { getMostCommonTagOfSamplesInNode } from 'tree-garden/dist/dataSet/replaceMissingValues';
import { TreeGardenDataSample } from 'tree-garden/dist/dataSet';

const randInt = (min: number, max: number) => Math.floor(Math.random() * ((max - min) + 1)) + min;
// eslint-disable-next-line max-len
const randColor = () => `#${randInt(0, 255).toString(16).padStart(2, '0')}${randInt(0, 255).toString(16).padStart(2, '0')}${randInt(0, 255).toString(16).padStart(2, '0')}`;

const classColors = [
  '#cc3300',
  '#00aa00',
  '#0055ff',
  '#880088',
  '#9999ff',
  '#ffaa11',
  '#ffee11'
];

// if there are more then 1000 classes in data set we have problem houston ;)
while (classColors.length < 1000) {
  classColors.push(randColor());
}

export const getColorForClass = (tree:TreeGardenNode, currentClass:string) => {
  const classes = Object.keys(tree.classCounts).sort();
  const classColorHash = Object.fromEntries(classes.map((klass, index) => [klass, classColors[index]]));
  return classColorHash[currentClass];
};


export const getSampleCount = (classCounts:TreeGardenNode['classCounts']) => Object.values(classCounts).reduce((acc, current) => acc + current, 0);

// as we do not have algorithm configuration here we must improvise bit ;)
const attributeConfigProxy = new Proxy({}, {
  get: () => ({ missingValue: undefined })
});
const algorithmConfigTraps = {
  get: (target:any, propName:string, receiver:any) => {
    if (propName === 'attributes') {
      return attributeConfigProxy;
    }
    return Reflect.get(target, propName, receiver);
  }
};

const algorithmConfigProxy = new Proxy({
  getTagOfSampleWithMissingValueWhileClassifying: getMostCommonTagOfSamplesInNode
}, algorithmConfigTraps);

export const getNodeIdsOfProjectedSample = (
  tree: TreeGardenNode,
  sample:TreeGardenDataSample
) => getLeafNodeOfSample(sample, tree, algorithmConfigProxy as AlgorithmConfiguration, true);

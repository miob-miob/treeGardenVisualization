import { TreeGardenNode } from '../../../treeGarden';

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

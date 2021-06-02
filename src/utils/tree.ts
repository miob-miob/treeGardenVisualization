import { getTreeStages, TreeGardenNode } from 'tree-garden/dist/treeNode';

type TreeStages = ReturnType<typeof getTreeStages>;

type TwoPoints = {
  x0:number,
  y0:number,
  x1:number,
  y1:number
};
type TreeNode = TwoPoints & {
  nodeId:string,
  childEdge:{
    x:number,
    y:number
  },
  parentEdge:{
    x:number,
    y:number
  }
  textBoundary:TwoPoints
};
type NodeToNodeEdge = TwoPoints;

type VisualizationTreeData = {
  treeNodes : TreeNode[],
  edges: NodeToNodeEdge[]
};


const maxX = 1000;
const maxY = 1000;
const xOffset = 50;
const yOffset = 50;

const getNumberOfStages = (treeStages:TreeStages) => treeStages.length;
const getMaximalNumberOfNodesOnStage = (treeStages:TreeStages) => Math.max(...treeStages.map((stage) => stage.flat(2).length));
const getMaximalNumberOfGaps = (treeStages:TreeStages) => Math.max(...treeStages.map((stage) => stage.length));

const gapBetweenNodes = 1;
const gapBetweenGroups = 2;
const edge = 4;
const nodeHeight = 1;
const nodeWidth = 5;

export const getDataForVisualization = (tree:TreeGardenNode) => {
  const stages = getTreeStages(tree);

  const numberOfStages = getNumberOfStages(stages);
  const maxNumberOfNodesInStage = getMaximalNumberOfNodesOnStage(stages);
  const maxNumberOfGapsInStage = getMaximalNumberOfGaps(stages);

  // eslint-disable-next-line max-len
  const xPartitions = nodeWidth * (maxNumberOfNodesInStage) + gapBetweenNodes * (maxNumberOfNodesInStage - 1 - maxNumberOfGapsInStage) + maxNumberOfGapsInStage * gapBetweenGroups;
  const yPartitions = edge * (numberOfStages - 1) + numberOfStages * nodeHeight;

  const xPartitionSize = (maxX - 2 * xOffset) / xPartitions;
  const yPartitionSize = (maxY - 2 * yOffset) / yPartitions;

  const result = getTreeStages(tree);
  return result;
};


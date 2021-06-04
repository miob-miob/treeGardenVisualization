import { getMostCommonClassForNode, getTreeStages, TreeGardenNode } from 'tree-garden/dist/treeNode';
import { getColorForClass } from './classColors';

type TreeStages = ReturnType<typeof getTreeStages>;

type TwoPoints = {
  x0:number,
  y0:number,
  x1:number,
  y1:number
};
type TreeNode = TwoPoints & {
  highlighted:boolean,
  color?:string,
  textBoundary:TwoPoints,
  data: TreeGardenNode
};
type NodeToNodeEdge = TwoPoints & {
  textCenter:{
    x:number,
    y:number
  }
};

type VisualizationTreeData = {
  treeNodes : TreeNode[],
  edges: NodeToNodeEdge[]
};


const maxX = 1000;
const maxY = 1000;
const xOffset = 0;
const yOffset = 15;

const getNumberOfStages = (treeStages:TreeStages) => treeStages.length;
const getMaximalNumberOfNodesOnStage = (treeStages:TreeStages) => Math.max(...treeStages.map((stage) => stage.flat(2).length));
const getMaximalNumberOfGaps = (treeStages:TreeStages) => Math.max(...treeStages.map((stage) => stage.length));

const gapBetweenNodes = 1;
const gapBetweenGroups = 2;
const edge = 2;
const nodeHeight = 2;
const nodeWidth = 5;

const textOffsetX = 0.1;
const textOffsetY = 0.1;

export const getDataForVisualization = (tree:TreeGardenNode):VisualizationTreeData => {
  try {
    const stages = getTreeStages(tree);

    const numberOfStages = getNumberOfStages(stages);
    const maxNumberOfNodesInStage = getMaximalNumberOfNodesOnStage(stages);
    const maxNumberOfGapsInStage = getMaximalNumberOfGaps(stages);

    // +2 gabs for gabs on ends
    // eslint-disable-next-line max-len
    const xPartitions = nodeWidth * (maxNumberOfNodesInStage) + gapBetweenNodes * (maxNumberOfNodesInStage - 1 - maxNumberOfGapsInStage) + (maxNumberOfGapsInStage + 2) * gapBetweenGroups;
    const yPartitions = edge * (numberOfStages - 1) + numberOfStages * nodeHeight;

    const usableX = maxX - 2 * xOffset;
    const usableY = maxY - 2 * yOffset;

    const xPartitionSize = (usableX) / xPartitions;
    const yPartitionSize = (usableY) / yPartitions;
    let currentY = yOffset;

    const nodesToDraw:TreeNode[] = [];
    const edgesToDraw:NodeToNodeEdge[] = [];
    stages.forEach((stage, stageIndex) => {
      const occupiedSpaceOnStage = stage.reduce((acc, currentGroup) => {
        const len = currentGroup.length;
        return acc + (len * nodeWidth + (len - 1) * gapBetweenNodes) * xPartitionSize;
      }, 0);

      // insert gap between groups
      const groupsWithGaps = stage.flatMap((group) => ['gap' as const, group]);

      groupsWithGaps.push('gap');
      const gapSize = (usableX - occupiedSpaceOnStage) / (stage.length + 1);
      const nodeWidthAbsolute = nodeWidth * xPartitionSize;
      const nodeHeightAbsolute = nodeHeight * yPartitionSize > nodeWidthAbsolute ? nodeWidthAbsolute : nodeHeight * yPartitionSize;
      const textOffsetAbsoluteX = nodeWidthAbsolute * textOffsetX;
      const textOffsetAbsoluteY = nodeHeightAbsolute * textOffsetY;
      let currentX = xOffset;


      groupsWithGaps.forEach((groupOrGap) => {
        if (groupOrGap === 'gap') {
          currentX += gapSize;
        } else {
          groupOrGap.forEach((node, nodeIndex) => {
            // push nodes
            const nodeVisualData = {
              color: node.isLeaf ? getColorForClass(tree, getMostCommonClassForNode(node)) : undefined,
              highlighted: false,
              x0: currentX,
              x1: currentX + nodeWidthAbsolute,
              y0: currentY,
              y1: currentY + nodeHeightAbsolute,
              textBoundary: {
                x0: currentX + textOffsetAbsoluteX,
                x1: currentX + nodeWidthAbsolute - textOffsetAbsoluteX,
                y0: currentY + textOffsetAbsoluteY,
                y1: currentY + nodeHeightAbsolute - textOffsetAbsoluteY
              },
              data: node
            };
            nodesToDraw.push(nodeVisualData);
            // push edges if not first stage
            if (stageIndex > 0) {
              const parentForNode = nodesToDraw.find((alreadyDrawnNodes) => node.parentId === alreadyDrawnNodes.data.id);
              const edgeX0 = parentForNode!.x0 + nodeWidthAbsolute / 2;
              const edgeX1 = nodeVisualData.x0 + nodeWidthAbsolute / 2;
              const edgeY0 = parentForNode!.y1;
              const edgeY1 = nodeVisualData.y0;
              edgesToDraw.push({
                x0: edgeX0,
                x1: edgeX1,
                y0: edgeY0,
                y1: edgeY1,
                textCenter: {
                  x: Math.min(edgeX0, edgeX1) + Math.abs(edgeX1 - edgeX0) / 2,
                  // in case of y we know which is bigger - second
                  y: edgeY0 + (edgeY1 - edgeX0) / 2
                }
              });
            }
            // increment x node width
            currentX += nodeWidthAbsolute;
            // all except last node in group must have gap
            if (nodeIndex < groupOrGap.length - 1) {
              currentX += gapBetweenNodes * xPartitionSize;
            }
          });
        }
      });

      currentY += (nodeHeight + edge) * yPartitionSize;
    });
    return { treeNodes: nodesToDraw, edges: edgesToDraw };
  } catch (e) {
    throw new Error(`Provided tree is not valid: ${e}`);
  }
};


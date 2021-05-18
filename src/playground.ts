import ReactDom from 'react-dom';
import { buildAlgorithmConfiguration } from 'tree-garden';
import { TreeGardenVisualization } from './index';

console.log(buildAlgorithmConfiguration);
const body = document.getElementsByTagName('body')[0];
const playgroundContainer = document.createElement('div');


playgroundContainer.id = 'appContainer';

body.appendChild(playgroundContainer);
ReactDom.render(TreeGardenVisualization(), playgroundContainer);

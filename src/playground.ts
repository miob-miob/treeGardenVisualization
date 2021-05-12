import ReactDom from 'react-dom';
import { TreeGardenVisualization } from './index';

console.log(TreeGardenVisualization, 'kunceeeeeekunde');

const body = document.getElementsByTagName('body')[0];
const playgroundContainer = document.createElement('div');


playgroundContainer.id = 'appContainer';

body.appendChild(playgroundContainer);
ReactDom.render(TreeGardenVisualization(), playgroundContainer);

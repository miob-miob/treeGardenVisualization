import ReactDom from 'react-dom';
import { Board } from './index';

const body = document.getElementsByTagName('body')[0];
const playgroundContainer = document.createElement('div');


playgroundContainer.id = 'appContainer';

body.appendChild(playgroundContainer);
ReactDom.render(Board(), playgroundContainer);

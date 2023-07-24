import React from 'react'
import ReactDOM from 'react-dom'
import {Board} from './src'


const App = () => {
  return <>
    <h1>cussSSSSSSS</h1>
    <Board/>
  </>
}

const container = document.getElementById('root');
// @ts-ignore seems types are not ready for react dom 18
const root = ReactDOM.createRoot(container);
root.render(
  <App/>
);

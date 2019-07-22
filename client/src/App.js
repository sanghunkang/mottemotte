import React from 'react';
import './App.css';

import { Grid } from 'semantic-ui-react'
import MenuBar from './MenuBar';
import VisualizationView from './VisualizationView';

function App() {
  return (
    <div className="App">
      <div className="App-header" >
        Mottemotte
      </div>
      <MenuBar />
      <VisualizationView />
    </div>
  );
}

export default App;

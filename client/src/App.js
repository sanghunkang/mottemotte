import React from 'react';
import './App.css';

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

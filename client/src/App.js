import React from 'react';
import './App.css';

import MenuBar from './MenuBar';
import VisualizationView from './VisualizationView';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          Mottemotte
      </header>
      <MenuBar />
      <VisualizationView />
    </div>
  );
}

export default App;

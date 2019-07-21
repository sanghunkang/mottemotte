import React, {useState} from 'react';

import BarChart from './BarChart'
import './VisualizationView.css'



// Functional React Components
function VisualizationView() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count+1);
  }
  
  return(
    <div className="VisualizationView">
      <div
        onClick={handleClick}>
        Vis View {count}
      </div>
      <BarChart />
    </div>
  );
}

export default VisualizationView;

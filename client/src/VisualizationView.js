import React, {useState} from 'react';
import { Grid, Input, Label, Button } from 'semantic-ui-react'

import BarChart from './BarChart'
import './VisualizationView.css'

// Functional React Components
function VisualizationView() {
  const [plannedStartTime, setPlannedStartTime] = useState(new Date());
  const [plannedEndTime, setPlannedEndTime] = useState(new Date());

  function handleClickBox(e) {
    console.log('prop triggered by higher order component', e);
    setPlannedStartTime(e.plannedStartTime);
    setPlannedEndTime(e.plannedEndTime);
  }
  
  return(
    <div className="VisualizationView container">
      <ItemAdder
        plannedStartTime={plannedStartTime}
        plannedEndTime={plannedEndTime}/>
      <BarChart 
        handleClickBox={handleClickBox}/>
    </div>
  );
}

function ItemAdder(props) {
  function handleSumbit() {
    let apiParams = {};
    fetch('/api/insertItem', apiParams)
      .then((res)=> res.json())
      .then((res)=> {
        console.log(res);
      })
      .catch((err)=> console.log(err));
  }

  return(
    <Grid className="ItemAdder">
      
      <TimeInputRow 
        timeType="Planned Start Time"
        time={props.plannedStartTime}/>
      <TimeInputRow 
        timeType="Planned End Time"
        time={props.plannedEndTime}/>
    </Grid>
  );
}

function TimeInputRow(props) {
  return(
    <Grid.Row className="ItemAdderRow">
      <Grid.Column width={3}>
        {props.timeType}
      </Grid.Column>
      <Grid.Column width={2}>
        <Input 
          type="text"
          fluid="true"
          size="mini"
          value={props.time}>
          {/* <Button icon='left chevron'></Button> */}
          <input />
          {/* <Button icon='right chevron'></Button> */}
        </Input>
      </Grid.Column>
    </Grid.Row>
  );
}

export default VisualizationView;

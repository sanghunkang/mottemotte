import React, {useState} from 'react';
import { Grid, Input, Label, Button } from 'semantic-ui-react'

import BarChart from './BarChart'
import './VisualizationView.css'

function getYear() {

}


// Functional React Components
function VisualizationView() {
  const [plannedStartTime, setPlannedStartTime] = useState(new Date());
  const [plannedEndTime, setPlannedEndTime] = useState(new Date());
  const [actualStartTime, setActualStartTime] = useState(new Date());


  const [duration, setDuration] = useState(30)
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const [category3, setCategory3] = useState('');


  function handleClickBox(e) {
    console.log('prop triggered by higher order component', e);
    setPlannedStartTime(e.plannedStartTime);
    setPlannedEndTime(e.plannedEndTime);
    setActualStartTime(e.actualStartTime);
    setDuration(e.duration);
    setCategory1(e.category1);
    setCategory2(e.category2);
    setCategory3(e.category3);

  }
  
  return(
    <div className="VisualizationView container">
      <ItemAdder
        plannedStartTime={plannedStartTime}
        plannedEndTime={plannedEndTime}
        actualStartTime={actualStartTime}
        duation={duration}
        category1={category1}
        category2={category2}
        category3={category3}/>
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
      <Grid.Row className="ItemAdderHeader">
        <Grid.Column width={2}>Place for Label</Grid.Column>
        <Grid.Column width={2}>YYYY-MM-DD</Grid.Column>
        <Grid.Column width={2}>HH-MM</Grid.Column>
        <Grid.Column width={2}>Duration</Grid.Column>
        <Grid.Column width={2}>Category1</Grid.Column>
        <Grid.Column width={2}>Category2</Grid.Column>
        <Grid.Column width={2}>Category3</Grid.Column>
      </Grid.Row>

      <Grid.Row className="ItemAdderRow">
        <Grid.Column width={2}>
          Planned
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            type="text"
            fluid="true"
            size="mini"
            value={props.plannedStartTime.toLocaleDateString()}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            type="text"
            fluid="true"
            size="mini"
            value={props.plannedStartTime.toLocaleTimeString()}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            fluid="true"
            size="mini"
            value={props.duation}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            fluid="true"
            size="mini"
            value={props.category1}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            fluid="true"
            size="mini"
            value={props.category2}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            fluid="true"
            size="mini"
            value={props.category3}>
          </Input>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row className="ItemAdderRow">
        <Grid.Column width={2}>
          Actual
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            type="text"
            fluid="true"
            size="mini"
            value={props.actualStartTime.toLocaleDateString()}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            type="text"
            fluid="true"
            size="mini"
            value={props.actualStartTime.toLocaleTimeString()}>
          </Input>
        </Grid.Column>
        <Grid.Column width={2}>
          <Input 
            fluid="true"
            size="mini"
            value={props.duation}>
          </Input>
        </Grid.Column>
        <Grid.Column width={6}>
          Some other things
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}


export default VisualizationView;

import * as d3 from "d3";
import React, { useState, useEffect } from 'react';

import './BarChart.css'

// Parsers/formatters
function processData(data) {
  let dateIndex = 0;
  let dailyStartTime = 0;
  let previousDuration = 0;
  let previousDate = new Date(data[0].planned_start_time).getDate();
  
  let processedData = data.map((row)=> {
    let plannedStartTime = new Date(row.planned_start_time);
    let plannedEndTime = new Date(row.planned_end_time);
    
    // Check if we have to stack or proceed to next date
    console.log(previousDate, plannedStartTime.getDate());
    if (previousDate === plannedStartTime.getDate()) {
      dailyStartTime += previousDuration;
    } else {
      dateIndex += 1;
      dailyStartTime = 0;
    }
    previousDate = plannedStartTime.getDate()
    previousDuration = (plannedEndTime.getTime() - plannedStartTime.getTime())/60000;

    return {
      dailyStartTime: dailyStartTime,
      duration: previousDuration,
      dateIndex: dateIndex 
    };
  });
  
  return processedData;
}

let stride = 15;

// Functional Components
function BarChart() {
  const [data, setData] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [sumDeltaX, setSumDeltaX] = useState(0);
  const [sumDeltaY, setSumDeltaY] = useState(0);
  const [willChangeDataRange, setWillChangeDataRange] = useState(false);

  useEffect(() => {    
    let apiParams = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    };
    fetch('/api/getData', apiParams)
      .then((res)=> res.json())
      .then((res)=> setData(processData(res)))
      .catch((err)=> console.log(err));
    
  }, [willChangeDataRange]);

  useEffect(()=> {
    updateBarChart(data, zoom);
  }, [data, zoom]);

  
  function handleWheel(e) {
    // Horizontal scroll
    if (sumDeltaX < -stride || stride < sumDeltaX ) {
      indexStart += sumDeltaX < 0? -1: 1;
      setSumDeltaX(0);
    } else if (indexStart !== 0 && e.deltaX < 0) { // Lower bound
      setSumDeltaX(sumDeltaX + e.deltaX);
    } else if (indexStart !== data.length - stride &&  0 < e.deltaX) { // Upper bound
      setSumDeltaX(sumDeltaX + e.deltaX);
    }
    
    // Vertical scroll
    if (sumDeltaY < -200 || 200 < sumDeltaY ) {
      if (1 < zoom && sumDeltaY < 0) { // Lower bound
        setZoom(Math.abs(zoom - 1));
      } else if (zoom < 10 && 0 < sumDeltaY ) { // Upper bound
        setZoom(Math.abs(zoom + 1));
      }
      setSumDeltaY(0);
    } else {
      setSumDeltaY(sumDeltaY + e.deltaY);
    }
  }

  return(
    <svg
      onWheel={handleWheel}
      className="BarChart">
    </svg>
  );
}



// d3 functions
function updateBarChart(data, zoom) {
  const svg = d3.select(".BarChart");
  if (zoom < 10) {
    range = Math.min(parseInt(range/zoom*10), 50);
  } else if (10 <= zoom) {
    range = Math.max(parseInt(range/zoom*10), 14);
  }

  // updateBoxes(svg, data.slice(indexStart,indexStart+range), zoom);
  // updateDateIndeces(svg, [...Array(range).keys()], indexStart, zoom);
  updateBoxes(svg, data, zoom);
  updateDateIndeces(svg, [...Array(data.length).keys()], indexStart, zoom);
}

let indexStart = 0;
let range = 14;

let h = 500;
let xCoeff = 50;
let yCoeff = 3;

function updateBoxes(svg, data, zoom=10) {
  svg.selectAll(".Box")
    .remove();

  svg.selectAll(".Box")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "Box")
    .attr("x", (d, i) => d.dateIndex * 70*zoom/10)
    .attr("y", (d, i) => h - (d.duration+d.dailyStartTime) *yCoeff*zoom/10)
    .attr("width", xCoeff*zoom/10)
    .attr("height", (d, i) => (d.duration*yCoeff*zoom/10))
    .attr('fill', "green")
    .on('click', onClickItem)
    .on('mouseenter', onMouseEnterItem)
    .on('mouseleave', onMouseLeaveItem);
};

const HIGHLIGHT_ON = 'yellow';
const HIGHLIGHT_OFF = 'green';

const languagePack = {
  day: '일'
}

// Event Handlers
var onClickItem = function() {
  return function() {
    d3.select('.clicked')
      .classed('clicked', false)
      .attr('fill', HIGHLIGHT_OFF);
    
    d3.select(this)
      .classed('clicked', true)
      .attr('fill', 'magenta');
  }
}();

var onMouseEnterItem = function() {
  return function() {
    if (this.classList.contains('clicked') === false) {
      d3.select(this)
        .attr('fill', HIGHLIGHT_ON)
    }
  }
}();

var onMouseLeaveItem = function(){
  return function() {
    if (this.classList.contains('clicked') === false) {
      d3.select(this)
        .attr('fill', HIGHLIGHT_OFF)
    }
  }
}();


var updateDateIndeces = function() {
  return function(svg, data, indexStart, zoom) {  
    svg.selectAll(".DateIndex")
      .remove();

    svg.selectAll(".DateIndex")
      .data(data)
      .enter()
      .append("text")
      .attr("class", 'DateIndex')
      .text((d) => (d + indexStart + 1) + languagePack.day)
      .attr("x", (d, i) => i * 70*zoom/10)
      .attr("y", (d, i) => h)
  }
}();

export default BarChart;
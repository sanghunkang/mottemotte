import * as d3 from "d3";
import {
  scaleLinear,
  scaleTime,
  scaleOrdinal,
  schemeCategory10,
} from 'd3-scale';

// import { axis } from 'd3-axis';

import React, { useEffect, useState, useRef } from 'react';

import './BarChart.css'

function getDayDifference(date1, date2) {
  let d1 = Math.floor(date1.getTime()/(60000*24*60));
  let d2 =Math.floor(date2.getTime()/(60000*24*60));
  return d1-d2;
}

function normalizeTime(date) {
  let hour = date.getHours();
  let minute = date.getMinutes();
  return (hour*60+minute)/(24*60);
}

// Parsers/formatters
function processData(data, height, width) {
  // console.log(data);
  let currentTime = new Date();
  let yStacked = 0;
  let previousDate = new Date(data[0].planned_start_time).getDate();
  
  let processedData = data.map((row, i)=> {
    // console.log(row);
    let plannedStartTime = new Date(row.planned_start_time);
    let plannedEndTime = new Date(row.planned_end_time);
    let actualStartTime = new Date(row.actual_start_time);
    
    // Check if we have to stack or proceed to next date
    let heightBox = height*Math.max(0.01, (normalizeTime(plannedEndTime) - normalizeTime(plannedStartTime)));
    if (previousDate === plannedStartTime.getDate()) {
      yStacked += heightBox;
    } else {
      yStacked = 0;
    }
    previousDate = plannedStartTime.getDate()

    return {
      // Graph attributes
      x: 75 - getDayDifference(currentTime, plannedStartTime),
      y: yStacked - heightBox,
      height: heightBox,
      
      boxID: i,
      plannedStartTime: plannedStartTime,
      plannedEndTime: plannedEndTime,
      duration: (plannedEndTime.getTime() - plannedStartTime.getTime())/60000,
      
      actualStartTime: actualStartTime,

      category1: row.category_1,
      category2: row.category_2,
      category3: row.category_3,
    };
  });

  return processedData;
}

let stride = 15;

// Functional Components
function VerticalScale(props) {

  var margin = {top:0, left:20, bottom:50, right:50 }

  useEffect(() => {
    var svg = d3.select('.VerticalScale')
    var yScale = d3.scaleLinear()
    var yAxisCall = d3.axisLeft()
                
    yScale.domain([0,24]).range([0, props.height]);   
    yAxisCall.scale(yScale).ticks(24) ;   
    
    svg.selectAll(".yaxis")
      .remove();

    svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate("+[margin.left, margin.top]+")")
      .call(yAxisCall)
    // svg.call(axisScale);
    console.log('Scale initiated');
  }); 
  

  return(
    <svg
      className="VerticalScale">
      VerticalScale
    </svg>
  )
}

function HorizontalScale(props) {
  return(
    <svg
      className="HorizontalScale">
      VerticalScale
    </svg>
  )
}

function Corner(props) {
  return(
    <div>
      Random Place
    </div>
  )
}

function BarChart(props) {
  const ref = useRef(null);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [data, setData] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [sumDeltaX, setSumDeltaX] = useState(0);
  const [sumDeltaY, setSumDeltaY] = useState(0);


  useEffect(() => {
    setWidth(ref.current.clientWidth);
    setHeight(ref.current.clientHeight);
    updateHorizontalGrid(height, width);
  }, [width, height]); 
  
  useEffect(() => {    
    let apiParams = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    };
    fetch('/api/getData', apiParams)
      .then((res)=> res.json())
      .then((res)=> setData(processData(res, height, width)))
      .catch((err)=> console.log(err));
  }, [width, height]);

  useEffect(()=> {
    updateBarChart(data, zoom);
  }, [data, zoom]);

  let indexStart = 0;
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
        setZoom(Math.abs(zoom*0.9));
      } else if (zoom < 10 && 0 < sumDeltaY ) { // Upper bound
        setZoom(Math.abs(zoom*1.1));
      }
      setSumDeltaY(0);
    } else {
      setSumDeltaY(sumDeltaY + e.deltaY);
    }
  }

  function handleClick(e) {
    if (e.target.getAttribute('class') === 'Box clicked') {
      let boxID = e.target.getAttribute("id");
      props.handleClickBox(data[boxID]);
    }

  }

  return(
    <div className="BarChart">
      <VerticalScale
          height={height}/>
        <svg
          ref={ref}
          className="Chart"
          onWheel={handleWheel}
          onClick={handleClick}>
        </svg>
      {/* </div> */}
      {/* <div> */}
        <Corner />
        <HorizontalScale 
          width={width}/>
      {/* </div> */}
    </div>
  );
}




let range = 14;
let h = 400;
let xCoeff = 100;

// d3 functions
function updateBarChart(data, zoom) {
  const svg = d3.select(".Chart");
  if (zoom < 10) {
    range = Math.min(parseInt(range/zoom*10), 50);
  } else if (10 <= zoom) {
    range = Math.max(parseInt(range/zoom*10), 14);
  }
  
  updateBoxes(svg, data, zoom);
  // updateDateIndeces(svg, [...Array(data.length).keys()], zoom);
  updateDateIndeces(svg, d3.range(data.length), zoom);
}

function updateHorizontalGrid(height, width) {
  console.log(height, width);
  let numGridRow = 24;
  const svg = d3.select(".Chart");
  svg.selectAll(".hlines")
    .remove();
  
  svg.selectAll(".hlines")
    .data(d3.range(numGridRow))
    .enter()
    .append("line")
    .attr("class", "hlines")
		.attr("x1", 0)
    .attr("y1", (d, i)=> height*(i+1)/numGridRow)
    .attr("x2", width)
    .attr("y2", (d, i)=> height*(i+1)/numGridRow);
}

function updateBoxes(svg, data, zoom=10) {
  svg.selectAll(".Box")
    .remove();

  svg.selectAll(".Box")
    .data(data)
    .enter()
    .append("rect")
    .attr("id", (d, i)=> d.boxID)
    .attr("class", "Box")
    .attr("x", (d, i) => d.x * xCoeff*1.2*zoom/10)
    .attr("y", (d, i) => d.y)
    .attr("width", xCoeff*zoom/10)
    .attr("height", (d, i) => d.height)//(d.duration*yCoeff*zoom/10))
    .attr('fill', "green")
    .on('click', onClickItem)
    .on('mouseenter', onMouseEnterItem)
    .on('mouseleave', onMouseLeaveItem);
};

function updateDateIndeces(svg, data, zoom) {  
  svg.selectAll(".DateIndex")
    .remove();

  svg.selectAll(".DateIndex")
    .data(data)
    .enter()
    .append("text")
    .attr("class", 'DateIndex')
    .style("font", "5px times")
    .text((d) => (d + 1) + languagePack.day)
    .attr("x", (d, i) => i * 70*zoom/10)
    .attr("y", (d, i) => h-30)
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




export default BarChart;
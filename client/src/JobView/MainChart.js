import * as d3 from "d3";
import React, { useEffect, useState, useRef } from 'react';

import './MainChart.css';

let range = 14;
let xCoeff = 100;

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

// d3 functions
function updateBarChart(data, zoom) {
  const svg = d3.select(".MainChart");
  if (zoom < 10) {
    range = Math.min(parseInt(range/zoom*10), 50);
  } else if (10 <= zoom) {
    range = Math.max(parseInt(range/zoom*10), 14);
  }
  
  updateBoxes(svg, data, zoom);
  // updateDateIndeces(svg, [...Array(data.length).keys()], zoom);
}

function updateHorizontalGrid(height, width) {
  console.log(height, width);
  let numGridRow = 24;
  const svg = d3.select(".MainChart");
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

const HIGHLIGHT_ON = 'yellow';
const HIGHLIGHT_OFF = 'green';

function MainChart(props) {
  const ref = useRef(null);
  
  const [zoom, setZoom] = useState(1);
  const [sumDeltaX, setSumDeltaX] = useState(0);
  const [sumDeltaY, setSumDeltaY] = useState(0);

  useEffect(()=> {
    console.log(props.data);
    updateBarChart(props.data, 1);
    updateHorizontalGrid(props.height, props.width);
  }, [props.data]);

  let stride = 15;
  let indexStart = 0;
  function handleWheel(e) {
    // Horizontal scroll
    if (sumDeltaX < -stride || stride < sumDeltaX ) {
      indexStart += sumDeltaX < 0? -1: 1;
      setSumDeltaX(0);
    } else if (indexStart !== 0 && e.deltaX < 0) { // Lower bound
      setSumDeltaX(sumDeltaX + e.deltaX);
    } else if (indexStart !== props.data.length - stride &&  0 < e.deltaX) { // Upper bound
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
      props.handleClickBox(props.data[boxID]);
    }
  }

  return(
    <svg
      ref={ref}
      className="MainChart"
      onWheel={handleWheel}
      onClick={handleClick}>
    </svg>
  )
}

export default MainChart;
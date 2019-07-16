import * as d3 from "d3";
import React, {useEffect} from 'react';

import './VisualizationView.css'

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

// d3 rendering functions
// Closure contexts with dependencies on browsers
let h = 500;


var drawItemBoxes = function() {
  return function(svg, data, zoom=1) {
    svg.selectAll(".Box")
      .remove();

    console.log(65 * zoom);
    svg.selectAll(".Box")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "Box")
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - 10 * d)
      .attr("z", (d, i) => 1)
      .attr("width", (65 * zoom))
      .attr("height", (d, i) => d * 10)
      .attr('fill', "green");
  }
}();

var addDateIndeces = function() {
  return function(svg, data, indexStart) {  
    svg.selectAll(".DateIndex")
      .remove();

    svg.selectAll(".DateIndex")
      .data(data)
      .enter()
      .append("text")
      .attr("class", 'DateIndex')
      .text((d) => (d + indexStart + 1) + languagePack.day)
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h)
      .attr("z", (d, i) => 999);
  }
}();

// Functional React Components
function VisualizationView() {
  useEffect(() => drawChart()); 
  
  return(
    <div className="VisualizationView">
      Vis View
      <svg className="BarChart" />
    </div>
  );
}

function drawChart() {
  let data = [12, 5, 6, 6, 9, 10, 2, 3, 6, 3, 3, 3, 6, 3, 4, 3, 2, 12, 11, 32, 12, 32, 15];

  
  let indexStart = 0;
  let range = 14;
  let stride = 15;
  let sumDeltaX = 0;
  let sumDeltaY = 0;
  let zoom = 0;
  
  const svg = d3.select(".BarChart");
  drawItemBoxes(svg, data.slice(indexStart,indexStart+range));
  addDateIndeces(svg, [...Array(range).keys()], indexStart);
  addEventHandlers(svg);                  
  
  svg.on('mousewheel', ()=> {
    // Event handling for horizontal scroll
    if (sumDeltaX < -stride || stride < sumDeltaX ) {
      indexStart += sumDeltaX < 0? -1: 1;
      drawItemBoxes(svg, data.slice(indexStart,indexStart+range));
      addDateIndeces(svg, [...Array(range).keys()], indexStart);
      addEventHandlers(svg);
      sumDeltaX = 0;
    } 

    if (indexStart !== 0 && d3.event.deltaX < 0) { // Lower bound
      sumDeltaX += d3.event.deltaX;
    } else if (indexStart !== data.length - stride &&  0 < d3.event.deltaX) { // Upper bound
      sumDeltaX += d3.event.deltaX;
    }

    // Event handling for vertical scroll
    if (sumDeltaY < -200 || 200 < sumDeltaY ) {
      console.log(sumDeltaY);
      zoom += sumDeltaY < 0? 0.1: 0.1;
      drawItemBoxes(svg, data.slice(indexStart,indexStart+range), zoom);
      addDateIndeces(svg, [...Array(range).keys()], indexStart);
      addEventHandlers(svg);
      sumDeltaY = 0;
    }
    sumDeltaY += d3.event.deltaY;

  });
  

//   svg.selectAll("text")
//     .data(data)
//     .enter()
//     .append("text")
//     .text((d) => d)
//     .attr("x", (d, i) => i * 70)
//     .attr("y", (d, i) => h - (10 * d) - 3);
}
 



// function drawItemBoxes(svg, data, w, h) {
//   svg.selectAll(".Box")
//     .remove();

//   svg.selectAll(".Box")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("class", "Box")
//     .attr("x", (d, i) => i * 70)
//     .attr("y", (d, i) => h - 10 * d)
//     .attr("z", (d, i) => 1)
//     .attr("width", 65)
//     .attr("height", (d, i) => d * 10)
//     .attr('fill', "green");
// }

function addEventHandlers(svg) {
  svg.selectAll('.Box')
    .on('click', onClickItem)
    .on('mouseenter', onMouseEnterItem)
    .on('mouseleave', onMouseLeaveItem)
    
}



export default VisualizationView;

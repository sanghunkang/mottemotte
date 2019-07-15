import * as d3 from "d3";
import React, {useState, useEffect} from 'react';

import './VisualizationView.css'

const HIGHLIGHT_ON = 'yellow';
const HIGHLIGHT_OFF = 'green';

const languagePack = {
  day: '일'
}
// var toggleColor = (()=>{
//   var currentColor = "green";
//   return function() {
//     console.log(this);
//     let y = d3.select(this).attr("y");
//     currentColor = currentColor === "green" ? "magenta" : "green";
//     d3.select(this)
//       .attr('fill', currentColor)
//       .attr("y", 100);
//   }
// })();

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

var onMouseEnterItem = function(){
  return function() {
    if (this.classList.contains('clicked') === false) {
      d3.select(this)
        .attr('fill', HIGHLIGHT_ON)
    }
  }
}();

var onMouseLeaveItem = function(){
  return function() {
    // console.log(this.classList.contains('clicked'))
    if (this.classList.contains('clicked') === false) {
      d3.select(this)
        .attr('fill', HIGHLIGHT_OFF)
    }
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
  let w = 700;
  let h = 500;

  
  let indexStart = 0;
  let range = 14;
  let stride = 15;
  let sumDeltaX = 0;
  
  
  const svg = d3.select(".BarChart");
  drawItemBoxes(svg, data.slice(indexStart,indexStart+range), w, h);
  addDateIndeces(svg, [...Array(range).keys()], w, h, indexStart);
  addEventHandlers(svg);                  
  
  // svg.on('mousewheel', onMouseMoveBoard(svg, data));
  svg.on('mousewheel', ()=> {
    if (sumDeltaX < -stride || stride < sumDeltaX ) {
      console.log(data.slice(indexStart,indexStart+range));
      indexStart += sumDeltaX < 0? -1: 1;
      drawItemBoxes(svg, data.slice(indexStart,indexStart+range), w, h);
      addDateIndeces(svg, [...Array(range).keys()], w, h, indexStart);
      addEventHandlers(svg);
      sumDeltaX = 0;
    } 

    if (indexStart !== 0 && d3.event.deltaX < 0) { // Lower bound
      sumDeltaX += d3.event.deltaX;
    } else if (indexStart !== data.length - stride &&  0 < d3.event.deltaX) { // Upper bound
      sumDeltaX += d3.event.deltaX;
    }
  });
  
  

//   svg.selectAll("text")
//     .data(data)
//     .enter()
//     .append("text")
//     .text((d) => d)
//     .attr("x", (d, i) => i * 70)
//     .attr("y", (d, i) => h - (10 * d) - 3);


}
 


function drawItemBoxes(svg, data, w, h) {
  svg.selectAll(".Box")
    .remove();

  svg.selectAll(".Box")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "Box")
    .attr("x", (d, i) => i * 70)
    .attr("y", (d, i) => h - 10 * d)
    .attr("z", (d, i) => 1)
    .attr("width", 65)
    .attr("height", (d, i) => d * 10)
    .attr('fill', "green");
}

function addEventHandlers(svg) {
  svg.selectAll("rect")
    .on("click", onClickItem)
    .on('mouseenter', onMouseEnterItem)
    .on('mouseleave', onMouseLeaveItem)
    
}

function addDateIndeces(svg, data, w, h, indexStart) {  
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

export default VisualizationView;

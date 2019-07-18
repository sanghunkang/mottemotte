import * as d3 from "d3";
import React, {useEffect, useState} from 'react';

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
  return function(svg, data, zoom=10) {
    svg.selectAll(".Box")
      .remove();

    svg.selectAll(".Box")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "Box")
      .attr("x", (d, i) => i * 70*zoom/10)
      .attr("y", (d, i) => h - d*10*zoom/10)
      .attr("width", 65*zoom/10)
      .attr("height", (d, i) => d*10*zoom/10)
      .attr('fill', "green")
      .on('click', onClickItem)
      .on('mouseenter', onMouseEnterItem)
      .on('mouseleave', onMouseLeaveItem);
  }
}();

var addDateIndeces = function() {
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


let data = [12, 5, 6, 6, 9, 10, 2, 3, 6, 3, 3, 3, 6, 3, 4, 3, 2, 12, 11, 32, 12, 32, 15];

let indexStart = 0;
let range = 14;
let stride = 15;
let sumDeltaX = 0;
let sumDeltaY = 0;
let zoom = 10;

var handleScroll = function(svg) {
  if (Math.abs(d3.event.deltaY) < Math.abs(d3.event.deltaX)) {
    handleHorizontalScroll(svg);
  } else if (Math.abs(d3.event.deltaX) < Math.abs(d3.event.deltaY)) {
    handleVerticalScroll(svg);
  } 
}

var handleHorizontalScroll = function() {
  return function(svg) {
    if (sumDeltaX < -stride || stride < sumDeltaX ) {
      indexStart += sumDeltaX < 0? -1: 1;
      updateBarChart(svg, zoom);
      sumDeltaX = 0;
    } 

    if (indexStart !== 0 && d3.event.deltaX < 0) { // Lower bound
      sumDeltaX += d3.event.deltaX;
    } else if (indexStart !== data.length - stride &&  0 < d3.event.deltaX) { // Upper bound
      sumDeltaX += d3.event.deltaX;
    }
  }
}();

var handleVerticalScroll = function() {
  return function(svg) {
    if (sumDeltaY < -200 || 200 < sumDeltaY ) {
      if (1 < zoom && sumDeltaY < 0) {
        zoom = Math.abs(zoom - 1);
      } else if (zoom < 10 && 0 < sumDeltaY ) {
        zoom = Math.abs(zoom + 1);
      }


      updateBarChart(svg, zoom);
      sumDeltaY = 0;
    }
    sumDeltaY += d3.event.deltaY;
  }
}();

var updateBarChart = function(svg, zoom) {
  if (zoom < 10) {
    range = Math.min(parseInt(range/zoom*10), 50);
  } else if (10 <= zoom) {
    range = Math.max(parseInt(range/zoom*10), 14);
  }

  console.log(range);
  drawItemBoxes(svg, data.slice(indexStart,indexStart+range), zoom);
  addDateIndeces(svg, [...Array(range).keys()], indexStart, zoom);
}


function drawChart() {
  var svg = d3.select(".BarChart");
  updateBarChart(svg, zoom);        
  
  svg.on('mousewheel', ()=> {
    handleScroll(svg);
  });

}




// Functional React Components
function VisualizationView() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count+1);
  }

  useEffect(() => {
    drawChart();
    // fetch('/api/getData')
    // let data = {
    //   context: this.state.context,
    //   input: { text: message || '' }
    // };

    // fetch('/api/getData', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   // body: JSON.stringify(data)
    // })
    //   .then(res => {
    //     console.log(res);
    //     return res.json();
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => console.log(err));
  }); 

  
  return(
    <div className="VisualizationView">
      <div
        onClick={handleClick}>
        Vis View {count}
      </div>
      <svg
        className="BarChart"
        onClick={handleClick}
        onMouseMove={handleClick}>
      </svg>
    </div>
  );
}

export default VisualizationView;

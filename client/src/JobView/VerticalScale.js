import * as d3 from "d3";
import React, { useEffect, useState, useRef } from 'react';

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

  export default VerticalScale;
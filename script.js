const url= 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

let GDPdata;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let drawCanvas = () => {
    svg.attr('width', width)
       .attr('height', height);
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (d) => {
                        return d[1]
                    })])
                    .range([0, height-(padding*2)])

    xScale = d3.scaleLinear()
                .domain([0,values.length-1])
                .range([padding, width-padding])

    let datesArray = values.map((d) => {
        return new Date(d[0]);
    });

    xAxisScale = d3.scaleTime()
               .domain([d3.min(datesArray), d3.max(datesArray)]) 
               .range([padding, width-padding]);

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (d) => {
                        return d[1];
                    })])
                    .range([height-padding,padding])
}

let drawBars = () => {
    
    var Tooltip = d3.select('body')
                    .append('div')   
                    .attr('id', 'tooltip')
                    .style("position", "absolute")
                    .style("visibility", "hidden")

    
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width-padding*2)/values.length)
        .attr('data-date', (d) => {
            return d[0];
        })
        .attr('data-gdp', (d) => {
            return d[1];
        })
        .attr('height', (d) => {
            return heightScale(d[1])
        })
        .attr('x', (d,i) => {
            return xScale(i);
        } )
        .attr('y', (d) => {
            return (height-padding)-heightScale(d[1])
        })
        .on("mouseenter", function(event,d) {
            console.log("mouse hover")
            Tooltip.transition()
                   .duration(0)
                   .style("visibility", "visible")
                   .text(`data-date ${d[0]}', GDP: ${d[1]}`)  
            document.querySelector("#tooltip").setAttribute('data-date',d[0])
        })

        .on("mousemove", function(event,d) {
            Tooltip.transition()
                   .duration(0)
                   .style("visibility", "visible")
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseleave", () => {            
            Tooltip.style("visibility", "hidden")
        });
}        



let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', "x-axis")
        .attr('transform', 'translate(0, ' + (height-padding) + ')');

    svg.append('g')
        .call(yAxis)
        .attr('id', "y-axis")
        .attr("transform", 'translate('+ padding + ',0)')

}

fetch(url)
 .then(response => response.json())
 .then(data => {
    GDPdata = data
    values = GDPdata.data    
    drawCanvas()
    generateScales()
    generateAxes()
    drawBars()    
 })
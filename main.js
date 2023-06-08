document.addEventListener("DOMContentLoaded", function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  const margin = { top: 60, right: 20, bottom: 60, left: 50 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  const svg = d3.select(".container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

  d3.json(url).then(function (data) {
      data.forEach(d => {
          d.Year = new Date(d.Year, 0);
          d.Time = new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
      });

      const xScale = d3.scaleTime()
          .domain(d3.extent(data, d => d.Year))
          .range([0, width]);

      const yScale = d3.scaleTime()
          .domain(d3.extent(data, d => d.Time))
          .range([0, height]);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

      svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .attr("id", "x-axis")
          .call(xAxis);

      svg.append("g")
          .attr("id", "y-axis")
          .call(yAxis);

          svg.selectAll(".dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", d => xScale(d.Year))
          .attr("cy", d => yScale(d.Time))
          .attr("r", 5)
          .attr("data-xvalue", d => d.Year)
          .attr("data-yvalue", d => d.Time)
          .on("mouseover", function (d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 8); // Cambia el tamaño del radio a 8
        
            tooltip.style("opacity", 1)
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 15) + "px")
              .attr("data-year", d.Year)
              .html("<strong>" + d.Name + "</strong><br>" +
                "Año: " + d.Year.getFullYear() + "<br>" +
                "Tiempo: " + d.Time.getMinutes() + ":" + d.Time.getSeconds());
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 5); // Restaura el tamaño del radio a 5
        
            tooltip.style("opacity", 0);
          });        
  });
});

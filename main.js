document.addEventListener("DOMContentLoaded", function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  const margin = { top: 60, right: 20, bottom: 60, left: 50 };

  // Crear el SVG
  const svg = d3.select(".container")
      .append("svg")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

  const render = () => {
      const containerWidth = document.querySelector(".container").clientWidth;
      const width = containerWidth - margin.left - margin.right;
      const height = Math.max(400, containerWidth * 0.6) - margin.top - margin.bottom;

      d3.select("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

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

          // Agrega o actualiza los ejes
          const xAxisGroup = svg.selectAll("#x-axis").data([null]);
          xAxisGroup.enter().append("g")
              .merge(xAxisGroup)
              .attr("transform", `translate(0, ${height})`)
              .attr("id", "x-axis")
              .call(xAxis);

          const yAxisGroup = svg.selectAll("#y-axis").data([null]);
          yAxisGroup.enter().append("g")
              .merge(yAxisGroup)
              .attr("id", "y-axis")
              .call(yAxis);

          // Agrega o actualiza los puntos
          const dots = svg.selectAll(".dot")
              .data(data);

          dots.enter().append("circle")
              .merge(dots)
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
                      .attr("r", 8);

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
                      .attr("r", 5);

                  tooltip.style("opacity", 0);
              });
      });
  };

  render();

  window.addEventListener("resize", render); // Refrescar el gráfico cuando se cambie el tamaño de la ventana
});

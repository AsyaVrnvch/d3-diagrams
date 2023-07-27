import * as d3 from "d3";
import React, { useEffect } from "react";
import { DiagramData, networkColor, networkOrder } from "../../App.data";
import { data } from "../../App.data";

const GroupedDiagram: React.FC = () => {
  useEffect(() => {
    const tooltip = d3.select(".tooltip");

    const svg = d3.select("svg");
    svg.attr("width", 580).attr("height", 650);
    if (!data.length || !data) {
      return;
    }

    const xMin = d3.min(data, (item: DiagramData) => item.year) || 0;
    const xMax = d3.max(data, (item: DiagramData) => item.year) || 1;
    const xDomain = [];
    for (let index = xMin; index <= xMax; index++) {
      xDomain.push(index.toString());
    }

    const yMin = d3.min(data, (item: DiagramData) => item.likes);
    const yMax = d3.max(data, (item: DiagramData) => item.likes);

    const mouseover = () => {
      tooltip.style("opacity", 1).style("display", "block");
    };

    const mousemove = function (event: React.MouseEvent, d: DiagramData) {
      tooltip
        .html(d.name)
        .style("left", event.pageX - 40 + "px")
        .style("top", event.pageY - 60 + "px");
    };

    const mouseleave = () => {
      tooltip.style("opacity", 0).style("display", "none");
    };

    const x = d3.scaleBand().range([50, 570]).domain(xDomain);
    const y = d3
      .scaleLinear()
      .range([600, 50])
      .domain([yMin ? yMin - 100 : 0, yMax ? yMax + 20 : 1]);
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(-5,600)")
      .call(d3.axisBottom(x));
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(45,0)")
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .selectAll()
      .data(data)
      .join("rect")
      .attr(
        "x",
        (item) => (x(item.year.toString()) || 0) + networkOrder[item.name]
      )
      .attr("width", 16)
      .attr("transform", "translate(46, 0)")
      .attr("y", (item) => y(item.likes))
      .attr("height", (item) => 600 - y(item.likes))
      .attr("fill", (item) => networkColor[item.name])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    const handleMouseMove = function (this: Document, event: MouseEvent) {
      tooltip
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY + 20 + "px");
    };
    document.addEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="wrapper">
      <svg />
      <div className="tooltip" />
    </div>
  );
};

export default React.memo(GroupedDiagram);

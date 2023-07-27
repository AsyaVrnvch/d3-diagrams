import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { data } from "../../App.data";

const StackedDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select("svg");
    const tooltip = d3.select(".tooltip");

    const newData = data.reduce<{ networks: string[]; data: number[][] }>(
      (accum, curr) => {
        if (!accum.networks.includes(curr.name)) {
          accum.networks.push(curr.name);
          accum.data[accum.networks.length - 1] = [curr.likes];
          return accum;
        }
        const ind = accum.networks.findIndex((item) => item === curr.name);
        accum.data[ind].push(curr.likes);
        return accum;
      },
      { networks: [], data: [] }
    );

    const y01z = d3
      .stack<number[]>()
      .keys(d3.range(3).map((item) => item.toString()))(
        d3.transpose(newData.data)
      )
      .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

    const myColor = d3
      .scaleOrdinal()
      .domain(["0", "1", "2"])
      .range(["red", "blue", "green"]);

    const xz = ["2018", "2019", "2020", "2021", "2022"];
    const x = d3.scaleBand().domain(xz).rangeRound([0, 450]).padding(0.1);

    const rect = svg
      .selectAll("g")
      .data(y01z)
      .join("g")
      .attr("fill", (_, i) => myColor(i.toString()) as string)
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (_, i) => x((i + 2018).toString()) || 0)
      .attr("transform", "translate(45,0)")
      .attr("width", x.bandwidth());

    const xAxis = (
      svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) => {
      svg
        .append("g")
        .attr("transform", `translate(45, 500)`)
        .attr("class", "axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));
    };
    svg.append("g").call(xAxis);

    const y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1])) || 1;
    const y = d3
      .scaleLinear()
      .range([500, 20])
      .domain([0, y1Max + 100]);
    const yAxis = (
      svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) => {
      svg
        .append("g")
        .attr("transform", "translate(45,0)")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    };
    svg.append("g").call(yAxis);

    const mouseover = () => {
      tooltip.style("opacity", 1).style("display", "block");
    };

    const mousemove = function (event: React.MouseEvent, d: number[]) {
      tooltip
        .html(newData.networks[d[2]])
        .style("left", event.pageX - 40 + "px")
        .style("top", event.pageY - 60 + "px");
    };

    const mouseleave = () => {
      tooltip.style("opacity", 0).style("display", "none");
    };

    rect
      .attr("y", (d) => {
        return y(d[1]);
      })
      .attr("height", (d) => y(d[0]) - y(d[1]))
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
      <svg ref={svgRef} width={580} height={560} />
      <div className="tooltip" />
    </div>
  );
};

export default React.memo(StackedDiagram);

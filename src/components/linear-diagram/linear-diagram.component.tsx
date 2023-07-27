import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { data } from "../../App.data";

interface IData {
  series: ISeries[];
  years: number[];
}

interface ISeries {
  name: string;
  values: number[];
}

const LinearDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const tooltip = d3.select(".tooltip");
    const svg = d3.select("svg");
    svg
      .attr("viewBox", [0, 0, 580, 650])
      .attr("height", 650)
      .attr("width", 580)
      .style("overflow", "visible");

    const newData = data.reduce<IData>(
      (accum, curr) => {
        if (!accum.years.includes(curr.year)) {
          accum.years.push(curr.year);
        }
        const index = accum.series.findIndex((item) => item.name === curr.name);
        if (index >= 0) {
          accum.series[index].values.push(curr.likes);
        } else {
          accum.series.push({ name: curr.name, values: [curr.likes] });
        }
        return accum;
      },
      { series: [], years: [] }
    );

    const yMin = d3.min(newData.series, (d) => d3.min(d.values));
    const yMax = d3.max(newData.series, (d) => d3.max(d.values));

    const y = d3
      .scaleLinear()
      .domain([yMin ? yMin - 150 : 0, yMax ? yMax + 150 : 0])
      .nice()
      .range([650 - 30, 30]);
    const yAxis = (
      group: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) =>
      group
        .attr("transform", `translate(${30},0)`)
        .call(d3.axisLeft(y).tickSize(-550))
        .call((group) => group.select(".domain").remove())
        .call((group) => group.selectAll("text").style("fill", "#c9c6c6"))
        .call((group) => group.selectAll("line").style("stroke", "#c9c6c6"));

    const limits = d3.extent(newData.years);
    const x = d3
      .scaleUtc()
      .domain(limits[0] && limits[1] ? limits : [0, 1])
      .range([30, 500 + 30]);
    const xAxis = (
      group: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) => {
      group
        .attr("transform", `translate(0,${650 - 30})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(500 / 80)
            .tickFormat(d3.format("d"))
            .tickSizeOuter(0)
        )
        .call((group) => group.select(".domain").remove())
        .call((group) => group.selectAll("line").remove())
        .call((group) => group.selectAll("text").style("fill", "#c9c6c6"));
    };

    svg.append("g").attr("id", "xAxis").attr("class", "axis").call(xAxis);
    svg.append("g").attr("id", "yAxis").attr("class", "axis").call(yAxis);

    const myColor = d3
      .scaleOrdinal()
      .domain(
        newData.series.map((val: ISeries) => {
          return val.name;
        })
      )
      .range(["red", "blue", "green"]);

    const line = d3
      .line<number>()
      .defined((d) => !isNaN(d))
      .x((_, i) => x(newData.years[i]))
      .y((d) => y(d));

    const createPaths = (
      group: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) => {
      group
        .selectAll("g")
        .data(newData.series)
        .join("g")
        .attr("fill", "none")
        .attr("class", "path")
        .attr("id", (d: ISeries) => `${myColor(d.name)}`);

      group
        .selectAll(".path")
        .append("path")
        .data(newData.series)
        .style("mix-blend-mode", "multiply")
        .attr("stroke-width", 2.5)
        .attr("d", (d: ISeries) => line(d.values))
        .attr("stroke", (d: ISeries) => myColor(d.name) as string);
    };

    const pathGroup = svg
      .append("g")
      .attr("fill", "none")
      .attr("id", "path-group")
      .call(createPaths);

    const mousemove = (event: React.MouseEvent, d: unknown) => {
      pathGroup.select(`#${myColor((d as ISeries).name)}`).raise();
      const s = newData.series.find((it) => it.name === (d as ISeries).name);
      if (s) {
        pathGroup
          .selectAll("path")
          .attr("stroke-width", (d: unknown) =>
            s.name === (d as ISeries).name ? 4 : 2.5
          );
      }

      tooltip
        .html((d as ISeries).name)
        .style("left", event.pageX - 40 + "px")
        .style("top", event.pageY - 60 + "px");
    };

    const mouseover = () => {
      tooltip.style("opacity", 1).style("display", "block");
    };

    const mouseleave = () => {
      pathGroup
        .selectAll(".path")
        .selectAll("path")
        .attr("stroke", (d: unknown) => myColor((d as ISeries).name) as string)
        .attr("stroke-width", 2.5);

      tooltip.style("opacity", 0).style("display", "none");
    };

    const paths = pathGroup.selectAll(".path");
    paths
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover);

    const handleMouseMove = function (this: Document, event: MouseEvent) {
      tooltip
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY + 20 + "px");
    };
    document.addEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="wrapper">
      <svg ref={svgRef} width={500} height={500} />
      <div className="tooltip" />
    </div>
  );
};

export default React.memo(LinearDiagram);

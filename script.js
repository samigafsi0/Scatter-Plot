let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"; // the JSON url

let dataSet = []; // data array
const req = new XMLHttpRequest(); //HTTP request to get the data

//graph dimensions
const width = 1000;
const height = 500;
const padding = 30;

let xScale;
let yScale;

const svg = d3.select("svg");

const drawGraph = () => {
  svg.attr("width", width).attr("height", height);
};

const createScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataSet, (item) => {
        return item.Year;
      }) - 1,
      d3.max(dataSet, (item) => {
        return item.Year;
      }) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataSet, (item) => {
        return new Date(item.Seconds * 1000);
      }),
      d3.max(dataSet, (item) => {
        return new Date(item.Seconds * 1000);
      }),
    ])
    .range([padding, height - padding]);
};

const drawAxes = () => {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
};

const drawDot = () => {
  let tooltip = d3
    .select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

  let text1 = d3
    .select("#tooltip")
    .append("div")
    .attr("id", "text1")
    .attr("class", "info");
  let text2 = d3
    .select("#tooltip")
    .append("div")
    .attr("id", "text2")
    .attr("class", "info");
  let text3 = d3
    .select("#tooltip")
    .append("div")
    .attr("id", "text3")
    .attr("class", "info");
  let text4 = d3
    .select("#tooltip")
    .append("div")
    .attr("id", "text4")
    .attr("class", "info");

  svg
    .selectAll("circle")
    .data(dataSet)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("id", (d, i) => {
      return "circle-" + i;
    })
    .attr("r", 4)
    .attr("data-xvalue", (d) => {
      return d.Year;
    })
    .attr("data-yvalue", (d) => {
      return new Date(d.Seconds * 1000);
    })
    .attr("cx", (d) => {
      return xScale(d.Year);
    })
    .attr("cy", (d) => {
      return yScale(new Date(d.Seconds * 1000));
    })
    .attr("fill", (d) => {
      if (d.Doping === "") {
        return "green";
      } else {
        return "red";
      }
    })
    .on("mouseover", (nothing, d) => {
      tooltip
        .style("visibility", "visible")
        .style("left", () => {
          return "calc(50vw + " + (xScale(d.Year) - width / 2) + "px + 15px)";
        })
        .style("top", () => {
          return (
            "calc(50vh + " +
            (yScale(new Date(d.Seconds * 1000)) - height / 2) +
            "px - 50px)"
          );
        });
      text1.text(d.Name + " | " + d.Nationality);
      text2.text("Year: " + d.Year + "  " + "Time: " + d.Time);
      if (d.Doping != "") {
        text3.text("---------------------------");
        text4.text(d.Doping);
      } else {
        text3.text("");
        text4.text("");
      }
      document.querySelector("#tooltip").setAttribute("data-year", d.Year);
      d3.select("#circle-" + dataSet.indexOf(d))
        .attr("r", 7)
        .style("fill", "blue");
    })
    .on("mouseout", (nothing, d) => {
      tooltip.style("visibility", "hidden");
      d3.select("#circle-" + dataSet.indexOf(d))
        .attr("r", 4)
        .style("fill", (d) => {
          if (d.Doping === "") {
            return "green";
          } else {
            return "red";
          }
        });
    });
};

const addLegend = () => {
  d3.select("#item1")
    .append("svg")
    .attr("height", 30)
    .attr("width", 30)
    .attr("class", "legend-item")
    .append("circle")
    .attr("r", 10)
    .attr("fill", "red")
    .attr("cx", 10)
    .attr("cy", 10);
  d3.select("#item1").append("text").text("Alleged doping");

  d3.select("#item2")
    .append("svg")
    .attr("height", 30)
    .attr("width", 30)
    .attr("class", "legend-item")
    .append("circle")
    .attr("r", 10)
    .attr("fill", "green")
    .attr("cx", 10)
    .attr("cy", 10);
  d3.select("#item2").append("text").text("No doping allegation");
};

req.open("GET", url, true);
req.onload = () => {
  dataSet = JSON.parse(req.responseText);
  drawGraph(); // creates the general graph area with padding.
  createScales(); // creates the scales for the axis and graph
  drawAxes(); // creates the axis themselves
  drawDot(); // creates the bars
  addLegend();
};
req.send();

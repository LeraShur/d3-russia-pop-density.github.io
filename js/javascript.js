var h1 = d3.select("body")
    .append("h1")
    .text("Russia's population density")

var width = window.innerWidth;
var height = window.innerHeight - 55;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Map and projection
var path = d3.geoPath();
var projection = d3.geoConicEqualArea()
    .parallels([70, 20])
    .rotate([-95, 0])
    .center([-5, 64.9])
    .scale(800)
    .translate([width / 2, height / 2])

var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScale = d3.schemeBlues[7];
var colorScale = d3.scaleThreshold()
    .domain([3, 11, 22, 34, 57, 5000])
    .range(colorScale);

// Popup div
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load external data and boot
d3.queue()
    .defer(d3.json, "data/russia_pop_density_2018.geojson")
    .defer(d3.csv, "data/russia_pop_density_2018.csv", function (d) {
        data.set(d.NAME, +d.POP_DENS);
    })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "subjects")
        .attr("fill", function (d) {
            // Pull data for this county
            d.total = data.get(d.properties.NAME) || 0;
            // Set the color
            return colorScale(d.total);
        })
        // Show Popup div on mouse over
        .on("mouseover", function (d) {
            d3.select("h2").html("<bold><br/>" + "Federal District" + ": " + d.properties.FEDERAL_DI +
                "<bold><br/>" + "Area, square km" + ": " + d.properties.AREA +
                "<bold><br/>" + "Population" + ": " + d.properties.POP_18 +
                "<bold><br/>" + "Population Density, per square km" + ": " + d.properties.POP_DENS)
            d3.select(this).attr("class", "subjects hover")
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.properties.NAME)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        // Close Popup div on mouse out
        .on("mouseout", function (d) {
            d3.select("h2").text(" ")
            d3.select(this).attr("class", "subjects")
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
}

 //Contributions
 svg.append("svg")
 .append("g").attr("transform", "translate(1115, 600)")
 .append("text")
 .text("GisGeo,")
 .attr("font-family", "Calibri")
 .attr("font-size", "12px")
 .attr("fill-opacity", 0.25)
 .on("click", function () { window.open("http://gisgeo.org"); });

svg.append("svg")
 .append("g").attr("transform", "translate(1160, 600)")
 .append("text")
 .text("Russian Federal State Statistics Service")
 .attr("font-family", "Calibri")
 .attr("font-size", "12px")
 .attr("fill-opacity", 0.25)
 .on("click", function () { window.open("http://www.gks.ru/wps/wcm/connect/rosstat_main/rosstat/en/main/"); });

// Legend
var thresholdScale = d3.scaleThreshold()
 .domain([3, 11, 22, 34, 57, 5000])
 .range(d3.schemeBlues[6]);

var g = svg.append("g")
 .attr("class", "legend")
 // Legend Position
 .attr("transform", "translate(20,20)");

var legend = d3.legendColor()
 .labelFormat(d3.format(".2f"))
 .labels(d3.legendHelpers.thresholdLabels)
 .title("per square kilometer")
 .scale(thresholdScale);

svg.select(".legend")
 .call(legend);






//Additional Russia area filtered from the world map
/* d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function (data) {

    // Filter data
    data.features = data.features.filter(function (d) {
        console.log(d.properties.name);
        return d.properties.name == "Russia"
    })

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", "grey")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "none")
})  */
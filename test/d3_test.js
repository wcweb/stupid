var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

var width = 960,
    height = 500,
    margin = {top:19.3, right:19.5, bottom:19.5, left:39.5};

var xScale = d3.scale.log().domain([300,1e5]).range([0, width]),
    yScale = d3.scale.linear().domain([10,85]).range([height,0]);

var xAxis = d3.svg.axis().scale(xScale).orient("bootom"),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.top +","+ margin.bottom + ")");


svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "transform(0,"+height+ ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

function update(data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var text = svg.selectAll("text")
      .data(data);

  // UPDATE
  // Update old elements as needed.
  text.attr("class", "update")
      .transition()
        .duration(750)
        .attr("x", function(d, i){return i*32});

  // ENTER
  // Create new elements as needed.
  text.enter().append("text")
      .attr("class", "enter")
      .attr("y", -60)
      .attr("x", function(d, i) { console.log(d,i);return i * 32; })
      .attr("dy", ".35em")
      .text(function(d) {return d;})
      .transition()
        .duration(750)
        .attr("y",0)
        .style("fill-opacity", 1);

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.
  text.text(function(d) { return d; });

  // EXIT
  // Remove old elements as needed.
  text.exit()
      .attr("class", "exit")
      .transition()
        .duration(750)
        .attr("y", 60)
        .style("fill-opacity", 1e-6)
      .remove();
}

// The initial display.
update(alphabet);

// Grab a random sample of letters from the alphabet, in alphabetical order.
setInterval(function() {
  update(shuffle(alphabet)
      .slice(0, Math.floor(Math.random() * 26))
      .sort());
}, 1500);

// Shuffles the input array.
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m], array[m] = array[i], array[i] = t;
  }
  return array;
}


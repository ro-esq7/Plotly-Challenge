

function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var trace1 = `/metadata/${sample}`
  d3.json(trace1).then(function(response) {
    console.log(response);

    // Use `.html("") to clear any existing metadata
    var newTable = d3.select("#sample-metadata").html("")
      
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    var tCol = newTable.append("td");
    Object.entries(response).forEach(([key, value]) => {
      var tRow = tCol.append("tr");
      tRow.text(`${key}: ${value}`);
    });
  });   
}

// For plots
var plotSet = []

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var trace2 = `/samples/${sample}`
    console.log(trace2);
    
    d3.json(trace2).then(function(plotSet) {
      console.log(plotSet);

    // @TODO: Build a Bubble Chart using the sample data
    var bubblePlot = {
      x: plotSet.otu_ids,
      y: plotSet.sample_values,
      text: plotSet.otu_labels,
      mode: 'markers',
      marker: {
        size: plotSet.sample_values,
        color: plotSet.otu_ids
      },
    };

    var bubbleData = [bubblePlot];

    var bubbleLayout = {
      showlegend: false,
      height: 550,
      width: 1100
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    var piePlot = {
      values: plotSet.sample_values.slice(0,10),
      labels: plotSet.otu_ids.slice(0, 10),
      hoverinfo: plotSet.otu_labels.slice(0, 10),
      text: plotSet.otu_labels.slice(0, 10),
      type: "pie"
    };

    var pieData = [piePlot];

    var pieLayout = {
      height: 550,
      width: 1100
    };
    
    Plotly.newPlot("pie", pieData, pieLayout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
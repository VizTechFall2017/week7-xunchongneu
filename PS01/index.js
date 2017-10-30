var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


var scaleX = d3.scaleBand().rangeRound([0, width-2*marginLeft]).padding(0.1);
var scaleY = d3.scaleLinear().range([height-2*marginTop, 0]);
var scaleY2 = d3.scaleLinear().range([height-2*marginTop, 0]);

d3.csv('./xundata2.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key ==='1'})[0].values;


    svg.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY));

    svg2.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg2.append("g")
        .attr('class', 'yaxis2')
        .call(d3.axisLeft(scaleY2));





    drawPoints(loadData);

});

function drawPoints(pointData){

    scaleX.domain(pointData.map(function(d){return d.Stock;}));
    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.Close}))]);
    scaleY2.domain([0, d3.max(pointData.map(function(d){return +d.Volume}))]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    d3.selectAll('.yaxis2')
        .call(d3.axisLeft(scaleY2));


    var rects = svg.selectAll('.bars')
        .data(pointData, function(d){return d.Stock;});


    rects.exit()
        .remove();


    rects
        .transition()
        .duration(10)
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY(d.Close);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(d.Close);
        });


    rects
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('id', function(d){return d.Stock;})
        .attr('fill', "lightblue")
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY(d.Close);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(d.Close);
        })
        .on('mouseover', function(d){
            d3.select(this).attr('fill','lightblue');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill','lightblue')
        })
        .on('mouseout', function(d){
            d3.select(this).attr('fill','slategray');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill','slategray')
        });



    var rects2 = svg2.selectAll('.bars')
        .data(pointData, function(d){return d.Stock;});


    rects2.exit()
        .remove();


    rects2
        .transition()
        .duration(10)
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY2(d.Volume);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.Volume);
        });


    rects2
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('id', function(d){return d.Stock;})
        .attr('fill', "lightblue")
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY2(d.Volume);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.Volume);
        })
        .on('mouseover', function(d){
            d3.select(this).attr('fill','lightblue');

            currentID = d3.select(this).attr('id');
            svg.selectAll('#' + currentID).attr('fill','lightblue')
        })
        .on('mouseout', function(d){
            d3.select(this).attr('fill','slategray');

            currentID = d3.select(this).attr('id');
            svg.selectAll('#' + currentID).attr('fill','slategray')
        });



}


function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}



function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}







var makeLine = d3.line()
    .x(function(d) { return scaleX(d.Stock); })
    .y(function(d) { return scaleY(d.AdjClose); });



d3.csv('./xundata2.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = dataIn;


    svg.append("path")

        .datum(dataIn)
        .attr("class", "line")
        .attr("d", makeLine)
        .attr('fill','none')
        .attr('stroke','#00264d')
        .attr('stroke-width',2.5);

});


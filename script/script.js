/**
 * Created by apple on 15/2/17.
 */
var margin = {t:50,r:50,b:50,l:50};
    width = $('.plot').width()- margin.r -margin.l,
    height =$('.plot').height()-margin.t - margin.b;

// set up SVG drawing elements
var canvas1 = d3.select('.plot')
    .append('svg')
    .attr('width',width +margin.r+margin.l)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform','translate('+margin.l+','+margin.t+')');


var scaleX = d3.scale.log()
    .range([0,width]);

var scaleY = d3.scale.log()
    .range([height,0]);

var scaleR = d3.scale.sqrt()
    .range([15,50]);

var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height,0)
    .scale(scaleX);

var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY);

   console.log("Start to load data...");
// step1:load and parse data
d3.csv('data/world_bank_2010_gdp_co2.csv',parse,dataloaded);



function dataloaded (error,rows) {
    //step2: mine data for max and min
    var minY = d3.min(rows, function (m) {
            return m.co2;
        }),
        maxY = d3.max(rows, function (m) {
            return m.co2;
        });
    var minX = d3.min(rows, function (m) {
            return m.gdpPerCap;
        }),
        maxX = d3.max(rows, function (m) {
            return m.gdpPerCap;
        });
    var minR = d3.min(rows, function (m) {
            return m.population;
        }),
        maxR = d3.max(rows, function (m) {
            return m.population;
        });
//console.log(minX,maxX);
    scaleX.domain([minX, maxX]);
    scaleY.domain([minY, maxY]);
    scaleR.domain([minR*0.3, maxR*1.15]);

    canvas1 .append('g')
        .attr('class','axis x')
        .attr('transform','translate(0,'+height+')')
        .call(axisX);

    canvas1.append('g')
        .attr('class','axis y')
        .call(axisY);

    draw(rows);

}
function draw(rows){
    console.log("Start drawing");
        var points = canvas1.selectAll('.point')//return a selection of 0 DOM elements,give back nothing...select 'point' should be consistent
        .data(rows)// try to match..
        .enter()//empty placeholder for missing DOM elements
        .append('circle')
        .attr('class', 'point')//give me the circle elements on page
        .filter(function (m) {
            return m.gdpPerCap && m.co2;
        })

            //Try this next time! loop in the translate! Clever!
            //.attr('transform', function(d){
            //    return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.urbanPop)+')';
            //})
        .attr('cx', function (m) {
            return scaleX(m.gdpPerCap);
        })
        .attr('cy', function (m) {
            return scaleY(m.co2);
        })
        .attr('r', function (m) {
            return scaleR(m.population);
        });

    points.append('text')
            .text(function(m){
                return m.cName;
            })
            .attr('text-anchor','middle')
            .attr('dy',12);


}


function parse(m) {
    //console.log(m['CO2 emissions (metric tons per capita)']);

    return {
        cName: m['Country Name'],
        co2: (m['CO2 emissions (metric tons per capita)'] == "..") ? undefined : +m['CO2 emissions (metric tons per capita)'],
        population: +m["Population, total"],
        gdpPerCap: (m["GDP per capita, PPP (constant 2011 international $)"] == "..") ? undefined : +m["GDP per capita, PPP (constant 2011 international $)"]
    }
}
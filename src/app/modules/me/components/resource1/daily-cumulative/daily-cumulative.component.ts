import { Component, OnInit } from '@angular/core';
import { MeService } from '../../../services/me.service';
import * as saveAs from 'file-saver';
import { svgString2Image, getSVGString } from '../../../../../shared/data/svg-helpers';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-daily-cumulative',
  templateUrl: './daily-cumulative.component.html',
  styleUrls: ['./daily-cumulative.component.scss']
})
export class DailyCumulativeComponent implements OnInit {

  public data: any;

  colours = [
    '#182bff', '#f58231', '#6FF531', 'FF9898'
  ];

  public width: number;
  public height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};
  private options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private line: any;
  private trendline: any;
  private div: any;
  private dataNest: any;
  public cfnTargets: any = [45, 50, 40];
  public target: number = 0;
  public output: number = 0;

  constructor(
    private meService: MeService
  ) { }

  ngOnInit() {
    this.requestData();
  }

  requestData() {
    this.meService.getDailyCumulative().subscribe(
      success => {
        this.data = success;
        let start = 0;
        success.forEach((el, i) => {
          start++;
          el['total'] = this.output = start;
        });

        if(!!this.svg) this.svg.selectAll('*').remove();
        this.initSvg();
        this.initAxis(success);
        this.drawAxis();
        this.drawTargetLines(success, this.cfnTargets);
        this.drawBars();
        this.createVerticalLines(success);
      },
      err => {

      }
    )
  }

  initSvg() {
    this.svg = d3.select('#dailyCumulative')
    this.svg.attr('width', 900);

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right - 100;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom - 50;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(data) {
    let total = data.length - 1;
    let startDate = new Date(data[0].actionTime.split('T')[0]);
    let endDate = new Date(data[0].actionTime.split('T')[0]);
    endDate.setDate(endDate.getDate() + 1);

    this.x = d3Scale.scaleTime()
      .domain([new Date(startDate.toUTCString()), new Date(endDate.toUTCString())])
      .range([20, 900])
      .nice()
    this.y = d3Scale.scaleLinear()
      .range([this.height, 0])
      .domain([0, data[total]['total'] + 100]);
  
    this.line = d3.line()
      .x(d => this.x(new Date(d['actionTime'].split('.')[0])))
      .y(d => this.y(d['total']))

    this.dataNest = d3.nest()
      .key(d => d['po'])
      .entries(data)
  }

  private drawAxis() {
    this.g.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x))
        .selectAll('text')
        .attr('y', 0)
        .attr('x', 9)
        .attr('dx', '-2em')
        .attr('dy', '.35em')
        .attr('transform', 'rotate(-90)')
        .style('font-size', '12px')
        .style('text-anchor', 'end');
  
    this.g.append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate(' + 20 + ', 0)')
        .call(d3Axis.axisLeft(this.y).ticks(10, 'd'))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.margin.left)
        .attr('x', 0 - (this.height / 2))
        .attr('dy', '1em')
        .text('UNITS');
  }

  private drawBars() {
    this.dataNest.forEach(function(d, i) {
      this.g.append('path')
        .attr('fill', 'none')
        .attr('stroke', this.colours[i])
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2)
        .attr('d', this.line(d.values));
    }.bind(this));
  }

    private createVerticalLines(data) {
      let breakpoints = this.getBreakPoints(data);

      for(let item of breakpoints) {
        this.svg.append('line')
        .attr('class', 'shift')
        .attr("x1", this.x(item.midTime) + 7)
        .attr('y1', this.height + this.margin.top)
        .attr("x2", this.x(item.midTime) + 7)
        .attr('y2', this.margin.top)
        .style('stroke-width', 1)
        .style('fill', 'none')
        .style('stroke', 'red')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-dasharray', 8)

      this.svg.append('text')
        .attr('class', 'shift-label')
        .attr('transform', 'translate(' + (this.x(item.midTime) + 10) + ',' + (this.margin.top + 10) + ')')
        .attr('dy', '.2em')
        .attr('text-anchor', 'start')
        .style('fill', 'red')
        .attr('stroke-dasharray', 8)
        .text('Order Change');
      }
    }

  private drawTargetLines(data, pace) {
    let diff = [];
    let lineoObject = {
      time: null,
      total: 0
    };
    let startDate = new Date(data[0].actionTime.split('T')[0]);
    let endDate = new Date(data[0].actionTime.split('T')[0]);
    endDate.setDate(endDate.getDate() + 1);

    let breakPoints = this.getBreakPoints(data);
    pace.forEach((el, idx) => {

      if(idx === 0) {
        diff[idx] = Math.round((Math.abs(breakPoints[0].midTime.getTime() - startDate.getTime()) / 3600000) * el);
      } else if(idx === pace.length - 1) {
        diff[idx] = Math.round((Math.abs(endDate.getTime() - breakPoints[idx-1].midTime.getTime()) / 3600000) * el);
      } else {
        diff[idx] = Math.round((Math.abs(breakPoints[idx].midTime.getTime() - breakPoints[idx-1].midTime.getTime()) / 3600000) * el);
      }
    })

    let lineData = [];
    for(let i = 0; i < pace.length + 1; i++) {
      let lineObject = {};
      if(i === 0) {
        lineObject = {'time': startDate.setHours(startDate.getHours() - 1), 'total': 0};
        lineData.push(lineObject);
      } else if(i === pace.length) {
        lineObject = {'time': endDate.setHours(endDate.getHours() - 1), 'total': lineData[i-1].total + diff[i-1]};
        this.target = lineObject['total'];
        lineData.push(lineObject);
      } else {
        lineObject = {'time': breakPoints[i-1].midTime.setHours(breakPoints[i-1].midTime.getHours() - 1), 'total': lineData[i-1].total + diff[i-1]};
        lineData.push(lineObject);
      }
    }

    this.trendline = d3.line()
      .x(d => this.x(d['time']))
      .y(d => this.y(d['total']));

    this.g.append('path')
      .datum(lineData)
      .attr('id', 'trendline')
      .attr('fill', 'none')
      .attr('stroke', 'grey')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', 8)
      .attr('d', this.trendline);
  }

  private getBreakPoints(data) {
    let verticalPoints = [];
  
    for(let i = 0; i < data.length - 1; i++) {
      if(data[i].po !== data[i+1].po) {
        let end = new Date(data[i+1]['actionTime']);
        let start = new Date(data[i]['actionTime']);

        verticalPoints.push({
          midTime: new Date( (end.getTime() + start.getTime()) / 2),
          splitPoint: ((i + i + 1) * (((this.width / 1000) )/ 2) + this.margin.left),
          poLeft: data[i].po,
          poRight: data[i+1].po
        });
      }
    }

    return verticalPoints || [];
  }

    filterSubmitted(targets) {
      d3.select("#trendline").remove();
      this.drawTargetLines(this.data, targets);
    }

  export() {
    const save = (dataBlob, filesize) => {
      saveAs(dataBlob, 'Daily_Cumulative.png');
    };

    const svgString = getSVGString(this.svg.node());
    svgString2Image(svgString, 2*this.width, 2*this.height, 'png', save);

  }
}

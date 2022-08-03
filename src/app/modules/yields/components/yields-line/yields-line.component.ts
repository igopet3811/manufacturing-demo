import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as saveAs from 'file-saver';

import { LoaderService } from '../../../../shared/services/loader.service';

import { getCfnsFromFamiliesGeo } from '../../../../shared/data/product-list.data';
import { getLineDetails } from '../../../../shared/data/line-description.data';
import { svgString2Image, getSVGString } from '../../../../shared/data/svg-helpers';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import d3Tip from 'd3-tip';
import { YieldsService } from '../../services/yield.service';

@Component({
  selector: 'app-yields-line',
  templateUrl: './yields-line.component.html',
  styleUrls: ['./yields-line.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class YieldsLineComponent implements OnInit {

  dataSource = null;

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};
  private lineOffset: number = 6;
  private options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private line: any;
  private div: any;

  thresholdValue: number = 90;

  constructor(
    private yieldsService: YieldsService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.requestData();
  }

  requestData() {
    if(!!this.svg) this.svg.selectAll('*').remove();
    
    this.yieldsService.getYieldsData().subscribe(
      success => {
        this.loaderService.display(false);
        this.dataSource = success.filter(line => line.line === 'LINE1');
        this.dataSource = this.dataSource.sort(function(a,b){
          return a.producedAt.localeCompare(b.producedAt);
        }).map(item => Object.assign({}, item, {
          yield: item['accepted']/item['total']*100 >= 60 ? item['accepted']/item['total']*100 : 60
        }));

        this.initSvg(this.dataSource);
        this.initAxis(this.dataSource);
        this.drawAxis();
        this.drawBars(this.dataSource);      
      },
      err => {
        this.toastr.error('Error fetching line data.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loaderService.display(false);
      }
    )
  }

  initSvg(graphData) {

    this.svg = d3.select('#yieldsLineGraph')
    this.svg.attr('width', 50 + 20 * graphData.length);

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom - 50;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  /* init axis */
  private initAxis(data) {
    this.x = d3Scale.scaleBand().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);

    this.x.domain(data.map((d) => d.order));
    this.y.domain([60, 100]);

    this.line = d3.line()
      .x(d => this.x(d['order']) + this.lineOffset)
      .y(d => this.y(d['yield']))
      .curve(d3.curveCatmullRom.alpha(0.5));

    this.div = d3.select('.yields-line-tooltip');
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
      .call(d3Axis.axisLeft(this.y).ticks(10, 'd'))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .text('YIELD (%)');
  }

  private drawBars(data) {
    const tooltip = d3Tip().attr('class', 'tooltip-line-timeline').direction('e').offset([0,5])
    .html((d) => {
      const lineDetails = getLineDetails(d.line);
      const poYield = (100 * d.accepted/d.total).toFixed(2) + ' %';
      let content = "<span style='margin-left: 2.5px;'><b>" + 'Order #: ' + d.order + "</b></span><br>";
      content +=`
          <table style="margin-top: 2.5px;">
            <tr><td>Yield: </td><td style="text-align: right">` + poYield + `</td></tr>
            <tr><td>Batch: </td><td style="text-align: right">` + this.padBatchNumber(d.batch) + `</td></tr>
            <tr><td>CFN: </td><td style="text-align: right">` + d.cfn + `</td></tr>
            <tr><td>System/Cell: </td><td style="text-align: right">` + lineDetails.description + `</td></tr>
            <tr><td>Type: </td><td style="text-align: right">` + lineDetails.type + `</td></tr>
            <tr><td>Produced @: </td><td style="text-align: right">` + new Date(d.producedAt).toLocaleString('en-GB', this.options) + `</td></tr>
            <tr><td>Shift(s): </td><td style="text-align: right">` + d.shift + `</td></tr>
            <tr><td>Order Size: </td><td style="text-align: right">` + d.total + `</td></tr>
            <tr><td>Accepted: </td><td style="text-align: right">` + d.accepted + `</td></tr>
          </table>
          `;
      return content;
    });
    this.svg.call(tooltip);

    this.g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 2)
      .attr('d', this.line);

    this.svg.selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('fill', d => d['yield'] <= 60 ? '#b30000' : 'black')
      .attr('cx', (d => this.x(d['order']) + this.lineOffset + this.margin.left).bind(this))
      .attr('cy', (d => this.y(d['yield']) + this.margin.top).bind(this))
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);

    this.svg.selectAll('line.horizontalGrid').data([85, 90, 95]).enter()
      .append('line')
      .attr('class', 'target')
      .attr('x1', this.margin.left)
      .attr('x2', this.width + this.margin.left)
      .attr('y1', (d => this.y(d) + this.margin.top).bind(this))
      .attr('y2', (d => this.y(d) + this.margin.top).bind(this));
  }

  filterSubmitted(evt) {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }

  padBatchNumber(b: string){
    return b.padStart(10,'0');
  }

  export() {
    const save = (dataBlob, filesize) => {
      saveAs(dataBlob, 'System Yields.png');
    };

    const svgString = getSVGString(this.svg.node());
    svgString2Image(svgString, 2*this.width, 2*this.height, 'png', save);

  }
}

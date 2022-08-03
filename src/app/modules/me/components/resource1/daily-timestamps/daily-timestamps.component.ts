import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as saveAs from 'file-saver';

import { MeService } from '../../../services/me.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { svgString2Image, getSVGString } from '../../../../../shared/data/svg-helpers';
import { getCurrentWeekNumber, getISOWeekNumber } from '../../../../../shared/data/date-helpers';
import { getLineByResource } from '../../../../../shared/data/line-description.data';
import { avg } from '../../../../../shared/data/stats';
import { IMeDailyReqModel } from '../../../../../shared/models/resource-req.model';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-daily-timestamps',
  templateUrl: './daily-timestamps.component.html',
  styleUrls: ['./daily-timestamps.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DailyTimestampsComponent implements OnInit {

  @Input() lastUnitTime: Date;
  private request: IMeDailyReqModel = {
    week: getCurrentWeekNumber() + 1,
    year: new Date().getFullYear(),
    dow: new Date().getDay(),
    resource: 'Resource_1',
    shift: 'day'
  };

  private colors = {
    day: '#4682B4',
    evening: '#FF8C00',
    night: '#ADD8E6',
    weekend: '#FFBB78' 
  }

  public width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};
  private options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  public data: any;
  private cellName: string = 'System 1';
  private dateSelect: Date = new Date('2019-08-02');
  private shiftName: string = 'Day Shift';
  private avg: number = null;
  
  constructor(
    private meService: MeService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.requestData(this.request);
  }

  requestData(request) {
    this.data = [];
    this.meService.getDailyTimestamps().subscribe(
      success => {
        this.loaderService.display(false);
        this.data = success;
        if (success.length > 1) {
          this.avg = avg(this.data.map(el => el.delta));
        } else {
          this.avg = null;
        }
        if(!!this.svg) this.svg.selectAll('*').remove();
        this.initSvg(this.data);
        this.initAxis(this.data);
        this.drawAxis();
        this.drawBars(this.data);
        this.drawTargetLines();
        this.createVerticalLines(this.data);
      },
      err => {
        this.toastr.error('Error fetching data.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loaderService.display(false);
      }
    )
  }

  private initSvg(data) {
    this.svg = d3.select('#dailyGraph');
    this.svg.attr('width', 60 + 20 * data.length);
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom - 100;
  
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(data) {
    this.x = d3Scale.scaleBand().range([0, this.width]).padding(.2);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(data.map((d) => d.sfc));
    this.y.domain([0, 600]);
  }

  private drawAxis() {
    this.g.append('g')
      .attr('class', 'xAxis')
      .attr('transform', 'translate(10.5,' + this.height + ')')
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
      .attr('transform', 'translate(' + (10.5) + ', 0)')
      .call(d3Axis.axisLeft(this.y).ticks(20, 'd'))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .text('Time (s)');
  }

  /* draw the chart */
  private drawBars(data) {
    const tooltip = d3Tip().attr('class', 'tooltip-resource-timestamp').direction('e').offset([0,5])
    .html((d) => {
      let content = "<span style='margin-left: 2.5px;'><b>" + 'Time(s): ' + d.delta + ' seconds' + '(' + (d.delta/60).toFixed(2) + ' minutes)' +'</b></span><br>';
      content +=`
          <table style="margin-top: 2.5px;">
            <tr><td>Order: </td><td style="text-align: right">` + d.po + `</td></tr>
            <tr><td>Unit Num: </td><td style="text-align: right">` + d.sfc + `</td></tr>
            <tr><td>Resource: </td><td style="text-align: right">` + d.resource + `</td></tr>
            <tr><td>Unit Time: </td><td style="text-align: right">` + new Date(d.actionTime).toLocaleString('en-GB', this.options) + `</td></tr>
          </table>
          `;
      return content;
    });

    this.svg.call(tooltip);
    this.g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.x(d.sfc))
      .attr('y', d => this.y(d['delta'] >= 600 ? 600 : d['delta']))
      .attr('width', this.x.bandwidth())
      .attr('height', d => this.height - this.y(d.delta >= 600 ? 600 : d['delta'] ))
      .attr('fill', d => d.delta <= 600 ? this.colors[this.request.shift] : '#e08686')
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);
  }

  private drawTargetLines() {
    /* gridline with user defined y value */
    this.svg.selectAll('line.horizontalGrid').data([120, 240, 360, 600, 1200, 1800, 2400, 3600]).enter()
      .append('line')
      .attr('class', 'target-resource')
      .attr('x1', this.margin.left)
      .attr('x2', this.width + this.margin.left)
      .attr('y1', (d => this.y(d) + this.margin.top).bind(this))
      .attr('y2', (d => this.y(d) + this.margin.top).bind(this));
  }

  /* vertical lines for shifts */ 
  private createVerticalLines(data) {
    let verticalPoints = [];

    for(let i = 0; i < data.length - 1; i++) {
      if(data[i].po !== data[i+1].po) {
        verticalPoints.push({
          midTime: new Date((Date.parse(data[i].actionTime.toString()) + Date.parse(data[i+1].actionTime.toString()))/2),
          splitPoint: ((i + i + 1) / 2) * (this.width / data.length) + this.margin.left + 20,
          poLeft: data[i].po,
          poRight: data[i+1].po
        });
      }
    }

    for(let item of verticalPoints) {
      this.svg.append('line')
        .attr('class', 'shift')
        .attr('x1', item.splitPoint)
        .attr('y1', this.height + this.margin.top)
        .attr('x2', item.splitPoint)
        .attr('y2', this.margin.top)
        .style('stroke-width', 1)
        .style('fill', 'none')
        .style('stroke', 'red')

      this.svg.append('text')
        .attr('class', 'shift-label')
        .attr('transform', 'translate(' + (item.splitPoint + 10) + ',' + (this.margin.top + 10) + ')')
        .attr('dy', '.2em')
        .attr('text-anchor', 'start')
        .style('fill', 'red')
        .text('Order Change');
    }
  }

  export() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }
}
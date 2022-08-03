import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as saveAs from 'file-saver';

import { MeService } from '../../../services/me.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { svgString2Image, getSVGString } from '../../../../../shared/data/svg-helpers';
import { IMeResourceReqModel } from '../../../../../shared/models/resource-req.model';
import { getCurrentWeekNumber, getDateOfISOWeek } from '../../../../../shared/data/date-helpers';
import { getLineByResource } from '../../../../../shared/data/line-description.data';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-weekly-throughput',
  templateUrl: './weekly-throughput.component.html',
  styleUrls: ['./weekly-throughput.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WeeklyThroughputComponent implements OnInit {

  @Input() lastUnitTime: Date;
  public width: number;
  private height: number;
  private margin = { top: 40, right: 0, bottom: 0, left: 50 };

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private div: any;

  public dataSource = [];
  private request: IMeResourceReqModel = {
    week: getCurrentWeekNumber(),
    year: new Date().getFullYear(),
    resource: 'Resource_1'
  };
  private filterText: string;

  constructor(
    private meService: MeService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    /* current week as parameter */
    this.filterText = `System 1 - Week ${this.request.week}-${this.request.year}`;
    this.requestData(this.request);
  }

  requestData(request) {
    if (!!this.svg) { 
      this.svg.selectAll('*').remove();
    }

    this.meService.getWeekly(request).subscribe(
      success => {
        this.dataSource = [];
        const shifts = Array.from(new Set(Array.from(success.map(data => data.shift)).sort()));
        const dows = Array.from(new Set(Array.from(success.map(data => data.dow)).sort()));

        for (const day of dows) {
          const row = {};
          row['dow'] = day;
          for (const shift of shifts) {
            const total = success.filter(d => d.dow === day).filter(s => s.shift === shift).length === 0 ?
            0 : success.filter(d => d.dow === day).filter(s => s.shift === shift)[0].total;
            row[`${shift}`] = total;
          }

          this.dataSource.push(row);
        }

        this.loaderService.display(false);
        this.initSvg(this.dataSource);
        this.initAxis(this.dataSource, shifts);
        this.drawAxis(request);
        this.drawBars(this.dataSource, shifts);
      },
      err => {
        this.toastr.error('Error fetching data.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loaderService.display(false);
      }
    );
  }

  initSvg(graphData) {

    this.svg = d3.select('#stackedGraph');
    this.svg.attr('width', 50 + 90 * graphData.length + 100);

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right - 100;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom - 100;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  /* init axis */
  private initAxis(data, shifts) {
    this.x = d3Scale.scaleBand().range([0, this.width - this.margin.right]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);

    this.y.domain([0, d3.max(data, d => d3.sum(shifts, k => +d[`${k}`]))]).nice();
    this.x.domain(data.map(d => d.dow));

    this.div = d3.select('.resource1-tooltip');
  }

  /* draw axis */
  private drawAxis(request) {
    const weekDate = getDateOfISOWeek(request.week, request.year);

    this.g.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(d3Axis.axisBottom(this.x).tickFormat(d => new Date(weekDate.getTime() + (+d - 1) * 86400000).toString().substring(0, 10)))
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('dx', '-2em')
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .style('font-size', '12px')
      .style('text-anchor', 'end');

    this.g.append('g')
      .attr('class', 'yAxisRes1')
      .call(d3Axis.axisLeft(this.y).ticks(10, 'd'))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .text('Throughput (Units)');
  }

  /* draw graph */
  private drawBars(data, shifts) {

    const z = d3.scaleOrdinal()
		.range(['steelblue', 'darkorange', 'lightblue', '#ffbb78'])
    .domain(shifts);

		const group = this.g.selectAll('g.layer')
      .data(d3.stack()
      .keys(shifts)(data), d => d.key);

		group.exit().remove();

		group.enter().append('g')
			.classed('layer', true)
      .attr('fill', d => z(d.key));

    const bars = this.g.selectAll('g.layer').selectAll('rect')
			.data(d => d, e => e.data.dow);

		bars.exit().remove();
		bars.enter().append('rect')
			.attr('width', this.x.bandwidth())
			.merge(bars)
		.transition().duration(750)
			.attr('x', d => this.x(d.data.dow))
			.attr('y', d => this.y(d[1]))
      .attr('height', d => this.y(d[0]) - this.y(d[1]));

    bars.enter().append('text')
      .text(d => d3.format(',d')(d[1] - d[0]))
      .attr('y', d => this.y(d[1]) + (this.y(d[0]) - this.y(d[1])) / 2)
      .attr('x', d => this.x(d.data.dow) + this.x.bandwidth() / 2 - 15)
      .style('fill', '#ffffff');

    const text = this.g.selectAll('.text')
			.data(data, d => d.dow);
		text.exit().remove();

		text.enter().append('text')
			.attr('class', 'text')
			.attr('text-anchor', 'middle')
			.merge(text)
		.transition().duration(750)
			.attr('x', d => this.x(d.dow) + this.x.bandwidth() / 2)
			.attr('y', d => this.y(getTotal(d, shifts)) - 5)
      .text(d => getTotal(d, shifts));

    const legend = this.svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(shifts.slice().reverse())
      .enter().append('g')
      .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');

  legend.append('rect')
      .attr('x', this.width + 100)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', z)
      .attr('stroke', z)
      .attr('stroke-width', 2);

  legend.append('text')
      .attr('x', this.width - 24 + 100)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
  }

  /* export graph to SVG */
  export() {
    const save = (dataBlob, filesize) => {
      saveAs(dataBlob, `Weekly Resource_1 ${this.filterText}.png`);
    };

    const svgString = getSVGString(this.svg.node());
    svgString2Image(svgString, 2 * this.width, 2 * this.height, 'png', save);
  }

  /* action on filter select */
  filterSubmitted(req) {
    this.loaderService.display(true);
    const newReq: IMeResourceReqModel = { week: req.weekSelect, year: req.yearSelect, resource: req.lineSelect };
    this.filterText = `${getLineByResource(req.lineSelect).description} - Week ${req.weekSelect}-${req.yearSelect}`;
    this.requestData(newReq);
  }
}

function getTotal(data, shifts) {
  let total = 0;
  shifts.forEach(element => {
    total += data[`${element}`];
  });
  return total;
}

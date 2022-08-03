import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as saveAs from 'file-saver';
import { LoaderService } from '../../../../shared/services/loader.service';
import { LineDescription } from '../../../../shared/data/line-description.data';
import { svgString2Image, getSVGString } from '../../../../shared/data/svg-helpers';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import { YieldsService } from '../../services/yield.service';

@Component({
  selector: 'app-weekly-multi',
  templateUrl: './weekly-multi.component.html',
  styleUrls: ['./weekly-multi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WeeklyMultiComponent implements OnInit {

  weeklyYieldsOverall: Observable<any> = null;
  dataSource = null;

  colours = [
    '#182bff', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#fabebe', '#008080', '#9a6324', '#4286f4',
    '#800000', '#808000', '#000075', '#808080', '#000000', '#e6194b', '#3cb44b', 	'#FFD700', '#FFC133'
  ];

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};
  private lineOffset = 10;
  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private div: any;
  private line: any;
  private dataNest: any;

  public lineDescription = LineDescription;
  tableColumns = [
    {
      name: 'year',
      header: 'Year'
    },
    {
      name: 'week',
      header: 'Week'
    },
    {
      name: 'line',
      header: 'Line'
    },
    {
      name: 'total',
      header: 'Total Produced'
    },
    {
      name: 'rejects',
      header: 'Rejects'
    },
    {
      name: 'yield',
      header: 'Yield (%)'
    }
  ];

  constructor(
    private yieldsService: YieldsService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) {
    this.loaderService.display(true);
  }

  ngOnInit() {
    this.yieldsService.getWeeklyLines().subscribe(
      success => {
        this.loaderService.display(false);
        this.dataSource = success.filter(d => d.year !== 0);

        this.initSvg(this.dataSource);
        this.initAxis(this.dataSource);
        this.drawAxis();
        this.drawBars();
        this.drawTargetLines();
      },
      err => {
        this.toastr.error('Error fetching yields data.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loaderService.display(false);
      }
    );

  }

  initSvg(data) {

    this.svg = d3.select('#yieldsWeeklyGraph');
    this.svg.attr('width', 50 + 7 * data.length + 75);

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right - 170;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom - 50;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(data) {
    this.x = d3Scale.scaleBand().range([0, this.width]).padding(.3);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);

    this.x.domain(data.map(d => (d.year + '-' + d.week.toString().padStart(2, '0'))));
    this.y.domain([60, 100]);

    this.line = d3.line()
      .defined((d) => d['yield'] > 60)
      .x(d => this.x(d['year'] + '-' + d['week'].toString().padStart(2, '0')) + this.lineOffset)
      .y(d => this.y(d['yield']))
      .curve(d3.curveCatmullRom.alpha(0.5));

    this.div = d3.select('.tooltip-weekly');

    this.dataNest = d3.nest()
        .key(d => d['line'])
      .entries(this.dataSource);
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

  private drawBars() {
    const legend = this.svg.append('g');

    this.dataNest.forEach(function(d, i) {
      d.active = true;
      const lntxt = this.lineDescription.filter(l => (l.line === d.key.toLowerCase() || l.line === d.key.toUpperCase()))[0];
      const lineText = d.key === 'all' ? 'ALL' : lntxt.description + ' (' + lntxt.type + ')';

      this.g.append('path')
        .attr('fill', 'none')
        .attr('stroke', this.colours[i])
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2)
        .attr('id', 'tag' + d.key.replace(/\s+/g, ''))
        .attr('d', this.line(d.values));

      legend.append('rect')
        .attr('x', this.width + 50)
        .attr('y', this.margin.top + i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', this.colours[i]);

      legend.append('text')
        .attr('x', this.width + 70)
        .attr('y', this.margin.top + i * 20 + 10)
        .text(lineText)
        .on('click', function() {
          const active = d.active ? false : true,
          newOpacity = active ? 1 : 0;
          d3.selectAll('#tag' + d.key.replace(/\s+/g, ''))
            .transition().duration(100)
            .style('opacity', newOpacity);
          d3.select(this)
            .style('text-decoration', () => !active ? 'line-through' : 'none');
          d.active = active;
        });

    }.bind(this));
  }

  private drawTargetLines() {
    this.svg.selectAll('line.horizontalGrid').data([85, 90, 95]).enter()
      .append('line')
      .attr('class', 'target')
      .attr('x1', this.margin.left)
      .attr('x2', this.width + this.margin.left)
      .attr('y1', (d => this.y(d) + this.margin.top).bind(this))
      .attr('y2', (d => this.y(d) + this.margin.top).bind(this));
  }

  export() {
    const save = (dataBlob, filesize) => {
      saveAs(dataBlob, 'Weekly System Yields.png');
    };

    const svgString = getSVGString(this.svg.node());
    svgString2Image(svgString, 2 * this.width, 2 * this.height, 'png', save);

  }
}

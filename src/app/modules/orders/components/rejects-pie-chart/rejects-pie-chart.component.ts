import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IProductionOrderYield } from '../../../../shared/models/production-order-yield.model';
import * as d3 from 'd3';

@Component({
    selector: 'app-rejects-pie-chart',
    templateUrl: './rejects-pie-chart.component.html',
    styleUrls: ['./rejects-pie-chart.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class RejectsPieChartComponent implements OnInit {
  
  private _data = new BehaviorSubject<any>([]);
  public _rejects = new BehaviorSubject<any>([]);

  @Input()
  set data(value) {
      this._data.next(value);
  };

  get data() {
    return this._data.getValue();
  }

  @Input()
  set rejects(value) {
      this._rejects.next(value);
  };

  get rejects() {
    return this._rejects.getValue();
  }

  private svg: any;
  private g: any;
  private pieGenerator: any;
  private width: number;
  private height: number;
  private radius: number;

  colours = [
    '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
    '#ffffff', '#000000'
  ];

  displayedColumns = ['rejectCode', 'count', 'percentageBatch', 'percentageRej'];

  public graphData: IProductionOrderYield[];
  private total: number = 0;
  private totalRej: number = 0;

  constructor(){}

  ngOnInit() {
    this.setup();

    //this._data.subscribe(po => {
      //if(po) {
        this._rejects.subscribe(rej => {
          if(rej) {
            this.graphData = rej.filter(el => !el.rejectCode.includes('Accepted'));
            this.total = rej.map(el => el.count).reduce((prev, next) => prev + next);
            this.totalRej = this.graphData.length === 0 ? 0 : this.graphData.map(el => el.count).reduce((prev, next) => prev + next);
            
            if(!this.svg) {
              this.buildSVG();
              this.populatePie(this.graphData);
            } else {
              this.updatePie(this.graphData);
            }
          }
        })
     // }
    //});
  }

  /* setup dimensions */
  private setup(): void {
    this.width = this.height = 250;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  /* bulidng svg with selected dimensions */
  private buildSVG() {
    this.svg = d3.select('#rejectsPieChart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      
    this.g = this.svg.append("g")
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
          
    this.pieGenerator = d3.pie()
      .sort(null)
      .value(d => d['count']);
  }

  /* populate graph with initial data */
  private populatePie(graphData) {
    
    const arcs = this.pieGenerator(graphData);
    const color = d3.scaleOrdinal(this.colours);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    const labelArc = d3.arc()
      .outerRadius(this.radius - 30)
      .innerRadius(this.radius - 30);

    this.g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('fill', d => color(d.data.rejectCode))
      .attr('stroke', 'white')
      .attr('d', arc)
      .append('title')
      .text(d => `${d.data.rejectCode}: ${d.data.count}`);

    const text = this.g.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em');

    /* dont display text for small arcs */
    text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr('x', 0)
      .attr('y', '-0.7em')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .text(d => d.data.rejectCode);
    
    /* dont display text for small arcs */
    text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr('x', 0)
      .attr('y', '0.7em')
      .style('font-size', '12px')
      .attr('fill-opacity', 0.7)
      .text(d => d.data.count);
  }

  private updatePie(data) {
    
    this.pieGenerator = d3.pie().sort(null).value(d => d['count']);

    const color = d3.scaleOrdinal(this.colours);
    const arcs = this.pieGenerator(data);
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    const labelArc = d3.arc()
      .outerRadius(this.radius - 30)
      .innerRadius(this.radius - 30);

    this.g.selectAll('path')
      .remove()
    
    this.g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('stroke', 'white')
      .attr('fill', d => color(d.data.rejectCode))
      .attr('d', arc)
    
    this.g.selectAll('text')
      .remove()  

    const text = this.g
      .selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '0.35em');

    /* dont display text for small arcs */
    text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr('x', 0)
      .attr('y', '-0.7em')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .text(d => d.data.rejectCode);
    
    /* dont display text for small arcs */
    text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr('x', 0)
      .attr('y', '0.7em')
      .style('font-size', '12px')
      .attr('fill-opacity', 0.7)
      .text(d => d.data.count);
  }
}
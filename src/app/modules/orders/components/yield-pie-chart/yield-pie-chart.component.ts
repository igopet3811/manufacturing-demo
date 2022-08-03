import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IProductionOrderYield } from '../../../../shared/models/order-yield.model';

import * as d3 from 'd3';

@Component({
    selector: 'app-yield-pie-chart',
    templateUrl: './yield-pie-chart.component.html',
    styleUrls: ['./yield-pie-chart.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class OrderPieChartComponent implements OnInit {
  
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
  private total: number = 0;
  public graphData: IProductionOrderYield[];
  displayedColumns = ['rejectCode', 'count', 'percentageBatch'];

  constructor(

  ){ }

  ngOnInit() {
    this.setup();

    //this._data.subscribe(po => {
      //if(po) {
        this._rejects.subscribe(rej => {

          if(rej) {
            this.graphData = [{ rejectCode: 'Accepted', count: 0, color: '#3cb44b' }, { rejectCode: 'Rejected', count: 0, color: '#f44336' }];
            rej.forEach(el => {
              if(el.rejectCode.includes('Accepted')) {
                this.graphData[0].count += el.count;
              } else {
                  this.graphData[1].count += el.count;
                }
            });
            this.total = rej.map(el => el.count).reduce((prev, next) => prev + next);

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

  getTotalBatch() {
    return this.graphData !== undefined ? this.graphData.map(t => t.count).reduce((acc, value) => acc + value, 0) : 0;
  }

  /* setup dimensions */
  private setup(): void {
      this.width = this.height = 250;
      this.radius = Math.min(this.width, this.height) / 2;
  }

  /* bulidng svg with selected dimensions */
  private buildSVG() {
    this.svg = d3.select('#yieldPieChart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      
    this.g = this.svg.append('g')
        .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
          
    this.pieGenerator = d3.pie()
      .sort(null)
      .value(d => d['count']);
  }

  private populatePie(graphData) {
    const arcs = this.pieGenerator(graphData);
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    this.g.selectAll('path')
    .data(arcs)
    .enter().append('path')
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .attr('d', arc)
      .append('title')
      .text(d => `${d.data.rejectCode}: ${d.data.count}`);

    const text = this.g
      .selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em');

    text.append('tspan')
      .attr('x', 0)
      .attr('y', '-0.7em')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .text(d => d.data.rejectCode.charAt(0));
    
    text.append('tspan')
      .attr('x', 0)
      .attr('y', '0.7em')
      .style('font-size', '12px')
      .attr('fill-opacity', 0.7)
      .text(d => d.data.count);
  }

  /* update pie chart on order change */
  private updatePie(data) {
    
    this.pieGenerator = d3.pie().sort(null).value(d => d['count']);
    const arcs = this.pieGenerator(data);
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    this.g.selectAll('path')
      .remove()
    
    this.g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('stroke', 'white')
      .attr('fill', d => d.data.color)
      .attr('d', arc)
    
    this.g.selectAll('text')
      .remove()  

    const text = this.g
      .selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em');

    text.append('tspan')
      .attr('x', 0)
      .attr('y', '-0.7em')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .text(d => d.data.rejectCode.charAt(0));
    
    text.append('tspan')
      .attr('x', 0)
      .attr('y', '0.7em')
      .attr('fill-opacity', 0.7)
      .style('font-size', '12px')
      .text(d => d.data.count);
  }
}
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as saveAs from 'file-saver';

import { IProductionOrder } from '../../../../shared/models/order.model';
import { getLineDetails } from '../../../../shared/data/line-description.data';
import { average } from '../../../../shared/data/stats';
import { svgString2Image, getSVGString } from '../../../../shared/data/svg-helpers';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import d3Tip from 'd3-tip';

@Component({
    selector: 'app-order-dry-graph',
    templateUrl: './order-dry-graph.component.html',
    styleUrls: ['./order-dry-graph.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class OrderGraphComponent implements OnInit {
  
  private _data = new BehaviorSubject<any>([]);
  public orders: IProductionOrder[];
  public sharedFilteredData = [];

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};
  private options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  public runAvg; 
  public sampleRunAvg;

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  public positionList = [];
  public defaultSelectPosition = [];
  public machineList = [];
  public defaultMachineList = [];
  public dryLimits = {'upper': null, 'lower': null };
  public yDomain = {'upper': null, 'lower': null };
  public isChecked: boolean = false;
  public lineType: string = null;
  public onlySamplesData: IProductionOrder[];

  @Input()
  set data(value) {
      this._data.next(value);
  };

  get data() {
    return this._data.getValue();
  }

  constructor(){ }

  ngOnInit() {
    this._data.subscribe(po => {
      if(po) {
        this.isChecked = false;
        this.lineType = this.getLineInfo(po[0].line).type;
        this.orders = po.filter(data => data.dryWeigh != null);
        this.onlySamplesData = po.filter(data => data.wetWeigh != null);
        this.runAvg = average(this.orders.filter(sample => sample.rejectCode === null).map(sample => sample.wpp), this.onlySamplesData[0].targetDry)*100;
        this.sampleRunAvg = average(this.onlySamplesData.filter(sample => sample.rejectCode === null).map(sample => sample.wpp), this.onlySamplesData[0].targetDry)*100;
        this.positionList = this.defaultSelectPosition = Array.from(new Set(Array.from(po.filter(el => el.location !== null).map(item => item.location).sort())));
        this.machineList = this.defaultMachineList = Array.from(new Set(Array.from(po.filter(el => el.machine !== null).map(item => item.machine).sort())));
        this.dryLimits = {
          lower: this.orders[0].lowerDry,
          upper: this.orders[0].upperDry
        };
        this.yDomain = {
          lower: Math.round(this.orders[0].targetDry * .85),
          upper: Math.round(this.orders[0].targetDry * 1.15)
        };

        if(!!this.svg) this.svg.selectAll('*').remove();
        this.initSvg(this.orders);
        this.initAxis(this.orders);
        this.drawAxis();
        this.drawBars(this.orders);
        this.drawTargetLines(this.dryLimits);
        this.createVerticalLines(this.orders);
      }
    });
  }

  private initSvg(data) {
    this.svg = d3.select('#dw-graph');
    this.svg.attr('width', 60 + 20 * data.length);
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis(data) {
    this.x = d3Scale.scaleBand().range([0, this.width]).padding(.3);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(data.map((d) => d.serial));
    this.y.domain([this.yDomain.lower, this.yDomain.upper]);
  }

  private drawAxis() {
    this.g.append('g')
      .attr('class', 'xAxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
      .attr('class', 'yAxis')
      .call(d3Axis.axisLeft(this.y).ticks(20, 'd'))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em') 
      .text('TARGET');
  }

  /* draw the chart */
  private drawBars(data) {
    const tooltip = d3Tip().attr('class', 'tooltip-timeline-dry').direction('e').offset([0,5])
    .html((d) => {
      let passes = d.stFile === null ? d.passes : (+d.stFile.split(':')[3] + +d.stFile.split(':')[7] + +d.stFile.split(':')[11]);
      let content = "<span style='margin-left: 2.5px;'><b>" + 'Stent #: ' + d.serial + "</b></span><br>";
      content +=`
          <table style="margin-top: 2.5px;">
                  <tr><td>Weight_1: </td><td style="text-align: right">` + d.preWeigh + `</td></tr>
                  <tr><td>Weight_2: </td><td style="text-align: right">` + d.wetWeigh + `</td></tr>
                  <tr><td>Weight_3: </td><td style="text-align: right">` + d.dryWeigh + `</td></tr>
                  <tr><td>Weight_4: </td><td style="text-align: right">` + d.targetDry + `</td></tr>
                  <tr><td>Target: </td><td style="text-align: right">` + d.wpp + `</td></tr>
                  <tr><td>Machine: </td><td style="text-align: right">` + d.machine + `</td></tr>
                  <tr><td>Prod Time: </td><td style="text-align: right">` + new Date(d.prodTime).toLocaleString('en-GB', this.options) + `</td></tr>
                  <tr><td>Shift: </td><td style="text-align: right">` + d.shift + `</td></tr>
                  <tr><td>Location: </td><td style="text-align: right">` + d.location + `</td></tr>
                  <tr><td>Rate: </td><td style="text-align: right">` + d.flow + `</td></tr>
                  <tr><td>Rounds: </td><td style="text-align: right">` + passes + `</td></tr>
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
      .attr('x', d => this.x(d.serial))
      .attr('y', d => this.y(Math.max(d.targetDry, d.wpp > this.yDomain.upper ? this.yDomain.upper : d.wpp)))
      .attr('width', this.x.bandwidth())
      .attr('height', d => {
        if(d.wpp <= this.yDomain.lower) {
          return Math.abs(this.y(this.yDomain.lower)-this.y(d.targetDry))
        } else if(d.wpp > this.yDomain.upper) {
          return Math.abs(this.y(this.yDomain.upper)-this.y(d.targetDry))
        }
        else return Math.abs(this.y(d.wpp)-this.y(d.targetDry))
      })
      .attr('fill', d => d.passFail ? '#004c00' : '#e08686')
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);
    
    this.g.selectAll('.xAxis .tick')
    .data(data)
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);

    this.g.selectAll('text.bar')
      .data(data)
      .enter().append('text')
      .attr('class', 'reject')
      .attr('text-anchor', 'middle')
      .attr('x', d => (this.x(d.serial) + this.x.bandwidth()/2))
      .attr('y', d => {
        if(d.wpp <= d.targetDry) return this.y(Math.max(d.targetDry, d.wpp)) - 5;
        else if(d.wpp > d.targetDry) return this.y(Math.max(d.targetDry)) + 10;
      })
      .text(d => d.rejectCode !== null ? d.rejectCode : null);
  }

  filterByPosition(evt) {
    let filteredData = [];
    let initData = this.orders.filter(item => this.defaultMachineList.includes(item.machine.trim()));
    if(evt.value.length === 0){
      this.defaultSelectPosition = this.positionList;
      filteredData = initData;
    } else {
      filteredData = initData.filter(item => evt.value.includes(item.location.trim()));
    }
    this.redrawGraph(filteredData);
  }

  filterByMachine(evt) {
    let filteredData = [];
    let initData = this.orders.filter(item => this.defaultSelectPosition.includes(item.location.trim()));
    if(evt.value.length === 0){
      this.defaultMachineList = this.machineList;
      filteredData = initData;
    } else {
      filteredData = initData.filter(item => evt.value.includes(item.machine.trim()));
    }
    this.redrawGraph(filteredData);
  }

  redrawGraph(data) {
    this.svg.selectAll(['g', 'line', 'text']).remove();
    this.initSvg(data);
    this.initAxis(data);
    this.drawAxis();
    this.drawBars(data);
    this.drawTargetLines(this.dryLimits);
    this.createVerticalLines(data);
  }

  private drawTargetLines(limits) {
    const txtUpperY = 1 - ((limits.upper - this.yDomain.lower)/(this.yDomain.upper - this.yDomain.lower));
    const txtLowerY = 1 - ((limits.lower - this.yDomain.lower)/(this.yDomain.upper - this.yDomain.lower));

    this.svg.selectAll('line.horizontalGrid').data([limits.lower, limits.upper]).enter()
      .append('line')
      .attr('class', 'target-dry')
      .attr('x1', this.margin.left)
      .attr('x2', this.width + this.margin.left)
      .attr('y1', (d => this.y(d) + this.margin.top).bind(this))
      .attr('y2', (d => this.y(d) + this.margin.top).bind(this));

    this.svg.append('text')
      .attr('class', 'dry-limits')
      .attr('transform', 'translate(' + (this.margin.left + 5) + ',' + (this.margin.top + this.height * txtUpperY - 5) + ')')
      .attr('dy', '.2em')
      .attr('text-anchor', 'start')
      .text(limits.upper);

    this.svg.append('text')
      .attr('class', 'dry-limits')
      .attr('transform', 'translate(' + (this.margin.left + 5) + ',' + (this.margin.top + this.height * txtLowerY - 5) + ')')
      .attr('dy', '.2em')
      .attr('text-anchor', 'start')
      .text(limits.lower);
  }

  createVerticalLines(data: IProductionOrder[]) {
    let verticalPoints = [];

    for(let i = 0; i < data.length - 1; i++) {
      if(data[i].shift !== data[i+1].shift) {
        verticalPoints.push({
          midTime: new Date((Date.parse(data[i].prodTime.toString()) + Date.parse(data[i+1].prodTime.toString()))/2),
          splitPoint: ((i + i + 1) / 2) * (this.width / data.length) + this.margin.left + 11,
          shiftLeft: data[i].shift,
          shiftRight: data[i+1].shift
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
        .style("stroke-width", 1)
        .style("fill", "none")
        .style("stroke", "red")

      this.svg.append('text')
        .attr('class', 'shift-label')
        .attr('transform', 'translate(' + (item.splitPoint - 28) + ',' + (this.margin.top + this.height - 10) + ')')
        .attr('dy', '.2em')
        .attr('text-anchor', 'start')
        .text(item.shiftLeft.substring(0, 4));
      
      this.svg.append('text')
        .attr('class', 'shift-label')
        .attr('transform', 'translate(' + (item.splitPoint + 5) + ',' + (this.margin.top + this.height - 10) + ')')
        .attr('dy', '.2em')
        .attr('text-anchor', 'start')
        .text(item.shiftRight.substring(0, 4));
    }
  }

  getLineInfo(line: string) {
    return getLineDetails(line);
  }

  toggle(evt) {
    this.isChecked = (this.isChecked === true )? false : true;
    if(!!this.isChecked) this.redrawGraph(this.onlySamplesData)
    else this.redrawGraph(this.orders)
  }

  export() {
    let fileName = `${this.orders[0].order} Timeline_2.png`;
    const save = (dataBlob, filesize) => {
      saveAs(dataBlob, fileName);
    };

    const svgString = getSVGString(this.svg.node());
    svgString2Image(svgString, 2*this.width, 2*this.height, 'png', save);

  }
}
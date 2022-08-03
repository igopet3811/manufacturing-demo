import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { YieldsService } from '../../modules/yields/services/yield.service';

@Directive({
  selector: '[poRowDetail]'
})
export class PoRowDetailDirective {
  private row: any;
  private tRef: TemplateRef<any>;
  private opened: boolean;
  private tableData: any;

  @HostBinding('class.expanded')
  get expanded(): boolean {
    return this.opened;
  }

  @Input()
  set poRowDetail(value: any) {
    if (value !== this.row) {
      this.row = value;

    if(this.row.lineType === 'NEW'){
      this.yieldsService.getSampleExpandable().take(1).subscribe(
        success => {
          this.tableData = success;
        },
        err => {

        }
      )
    }
    }
  }

  @Input('poRowDetailTpl')
  set template(value: TemplateRef<any>) {
    if (value !== this.tRef) {
      this.tRef = value;
    }
  }

  constructor(
    private vcRef: ViewContainerRef,
    private yieldsService: YieldsService
  ) { }

  @HostListener('click', ['$event'])
  onClick(event: any): void {
    if(this.row.lineType === 'NEW' && event.target.innerText === 'expand_more') this.toggle();
  }

  toggle(): void {
    if (this.opened) {
      this.vcRef.clear();
    } else {
      this.render();
    }
    this.opened = this.vcRef.length > 0;
  }

  private render(): void {
    this.vcRef.clear();      
    if (this.tRef && this.row) {
      this.vcRef.createEmbeddedView(this.tRef, { row: this.tableData });
    }
  }
}
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend_angular';
  constructor(private modalService: NgbModal) {
  }
  public open(modal: any): void {
    this.modalService.open(modal);
  }
  // Set our map properties
  mapCenter = [-122.4194, 37.7749];
  basemapType = 'satellite';
  mapZoomLevel = 4;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }
}

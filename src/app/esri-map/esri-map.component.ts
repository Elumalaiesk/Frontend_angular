import { 
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

import { loadModules } from "esri-loader";
import esri = __esri; // Esri TypeScript Types
import {SharedService} from 'src/app/shared.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) 
  private mapViewEl:any;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = "streets";
  private _loaded = false;
  private _view: any = null;
  address:any;
  latitude:any;
  longitude:any;
  site_name:any;
  public chart: any;
  public chart_1: any;
  public chart_2: any;
  public chart_3: any;
  public chart_4: any;
  public show:boolean = true;
  public default:boolean = true;
  public empty_data:boolean = false;
  public chart_set : boolean = false;
  public chart_1_set : boolean = false;
  public chart_2_set : boolean = false;
  public chart_3_set : boolean = false;
  public chart_4_set : boolean = false;
  public show_data:boolean = false;
  public show_data_Note:boolean = false;
  public geoJSON_data : any;
  public geoJSON_data_check:boolean = false;
  public Color_map_Date : any ;
  public Color_map_Year : any ;
  public Color_map_Month : any ;


  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor(private service:SharedService) {
    
  }
  
  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, FeatureLayer, locator, esriConfig, Graphic, Point,reactiveUtils,GeoJSONLayer,Legend] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/rest/locator",
        "esri/config",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/core/reactiveUtils",
        "esri/layers/GeoJSONLayer",
        "esri/widgets/Legend"
      ]);

      esriConfig.apiKey = "AAPKdc7b2ff2df0643c9862ec9d816a967c68kookelLZzekcspoX5TtjXoVKK9lvFU3vJ6sILgSwqXg8efMFEBCc9NlnqYtlAid";
      /************************* Background color for map Starts *************************/

      // Feature Layer
        const trailsRenderer = {
          type: "simple",
          symbol: {
            color: [128,128,128, 0.8],
            type: "simple-line",
            style: "solid",
            width: '1'
          }
        }
        const featureLayer = new FeatureLayer({
          url:
            "https://services7.arcgis.com/bIQG541hierh9sHw/arcgis/rest/services/NEON_Shape_file/FeatureServer/1",
          renderer: trailsRenderer
          
        });
        const trailheadsLayer = new FeatureLayer({
          url: "https://services7.arcgis.com/bIQG541hierh9sHw/arcgis/rest/services/NEON_Shape_file/FeatureServer/0",
          renderer: {
            type: "simple", // Use a simple renderer
            symbol: {
              type: "simple-marker", // Use a simple marker symbol
              style: "circle", // Set the style of the marker symbol to circle
              color: [255, 0, 0, 1], // Set the color of the marker symbol (red)
              size: 10, // Set the size of the marker symbol
              outline: {
                color: [0, 0, 0, 1], // Set the color of the outline (white)
                width: 3 // Set the width of the outline
              }
            }
          },
          popupTemplate: {
            title: "{SiteName}",
            content: [
              {
                type: "text",
                text: "<b>Domain Name:</b> {DomainName}<br>" +
                      "<b>Site ID:</b> {SiteID}<br>" +
                      "<b>Site Type:</b> {SiteType}<br>" +
                      "<b>Site Host:</b> {SiteHost}<br>" +
                      "<b>State:</b> {State}<br>" +
                      "<b>Full State:</b> {Full_State}<br>" +
                      "<b>Latitude:</b> {Latitude}<br>" +
                      "<b>Longitude:</b> {Longitude}"
              }
            ]
          }
        });
        const url = "/assets/Json/All_coords_JSON_24_03_23_V2.json";
        // create a new blob from geojson featurecollection
        const blob = new Blob([JSON.stringify(this.geoJSON_data)], {
          type: "application/json"
          });
        // URL reference to the blob
        const url_1 = URL.createObjectURL(blob);
      const renderer = {
        type: "simple",
        field: "H2OSOI",
        symbol: {
          type: "simple-fill",
          color: "orange",
          outline: {
            color: "#CFD3D4",
            width: '0'
          }
        },
        visualVariables: [{
          type: "color",
          field: "H2OSOI",
          stops: [
            { value: 2, color: "#0000FF" },
            { value: 1.6, color: "#4169E1" },
            { value: 1.3, color: "#1D90FF" },
            { value: 0.8, color: "#00BFFF" },
            { value: 0.5, color: "#FFFFFF" },
            { value: 0, color: "#FFFFFF" },
            { value: -0.5, color: "#FFFFFF" },
            { value: -0.8, color: "#FCD37F" },
            { value: -1.3, color: "#FFAA00" },
            { value: -1.6, color: "#E60000" },
            { value: -2, color: "#730000" },
        ]
        }]
      };
      const template = {
        title: "H2OSOI Info",
        content: "H2OSOI Value {H2OSOI} ",
        fieldInfos: [
          {
            fieldName: 'H2OSOI'
          }
        ]
      };
      
      const geojsonLayer = new GeoJSONLayer({
        url: url_1,
        popupTemplate: template,
        renderer: renderer,
        spatialReference: {
          wkid: 4326
        },
        orderBy: {
          field: "H2OSOI",
          type: "double"
        }
      });
      
      /************************* Background color for map Ends *************************/

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: 'gray-vector',
        layers: [geojsonLayer,featureLayer,trailheadsLayer]
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [-95,40],//USA Center Coordinate
        zoom: this._zoom,
        map: map
      };

      const serviceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

        this._view = new EsriMapView(mapViewProperties);
        // Disable dragging and panning of the map view
        this._view.on("drag", function(event:any) {
          event.stopPropagation();
        });
        this._view.on("mouse-wheel", function(event:any) {
          event.stopPropagation();
          event.preventDefault();
        });
        this._view.on("click", function(evt:any){
          const params = {
            location: evt.mapPoint
          };
    
         locator.locationToAddress(serviceUrl, params)
            .then(function(response:any) { // Show the address found
              const address = response.address;
              showAddress(address, evt.mapPoint);
            }, function(err:any) { // Show no address found
              showAddress("No address found.", evt.mapPoint);
            });
    
        });
        const view = this._view;
        const showAddress = (address:any, pt:any) => {
          // view.popup.open({
          //   title:  + Math.round(pt.longitude * 100000)/100000 + ", " + Math.round(pt.latitude * 100000)/100000,
          //   content: address,
          //   location: pt
          // });
          this.address = address;
          this.latitude = Math.round(pt.latitude * 100000)/100000;
          this.longitude = Math.round(pt.longitude * 100000)/100000;
          this.show_data_Note = true;
        }
        //Loader Gif
        reactiveUtils.when(
          () => view.updating === false, 
          (evt:any) => {
            this.show = false
            }
          );
        // Adding Legend
        const legendDiv = document.createElement("div");
        legendDiv.classList.add("legend");
      
        const legendTitle = document.createElement("div");
        legendTitle.classList.add("legend-title");
        legendTitle.textContent = "H2OSOI Legend";
        legendDiv.appendChild(legendTitle);

        const legendContainer = document.createElement("div");
        legendContainer.classList.add("legend-container");
        legendDiv.appendChild(legendContainer);
      
        const legendLabels = [
          { label: "SW4", color: "#0000FF" },
          { label: "SW3", color: "#4169E1" },
          { label: "SW2", color: "#1D90FF" },
          { label: "SW1", color: "#00BFFF" },
          { label: "SW0", color: "#8CCDEF" },
          { label: "Normal", color: "#FFFFFF"},
          { label: "SD0", color: "#FFFF00" },
          { label: "SD1", color: "#FCD37F" },
          { label: "SD2", color: "#FFAA00" },
          { label: "SD3", color: "#E60000" },
          { label: "SD4", color: "#730000" },
        ];
      
        legendLabels.forEach((item) => {
          const legendItem = document.createElement("div");
          legendItem.classList.add("legend-item");
      
          const legendColor = document.createElement("div");
          legendColor.classList.add("legend-color");
          legendColor.style.backgroundColor = item.color;
          legendItem.appendChild(legendColor);
      
          const legendLabel = document.createElement("div");
          legendLabel.classList.add("legend-label");
          legendLabel.textContent = item.label;
          legendItem.appendChild(legendLabel);
      
          legendContainer.appendChild(legendItem);
        });
      
        view.ui.add(legendDiv, "bottom-left");
        
        await this._view.when();
        return this._view;
      

    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    this.getColorMapData();
    console.log(this.geoJSON_data_check);
    if(this.geoJSON_data_check == true)
    {
      
    }
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
      this.destroyChart();
    }
  }

  Nc_dates = '2018-01-01';
  Nc_end_dates = '2018-01-10';
  Display_Date = '2018-01-01';
  Display_End_Date = '2018-01-10';
  Nc_Year_col_map = '2018';
  Nc_Month_col_map = '1';
  Nc_color_Map_date = '2018-01-01';
  onClickDate(formdata:any){
    console.log(formdata.value.Nc_date);
    console.log(formdata.value.Nc_end_date);                                                                          
    this.Display_Date = formdata.value.Nc_date;
    this.Display_End_Date = formdata.value.Nc_end_date;
    this.show_data = true;
    this.show_data_Note = false;
    
  }
  Soil = '0';
  SoilLevel = '';
  dayCount = '';
  Count="10";
  
  onClickSubmit(formdata:any) {
    this.destroyChart();
    this.SoilLevel = formdata.value.SoilLevel;
    this.dayCount = formdata.value.dcount;
    this.getdata();
  }
  WeekCount = '1';
  Week = '1';

  onClickWeek(formdata:any) {
    console.log(formdata.value.Nc_color_Map_date)
    this.show = true;
    if(formdata.value.Nc_color_Map_date == undefined)
    {
      this.Color_map_Date = '2018-01-01';
    }
    else
    {
      console.log("New Check check")
      this.Color_map_Date = formdata.value.Nc_color_Map_date;
    }
    this.WeekCount = formdata.value.WeekCount;
    this.getColorMapData();
  }

  getColorMapData(){
    if(this.Color_map_Date == undefined)
    {
      this.Color_map_Date = '2018-01-01'
    }
    else
    {
      this.Color_map_Date = this.Color_map_Date;
      
    }
    var json_data = {"lat":this.latitude,"lon":this.longitude,"soilLevel":this.SoilLevel,"DayCount":this.dayCount,"SiteName":this.site_name,"Display_Date":this.Display_Date,"Display_End_Date":this.Display_End_Date,"Nc_Color_Map_Date":this.Color_map_Date,"Week_count":this.WeekCount};
    console.log(json_data)
    this.service.getColorMapJson(json_data).then((res:any)=>{
      this.initializeColorMap(res);
    });
  }

  initializeColorMap(res:any){
    this.geoJSON_data = res;
    console.log(this.geoJSON_data);
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      this.show = false;
      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  } 

  getdata(){
    this.show = true;
    this.destroyChart();
    // To get Site name
    if (Math.trunc(this.latitude) == 46 && Math.trunc(this.longitude) == -122) {
      this.site_name = "ABBY";
      console.log(this.site_name);
    }
    else if (Math.trunc(this.latitude)== 39 && Math.trunc(this.longitude)== -78){
      this.site_name = "BLAN";
      console.log(this.site_name);
    }
    else if ((Math.trunc(this.latitude)== 33 || Math.trunc(this.latitude)== 34 ) && Math.trunc(this.longitude)== -97){
      this.site_name = "CLBJ";
      console.log(this.site_name);
    }
    else if ((Math.trunc(this.latitude)== 32 || Math.trunc(this.latitude)== 33) && Math.trunc(this.longitude)== -87){
      this.site_name = "TALL";
      console.log(this.site_name);
    }
    else if ((Math.trunc(this.latitude)== 47 || Math.trunc(this.latitude)== 48) && Math.trunc(this.longitude)== -99){
      this.site_name = "WOOD";
      console.log(this.site_name);
    }
    else{
      this.site_name = "Kindly Click on Marked site only";
      this.default = false;
      this.empty_data = true;
      console.log(this.site_name);
    }
    var json_data = {"lat":this.latitude,"lon":this.longitude,"soilLevel":this.SoilLevel,"DayCount":this.dayCount,"SiteName":this.site_name,"Display_Date":this.Display_Date,"Display_End_Date":this.Display_End_Date};
    console.log(json_data)
    this.service.getNcList(json_data).then((res:any)=>{
      console.log(res);
      this.createChart(res);
      this.show = false;
    });

  }

  getneondata(){
    this.destroyChart();
    this.show = true;
    console.log(this.latitude,this.longitude);
    var json_data = {"lat":this.latitude,"lon":this.longitude,"soilLevel":this.SoilLevel,"DayCount":this.dayCount,"SiteName":this.site_name,"Display_Date":this.Display_Date,"Display_End_Date":this.Display_End_Date};
    console.log(json_data);
    if( this.site_name != 'Kindly Click on Marked site only'){
      this.service.getNeonList(json_data).then((res:any)=>{
        console.log(res);
        this.createChart_1(res);
        this.show = false
      });
    }
  }
  YearCount = '';
  Years = '5';
  onClickYears(formdata:any) {
    this.chart_2.destroy();
    this.YearCount = formdata.value.YearCount;
    this.getReanalysisdata();
  }

  getReanalysisdata(){
    this.destroyChart();
    this.show = true;
    console.log(this.latitude,this.longitude);
    var json_data = {"lat":this.latitude,"lon":this.longitude,"YearCount":this.YearCount,"SiteName":this.site_name,"Display_Date":this.Display_Date,"Display_End_Date":this.Display_End_Date};
    if( this.site_name != 'Default'){
      this.service.getReanalysisList(json_data).then((res:any)=>{
        console.log(res);
        this.createChart_2(res);
        this.show = false;
      });
    }
  }
  YearCount_2 = '';
  Years_2 = '5';
  onClickYears_Mean(formdata:any) {
    console.log(formdata.value);
    this.chart_3.destroy();
    this.YearCount = formdata.value.YearCount_2;
    this.getMeandata();
  }
  getMeandata(){
    this.destroyChart();
    this.show = true;
    var json_data = {"lat":this.latitude,"lon":this.longitude,"YearCount":this.YearCount,"SiteName":this.site_name,"Display_Date":this.Display_Date,"Display_End_Date":this.Display_End_Date};
    if( this.site_name != 'Default'){
      this.service.getMeanList(json_data).then((res:any)=>{
        console.log(res);
        this.createChart_3(res);
        this.show = false;
      });
    }
  }
  getMeanNcardata(){
    this.destroyChart();
    this.show = true;
    var json_data = {"lat":this.latitude,"lon":this.longitude,"YearCount":this.YearCount,"SiteName":this.site_name,"Display_Date":this.Display_Date,"Display_End_Date":this.Display_End_Date};
    if( this.site_name != 'Default'){
      this.service.getMeanNcarList(json_data).then((res:any)=>{
        console.log(res);
        this.createChart_4(res);
        this.show = false;
      });
    }
  }

  createChart(result:any){
    this.chart_set = true;
    // To get H2OSOI Values
    var h2osoi = [];
    var era_5 = [];
    for(var i in result.H2OSOI)
      h2osoi.push(...[result.H2OSOI[i]]);
    
    for(var i in result.ERA5)
    {
      era_5.push(...[result.ERA5[i]]);
    }
    // To get Date
    var Date_List = [];
    var Date_new = [];
    var date_li;
    var date_li_1;
    var date_li_2;
    var j = 0
    for(var i in result.Date)
    {
      date_li = new Date(result.Date[i]);
      date_li_1 = date_li.setDate(date_li.getDate());
      date_li_2 = new Date(date_li_1).toLocaleDateString("en-GB")
      
      Date_new.push(date_li_1)
      // ... These three dots is to form list without key value
      Date_List.push(...[new Date(Date_new[j]).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' })]);
      
      j = j+1
    }
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: Date_List, 
	       datasets: [
          {
            label: "CESM2",
            data: h2osoi,
            backgroundColor: 'red'
          },
          {
            label: "ERA-5",
            data: era_5,
            backgroundColor: 'black'
          }  
        ]
      },
      options: {
        aspectRatio:2
      }
      
    });
  }
  
  // Chart For Ncar Vs Neon Tab
  createChart_1(result:any){
    console.log(result);
    this.chart_1_set = true;  
    // To get H2OSOI Values
    var NCAR_H2OSOI_Mean = [];
    for(var i in result.NCAR_H2OSOI_Mean)
      NCAR_H2OSOI_Mean.push(...[result.NCAR_H2OSOI_Mean[i]]);
    
    //   // To get Date
    // var Date_List = [];
    // for(var i in result.Date)
    //   // ... These three dots is to form list without key value
    //   Date_List.push(...[result.Date[i]]);
    // To get Date
    var Date_List = [];
    var Date_new = [];
    var date_li;
    var date_li_1;
    var date_li_2;
    var j = 0
    for(var i in result.Date)
    {
      date_li = new Date(result.Date[i]);
      date_li_1 = date_li.setDate(date_li.getDate());
      date_li_2 = new Date(date_li_1).toLocaleDateString("en-GB")
      
      Date_new.push(date_li_1)
      // ... These three dots is to form list without key value
      Date_List.push(...[new Date(Date_new[j]).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' })]);
      
      j = j+1
    }
    var NEON_VSWC_Mean = [];
    for(var i in result.NEON_VSWC_Mean)
      NEON_VSWC_Mean.push(...[result.NEON_VSWC_Mean[i]])
    var ERA_5 = []
    for(var i in result.ERA_5)
    {
      ERA_5.push(...[result.ERA_5[i]])
    }
    this.chart_1 = new Chart("MyChart_1", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: Date_List, 
	       datasets: [
          {
            label: "CESM2",
            data: NCAR_H2OSOI_Mean,
            backgroundColor: 'red'
          },
          {
            label: "NEON",
            data: NEON_VSWC_Mean,
            backgroundColor: 'blue'
          },
          {
            label: "ERA-5",
            data: ERA_5,
            backgroundColor: 'black'
          }  
        ]
      },
      options: {
        aspectRatio:2
      }
      
    });
  }

  // Chart For Reanalysis Tab
  createChart_2(result:any){ 
    this.chart_2_set = true; 
    // To get swvRZ Values
    var ERA5_List = [];
    var MEERA_2_List = [];
    var Day_List = [];
    for(var i in result.ERA5) {
      ERA5_List.push(...[result.ERA5[i]]);
      Day_List.push(i);
    }
    for(var i in result.MEERA_2) {
      MEERA_2_List.push(...[result.MEERA_2[i]]);
    }
    // To get Date
    var Date_List = [];
    for(var i in result.Date)
      // ... These three dots is to form list without key value
      Date_List.push(...[new Date(result.Date[i]).toLocaleDateString("en-GB")]);
    this.chart_2 = new Chart("MyChart_2", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: Date_List, 
	       datasets: [
          {
            label: "ERA5",
            data: ERA5_List,
            backgroundColor: 'blue'
          },
          {
            label: "MEERA_2",
            data: MEERA_2_List,
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        aspectRatio:2
      }
      
    });
  }

  // Chart For Mean Tab
  createChart_3(result:any){
    this.chart_3_set = true;  
    // To get swvRZ Values
    var Mean_List = [];
    var Day_List = [];
    for(var i in result.Mean) {
      Mean_List.push(...[result.Mean[i]]);
      Day_List.push(i);
    }
    // To get Date
    var Date_List = [];
    for(var i in result.Date)
      // ... These three dots is to form list without key value
      Date_List.push(...[new Date(result.Date[i]).toLocaleDateString("en-GB")]);
    this.chart_3 = new Chart("MyChart_3", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: Date_List, 
	       datasets: [
          {
            label: "Average mean of ERA-5 and MEERA-2",
            data: Mean_List,
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        aspectRatio:2
      }
      
    });
  }
  // Chart For Mean Tab
  createChart_4(result:any){
    this.chart_4_set = true;  
    // To get swvRZ Values
    var Mean_List = [];
    var H2OSOI_List = [];
    var Date_List = [];
    // var date_Li = new Date(result.Date[0]);
    // console.log(date_Li.toLocaleDateString("default"));
    for(var i in result.H2OSOI) {
      H2OSOI_List.push(...[result.H2OSOI[i]]);
      var date_Li = new Date(result.Date[i]);
      Date_List.push(date_Li.toLocaleDateString("default"));
    }
    for(var i in result.Mean) {
      Mean_List.push(...[result.Mean[i]]);
    }
    this.chart_4 = new Chart("MyChart_4", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: Date_List, 
	       datasets: [
          {
            label: "H2OSOI",
            data: H2OSOI_List,
            backgroundColor: 'blue'
          },
          {
            label: "Average mean of ERA-5 and MEERA-2",
            data: Mean_List,
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        aspectRatio:2
      }
      
    });
  }
  // Destroy H2SOI Chart
  destroyChart(){
    if(this.chart_set)
    {
      this.chart.destroy();
    }
    if(this.chart_1_set)
    {
      this.chart_1.destroy();
    }
    if(this.chart_2_set)
    {
      this.chart_2.destroy();
    }
    if(this.chart_3_set)
    {
      this.chart_3.destroy();
    }
    if(this.chart_4_set)
    {
      this.chart_4.destroy();
    }
  }
}

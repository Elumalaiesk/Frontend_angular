import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = "http://127.0.0.1:8000/";

  constructor(private http:HttpClient) { }

  async getNcList(val:any){
    return await lastValueFrom(this.http.post(this.APIUrl + 'getNcData/',val));
  }

  async getNeonList(val:any){
    return await lastValueFrom(this.http.post(this.APIUrl + 'getNeonData/',val));
  }

  async getReanalysisList(val:any){
    return await lastValueFrom(this.http.post(this.APIUrl + 'getReanalysisData/',val));
  }

  async getMeanList(val:any){
    return await lastValueFrom(this.http.post(this.APIUrl + 'getMeanData/',val));
  }

  async getMeanNcarList(val:any){
    return await lastValueFrom(this.http.post(this.APIUrl + 'getMeanNcarData/',val));
  }

  async getColorMapJson(val:any){
    return await lastValueFrom(this.http.post(this.APIUrl + 'getColorMapJsonData/',val));
  }
}

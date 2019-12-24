import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  constructor() { }
  private subject = new Subject;

  sendData(data:any){
    this.subject.next(data);
  }

  clearData(){
    this.subject.next();
  }

  getData():Observable<any>{
    return this.subject.asObservable();
  }
  sendDataSolde(data:any){
    this.subject.next(data);
  }

  clearDataSolde(){
    this.subject.next();
  }

  getDataSolde():Observable<any>{
    return this.subject.asObservable();
  }
  sendDataBanking(data:any){
    this.subject.next(data);
  }

  clearDataBanking(){
    this.subject.next();
  }

  getDataBanking():Observable<any>{
    return this.subject.asObservable();
  }
}

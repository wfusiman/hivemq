import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Client1Service {

  port='3300';
  endpoint="/api"
  url='http://' + window.location.hostname +':'+this.port+this.endpoint;

  constructor(
    private http: HttpClient
  ) { }


  getConfig(): Observable<any> {
    return this.http.get( this.url + '/stat');
  }
  
  conectar(): Observable<any> {
    //return of( { error: false, data: 'prueba'});
    return this.http.get( this.url + '/connect');
  }

  publicar( topic:string, data: string) : Observable<any> {
    //return of({ error: false, data: 'publish ok '});
    return this.http.post( this.url +'/publish', { topic: topic, message: data });
  }

  subscribir( topic: string): Observable<any> {
    //return of({ error: false, data:'subs ok '});
    return this.http.post( this.url + '/subscribe', { topic: topic, qos:0 } );
  }

  desubscribir( topic: string ):Observable<any> {
    return this.http.put( this.url + '/desubscribe', { topic: topic });
  }

  desconectar(): Observable<any> {
    return this.http.delete( this.url + '/disconnect');
  }

  getMessages(): Observable<any> {
    return this.http.get( this.url + '/messages');
  }

  refresh(): Observable<any> {
    return of({ error: false, data: 'arreglos de tema mensajes recibidos'});
  }

}

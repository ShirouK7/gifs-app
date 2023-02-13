import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})

export class GifsService {

  private _apiKey: string = 'Antmup2D7vqT0Y2KpBchYE1PETkTS551';
  private _baseUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  // TODO: Cambiar any por su tipo.
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor (private http:HttpClient) {

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  /*    
    if(localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }
  */

   }

  buscarGifs( query:string ) {
    
    query = query.trim().toLowerCase();

    if(!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      // Grabar en local storage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    /*
    Forma uno de realizar consulta:
    fetch('https://api.giphy.com/v1/gifs/search?api_key=Antmup2D7vqT0Y2KpBchYE1PETkTS551&q=dragon ball z&limit=10');
    .then( resp => {
      resp.json().then(data => {
        console.log(data);
      })
    })
    */

    /*
    Forma dos de realizar consulta:
    La función se agrega el término async,
    const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=Antmup2D7vqT0Y2KpBchYE1PETkTS551&q=dragon ball z&limit=10')
    const data = await resp.json();
    console.log(data);
    */

    // Definimos un objeto para estructurar la petición adecuadamente.
    const params = new HttpParams()
    .set('api_key', this._apiKey)
    .set('limit', '10')
    .set('q', query);

    // Anteriormente utilizabamos promesas ahora utilizaremos observables, los cuales son de tipo T.
    this.http.get<SearchGifsResponse>(`${this._baseUrl}/search`,{ params })
    .subscribe( (response) => {
      console.log(response.data);
      this.resultados = response.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    })

    console.log(this._historial);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CarteleraResponse, Movie } from '../interfaces/caretelera.interface';
import { MovieDetails } from '../interfaces/details.interface';
import { Cast, Credits } from '../interfaces/credits.interface';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  // URL base para las peticiones a The Movie Database API (TMDB)
  private URL = 'https://api.themoviedb.org//3';

  // API Key para autenticar las solicitudes a TMDB
  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODFhMDZjY2M1ZGI2NGJjOWQ2Y2RhZWViYmQxNjUwYyIsIm5iZiI6MTcyNzk0MDQ0MC4zMTU2OTQsInN1YiI6IjY2ZmJjMzlkZTc4MTFlZjZjYmE2NzU2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.94BdczUrzoH81ymZGqLE0IqsE7Ng-7qFXfZrs1ziArc';
  private headers = { Authorization: `Bearer ${this.apiKey}` };
  private cartelePage = 1;

  // Indica si se está cargando la cartelera para evitar múltiples solicitudes
  public cargando = false;

  constructor(private http: HttpClient) { }


  getCartelera(): Observable<Movie[]> {

    if (this.cargando) {
      return of([]);
    }

    this.cargando = true;

    // Realiza la solicitud HTTP para obtener las películas en cartelera
    return this.http.get<CarteleraResponse>(`${this.URL}/movie/now_playing?language=es-ES&page=${this.cartelePage}`, { headers: this.headers }).pipe(
      map((response: any) => response.results),

      tap(() => {
        this.cartelePage += 1;
        this.cargando = false;
      })
    )

  }

  buscarPeliculas(texto: string): Observable<Movie[]> {


    return this.http.get<CarteleraResponse>(`${this.URL}/search/movie?query=${texto}&language=es-ES&page=1`, { headers: this.headers }).pipe(

      map(res => res.results)

    )

  }

  peliculaDetalle(id: string) {

    return this.http.get<MovieDetails>(`${this.URL}/movie/${id}?language=es-ES`, { headers: this.headers }).pipe(

      catchError(err => of(null))



    )

  }

  peliculaCreditos(id: string): Observable<Cast[] | null> {

    return this.http.get<Credits>(`${this.URL}/movie/${id}/credits?language=es-ES`, { headers: this.headers }).pipe(

      map(res => res.cast),
      catchError(err => of(null))
    )




  }


  resetPeliculaPage() {

    this.cartelePage = 1;

  }


}

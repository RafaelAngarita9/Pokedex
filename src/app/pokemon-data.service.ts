import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {
  private selectedPokemonSource = new BehaviorSubject<any | null>(null);
  selectedPokemon: Observable<any | null> = this.selectedPokemonSource.asObservable();

  constructor(private http: HttpClient) {}

  //Function that captures information of pokemon getting clicked.
  updateSelectedPokemon(pokemon: any): void {
    this.selectedPokemonSource.next(pokemon);
    console.log('Selected Pokemon updated:', pokemon);
  }
  //Function that get the pokemon weight and height using ID as an indicator
  getPokemonById(id: number): Observable<any> {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return this.http.get<any>(apiUrl).pipe(
      tap((response: any) => {
        const details = {
          weight: response.weight,
          height: response.height,
        };
        response.details = details;
        console.log('API Response:', response);
      }),
      catchError(error => {
        console.error('Error fetching Pokemon by ID:', error);
        return of(null);
      })
    );
  }
  //Function to get species directly from API
  getPokemonSpeciesById(id: number): Observable<any> {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    return this.http.get<any>(apiUrl).pipe(
      tap((response: any) => {
        console.log('Species API Response:', response);
      }),
      catchError(error => {
        console.error('Error fetching Pokemon species by ID:', error);
        return of(null);
      })
    );
  }

  //Function to get species directly from API
  getPokemonByName(name: string): Observable<any> {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return this.http.get<any>(apiUrl);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  //Connect to the pokeAPI
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http:HttpClient) { }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Get the list for the first 10 pokemon with details
  getPokemonListWithDetails(): Observable<any> {
    const url = `${this.apiUrl}/pokemon?limit=10`;
    return this.http.get(url);
  }


  //Gets the specific details of each pokemon based on ID
  getPokemonDetails(name: string): Observable<any> {
    const url = `${this.apiUrl}/pokemon/${name}`;
    return this.http.get(url);
  }
}

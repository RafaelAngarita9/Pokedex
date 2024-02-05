import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { HttpClient } from '@angular/common/http';
import { PokemonDataService } from '../pokemon-data.service';
import { Router } from '@angular/router';  // Import the Router

interface PokemonDetails {
  weight: number;
  height: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit  {
  
  constructor(
    private pokemonService: PokemonService,
    private http: HttpClient,
    private pokemonDataService: PokemonDataService,
    private router: Router  // Inject the Router service
  ) {}

  hoveredPokemonId: number | null = null;
  hoveredPokemon: any | null = null;

  pokemonList: any[] = [];
  sortedPokemonList: any[] = []
  selectedSort: string = 'number'; // Initialize with a default value
  selectedOrder: 'asc' | 'desc' = 'asc'; // Initialize with a default value

  onPokemonHover(pokemon: any): void {
    const newPokemonId = this.getPokemonId(pokemon);
    // Check if the newly hovered Pokemon is different from the currently hovered Pokemon
    if (newPokemonId !== this.hoveredPokemonId) {
      this.hoveredPokemonId = newPokemonId;
      this.hoveredPokemon = pokemon;
  
      if (!this.hoveredPokemon.details) {
        this.hoveredPokemon.details = { weight: 0, height: 0 };
      }
  
      console.log('Details:', this.hoveredPokemon?.details);
    }
  }

  getImageUrl(pokemonId: number): string {
    const paddedId = pokemonId.toString().padStart(3, '0');
    return `assets/${paddedId}.png`;
  }
  

  onPokemonClick(pokemon: any): void {
    const pokemonNumber = this.getPokemonId(pokemon);
    this.router.navigate(['/pokemon', { id: pokemonNumber }]);
  }

  ngOnInit(): void {
    this.getPokemonList();
  }


  getPokemonList(): void {
    this.pokemonService.getPokemonListWithDetails().subscribe(async (data) => {
      this.pokemonList = data.results;
  
      // Fetch details for all Pokemon
      const detailsPromises = this.pokemonList.map((pokemon) => this.getPokemonDetails(pokemon.url));
      const details = await Promise.all(detailsPromises);
  
      // Assign fetched details to each Pokemon
      this.pokemonList.forEach((pokemon, index) => {
        pokemon.details = details[index];
        pokemon.pokemonNumber = index + 1; // Set the pokemonNumber property
        pokemon.originalNumber = index + 1; // Assign original number
      });
  
      this.sortedPokemonList = [...this.pokemonList]; // Create a copy for sorting
    });
  }


  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;
    this.applySorting();
  }

  onOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOrder = target.value as 'asc' | 'desc';
    this.applySorting();
  }

  getPokemonId(pokemon: any): number {
    // Example URL: "https://pokeapi.co/api/v2/pokemon/1/"
    const urlParts = pokemon.url.split('/');
    // The ID is the last part of the URL
    return parseInt(urlParts[urlParts.length - 2], 10);
  }

  sortPokemonByNumber(order: 'asc' | 'desc' = 'asc'): void {
    this.sortedPokemonList.sort((a, b) => {
      const numA = this.getPokemonId(a);
      const numB = this.getPokemonId(b);
  
      console.log('Sorting by number:', numA, numB);
  
      return order === 'asc' ? numA - numB : numB - numA;
    });
  }
 
  async sortPokemonByWeight(): Promise<void> {
    console.log('Sorting by weight...');
    for (const pokemon of this.sortedPokemonList) {
      pokemon.details = await this.getPokemonDetails(pokemon.url);
    }
  
    this.sortedPokemonList.sort((a, b) => {
      const weightA = a.details?.weight || 0;
      const weightB = b.details?.weight || 0;
  
      console.log('Weight values:', weightA, weightB);
  
      return this.selectedOrder === 'asc' ? weightA - weightB : weightB - weightA;
    });
  }


  async sortPokemonByHeight(): Promise<void> {
    console.log('Sorting by height...');
    for (const pokemon of this.sortedPokemonList) {
      pokemon.details = await this.getPokemonDetails(pokemon.url);
    }
  
    this.sortedPokemonList.sort((a, b) => {
      const heightA = a.details?.height || 0;
      const heightB = b.details?.height || 0;
  
      console.log('Height values:', heightA, heightB);
  
      return this.selectedOrder === 'asc' ? heightA - heightB : heightB - heightA;
    });
  }

  async getPokemonDetails(url: string): Promise<PokemonDetails | null> {
    try {
      const response = await this.http.get<PokemonDetails>(url).toPromise();
  
      // Check if response is defined and has the expected structure
      if (response && response.height !== undefined && response.weight !== undefined) {
        return response;
      } else {
        // Handle the case where the response is undefined or doesn't have the expected structure
        console.error('Invalid response format:', response);
        return null;
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      return null;
    }
  }

  applySorting(): void {
    // Implement the sorting based on the selected criteria
    switch (this.selectedSort) {
      case 'number':
        this.sortPokemonByNumber(this.selectedOrder);
        break;
      case 'weight':
        this.sortPokemonByWeight();
        break;
      case 'height':
        this.sortPokemonByHeight();
        break;
      default:
        break;
    }
  }

  formatPokemonNumber(pokemonNumber: number): string {
    // Pad the number with leading zeros to ensure it's always 4 digits
    return pokemonNumber.toString().padStart(4, '0');
  }
}

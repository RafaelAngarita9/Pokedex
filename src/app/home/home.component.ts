import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { HttpClient } from '@angular/common/http';
import { PokemonDataService } from '../pokemon-data.service';
import { Router } from '@angular/router'; 

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
    private router: Router 
  ) {}

  hoveredPokemonId: number | null = null;
  hoveredPokemon: any | null = null;

  pokemonList: any[] = [];
  sortedPokemonList: any[] = []
  selectedSort: string = 'number'; 
  selectedOrder: 'asc' | 'desc' = 'asc'; 

   // Gets info from hovered pokemon to show information
  onPokemonHover(pokemon: any): void {
    const newPokemonId = this.getPokemonId(pokemon);
    if (newPokemonId !== this.hoveredPokemonId) {
      this.hoveredPokemonId = newPokemonId;
      this.hoveredPokemon = pokemon;
  
      if (!this.hoveredPokemon.details) {
        this.hoveredPokemon.details = { weight: 0, height: 0 };
      }
  
      console.log('Details:', this.hoveredPokemon?.details);
    }
  }
  //Function that generates the url for the images
  getImageUrl(pokemonId: number): string {
    const paddedId = pokemonId.toString().padStart(3, '0');
    return `assets/${paddedId}.png`;
  }
  
  // Function that on click gets the ID to pass into info page.
  onPokemonClick(pokemon: any): void {
    const pokemonNumber = this.getPokemonId(pokemon);
    this.router.navigate(['/pokemon', { id: pokemonNumber }]);
  }

  //Function that displays the list of pokemon
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
        pokemon.pokemonNumber = index + 1; 
        pokemon.originalNumber = index + 1; 
      });
      // Creates a copy for sorting
      this.sortedPokemonList = [...this.pokemonList]; 
    });
  }

  //Function to change the order of the list
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;
    this.applySorting();
  }

  //Function to change the order 
  onOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOrder = target.value as 'asc' | 'desc';
    this.applySorting();
  }

    //Gets ID from service by splitting the final part and returning it
  getPokemonId(pokemon: any): number {
    const urlParts = pokemon.url.split('/');
    // The ID is the last part of the URL
    return parseInt(urlParts[urlParts.length - 2], 10);
  }

  //function that sorts the list created in getPokemonList()
  sortPokemonByNumber(order: 'asc' | 'desc' = 'asc'): void {
    this.sortedPokemonList.sort((a, b) => {
      const numA = this.getPokemonId(a);
      const numB = this.getPokemonId(b);
  
      console.log('Sorting by number:', numA, numB);
  
      return order === 'asc' ? numA - numB : numB - numA;
    });
  }
 
    // Sorts by weight
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

  // Sorts by height
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
  // Implement the sorting based on the selected criteria
  applySorting(): void {
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
  // Pad the number with leading zeros to ensure it's always 4 digits
  formatPokemonNumber(pokemonNumber: number): string {
    return pokemonNumber.toString().padStart(4, '0');
  }
}

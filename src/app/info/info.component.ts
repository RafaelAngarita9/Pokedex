import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonDataService } from '../pokemon-data.service';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  // selectedPokemonId: number | null = null;
  selectedPokemon: any;

  constructor(
    private pokemonDataService: PokemonDataService,
    private route: ActivatedRoute,
  ) {}
  // Pads the number with leading zeros to ensure it's always 3 digits
  formatPokemonNumber(pokemonNumber: number): string {
    return pokemonNumber.toString().padStart(3, '0');
  }
 // Gets ID from API
  getPokemonId(pokemon: any): number {
    const urlParts = pokemon.url.split('/');
    return parseInt(urlParts[urlParts.length - 2], 10);
  }

  // Capitalizes  first letter in given string
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  //Function that on initiated gets info, then gets species and flavor text
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.pokemonDataService.getPokemonById(parseInt(id, 10)).subscribe((pokemon) => {
          console.log('Selected Pokemon:', pokemon);
  
          // Check if details property is available
          if (pokemon && pokemon.details) {
            console.log('Selected Pokemon Details:', pokemon.details);
  
            // Fetch flavor text
            this.pokemonDataService.getPokemonSpeciesById(parseInt(id, 10)).subscribe((species) => {
              if (species) {
                console.log('Species Info:', species);
                const flavorTextEntry = species.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
            
                if (flavorTextEntry) {
                  pokemon.speciesInfo = { flavor_text: flavorTextEntry.flavor_text };
                  console.log('Flavor Text:', pokemon.speciesInfo.flavor_text);
                } else {
                  console.log('Flavor Text not available for the English language.');
                }
              }
            });
  
            // Capitalize the first letter of the Pokemon name
            pokemon.name = this.capitalizeFirstLetter(pokemon.name);
  
            // Capitalize the first letter of each type
            if (pokemon.types) {
              pokemon.types.forEach((type: any) => {
                type.type.name = this.capitalizeFirstLetter(type.type.name);
              });
            }
          } else {
            console.log('Details not available:', pokemon);
          }
  
          this.selectedPokemon = pokemon;
        });
      }
    });
  }
  //Function to construct the URL link for picture
  getImageUrl(pokemonId: number): string {
    const paddedId = pokemonId.toString().padStart(3, '0');
    return `assets/${paddedId}.png`;
  }


}


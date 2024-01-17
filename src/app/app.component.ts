import{ Component, OnInit } from '@angular/core';
import films from '../assets/films.json'
import ontologyStart from '../assets/ontology.json'
import { Concept } from './models/concept.model';
import { Film } from './models/film.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'films-ontology';

  ontology: Concept = ontologyStart;
  allFilms: Film[] = [];
  filmsList: Film[] = films;
  inputValue!: string;

  findSubByName(mainConcept: Concept, subConceptName: string) {
    return mainConcept.subs.find((x: Concept) => x.name === subConceptName);
  }


  getDataOfFilm(film: Film, thing: string): string {
    if (thing === 'genre') {
      return film.genre;
    } else if (thing === 'realisator') {
      return film.realisator;
    } else if (thing === 'actor1') {
      return film.actor1;
    } else if (thing === 'actor2') {
      return film.actor2;
    } else if (thing === 'releaseDecade') {
      return film.releaseDecade!;
    } else {
      return film.length;
    }
  }


  loadFilmsList() {
    films.forEach((film: Film) => this.filmsList.push(film));
  }

  filterFilmsList() {
    return this.filmsList;
  }

  ngOnInit(): void {
    // Prepare data ...
    this.filmsList.forEach((film: Film) => {
      film.title = film.title.toString();
      film.releaseDecade = film.releaseDate.toString().slice(0, -1) + '0';      
      film.genre = film.genre.split('/')[0];

      // if length contains h convert to min round it per half hour 
      if (film.length.includes('h')) {
        let hour = parseInt(film.length.split('h')[0]);
        let min = parseInt(film.length.split('h')[1].split('min')[0]);
        if (!min) min = 0;
        film.length = (hour * 60 + min).toString();
      }

      // round it by 30min parts
      let length = parseInt(film.length);
      length = Math.round(length / 30) * 30;
      film.length = length.toString();

      // if length don't have m add it 
      if (!film.length.includes('m')) {
        film.length += 'm';
      }
    });

    this.allFilms = this.filmsList;

    let mainConcepts = ['realisator', 'genre', 'actor1', 'actor2', 'releaseDecade', 'length'];

    // iterate on each concept for each film.
    mainConcepts.forEach((mainConcept: string) => {

      this.filmsList.forEach((film: Film) => {
        // this.loadFilmsList();
        if (this.getDataOfFilm(film, mainConcept)) {
          if (!this.findSubByName(this.findSubByName(this.ontology, mainConcept)!, this.getDataOfFilm(film, mainConcept))) {
            
            // get level of parent 
            let parentLevel = this.findSubByName(this.ontology, mainConcept)!.level;

            this.findSubByName(this.ontology, mainConcept)!.subs.push({
              'name': this.getDataOfFilm(film, mainConcept),
              'level': parentLevel + 1,
              'films': [],
              'subs': []
            })
          }

          this.findSubByName(this.findSubByName(this.ontology, mainConcept)!, this.getDataOfFilm(film, mainConcept))!.films.push(film.title);
        }
      });
    });

    console.log('Full Ontology is :')
    console.log(this.ontology);
    console.log('-------------------')
  }

  onResetFilter() {
    this.filmsList = [...this.allFilms];
  }

  onGenreClicked(filter: { filterBy: string, value: string }) {
    this.filmsList = [];
    this.allFilms.forEach(film => {

      switch (filter.filterBy) {
        case 'genre':
          if (film.genre === filter.value) this.filmsList.push(film); break;
        case 'actor1':
          if (film.actor1 === filter.value || film.actor2 === filter.value) this.filmsList.push(film); break;
        case 'actor2':
          if (film.actor1 === filter.value || film.actor2 === filter.value) this.filmsList.push(film); break;
        case 'releaseDecade':
          if (film.releaseDecade === filter.value) this.filmsList.push(film); break;
        case 'length':
          if (film.length === filter.value) this.filmsList.push(film); break;
        case 'releaseDate':
            if (film.releaseDate === +filter.value) this.filmsList.push(film); break;
      }

    });
  }


  onSearch() {
    let foundConcepts = this.ontologySearch(this.ontology, this.inputValue.toLowerCase());
    let foundFilms = this.filmsSearch(this.inputValue.toLowerCase()); // this does not work ! TODO
    console.log(foundConcepts);
    console.log(foundFilms);
  }


  checkSimilarity(word1: string, word2: string) {
    if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
      return true;
    }
    return false;
  }

  filmsSearch(value: string) {
    let films = [];

    this.allFilms.forEach(f => {
      if (this.checkSimilarity(f.title.toLowerCase(), value)) {
        films.push(f);
      }
    });
  }

  ontologySearch(concept: Concept, value: string): Concept[] {
    // value is always in lower case.

    let foundConcepts: Concept[] = [];

    concept.subs.forEach(sub => {

      // first, check for names
      if (this.checkSimilarity(sub.name.toLowerCase(), value)) {
        foundConcepts.push(sub);
      }

      // second, check for films list
      sub.films.forEach(f => {
        if (this.checkSimilarity(f.toLowerCase(), value)) {
          foundConcepts.push(sub);
        }
      });

      // third, check for subs
      foundConcepts = foundConcepts.concat(this.ontologySearch(sub, value))
    });

    return foundConcepts;
  }
}

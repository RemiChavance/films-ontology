import { Component, OnInit } from '@angular/core';
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
    }
    else if (thing === 'releaseDecade') {
      return film.releaseDecade!;
    } else {
      return film.length;
    }
  }

  ngOnInit(): void {
    films.forEach((film: Film) => {
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

    let mainConcepts = ['realisator', 'genre', 'actor1', 'actor2', 'releaseDecade', 'length'];
    let film = films[0];
    mainConcepts.forEach((mainConcept: string) => {
      films.forEach((film: Film) => {
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
          this.findSubByName(this.findSubByName(this.ontology, mainConcept)!, this.getDataOfFilm(film, mainConcept).toString())!.films.push(film.title);
        }
      });
    });


    console.log(this.ontology);
  }
}

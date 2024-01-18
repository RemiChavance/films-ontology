import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Concept } from '../models/concept.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-concept-card',
  templateUrl: './concept-card.component.html',
  styleUrls: ['./concept-card.component.scss']
})
export class ConceptCardComponent {
  @Input() concept!: Concept;
  @Output() customFilter: EventEmitter<string> = new EventEmitter<string>();

  clicked = false;
  nbFilmToDisplay = 3;

  onClick() {
    this.clicked = !this.clicked;
  }
  
  onClickFilter(filmTitle: string) {
    this.customFilter.emit(filmTitle)
  }
}

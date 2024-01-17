import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Film } from '../models/film.model';

@Component({
  selector: 'app-film-card',
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.scss']
})
export class FilmCardComponent {

  @Input() film!: Film;
  @Output() customFilter: EventEmitter<{ filterBy: string, value: string }> = new EventEmitter<{ filterBy: string, value: string }>();

  clicked = false;

  onClick() {
    this.clicked = !this.clicked;
  }
  
  onClickFilter(filterBy: string, value: string) {
    this.customFilter.emit({ filterBy, value });

  }
}

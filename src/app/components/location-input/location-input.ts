import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-location-input',
  imports: [],
  templateUrl: './location-input.html',
  styleUrl: './location-input.css',
})
export class LocationInput {
  placeholder = input('');
  value = model('');

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}

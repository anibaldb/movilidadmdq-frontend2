import { Component, HostListener, ViewChild, input } from '@angular/core';
import { GoogleMap, MapMarker, MapPolyline } from '@angular/google-maps';



@Component({
  selector: 'app-map',
  imports: [GoogleMap, MapMarker, MapPolyline],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  @ViewChild(GoogleMap) googleMap?: GoogleMap;

  hasRoute = input(false);

  center: google.maps.LatLngLiteral = { lat: -38.0055, lng: -57.5426 };
  zoom = 14;

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  origenPos: google.maps.LatLngLiteral = { lat: -38.02, lng: -57.55 };
  destinoPos: google.maps.LatLngLiteral = { lat: -37.99, lng: -57.535 };

  get routePath(): google.maps.LatLngLiteral[] {
    return [this.origenPos, this.destinoPos];
  }

  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#56ccf2',
    strokeWeight: 4,
  };

  @HostListener('window:resize')
  onWindowResize() {
    const map = this.googleMap?.googleMap;
    if (map) {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(this.center);
    }
  }
}

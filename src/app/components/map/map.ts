import { Component, HostListener, ViewChild, input } from '@angular/core';
import { GoogleMap, MapMarker, MapPolyline } from '@angular/google-maps';

const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f2a45' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7fa8d9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f2a45' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#1c3f63' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8fb8e8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#28517d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#081625' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d6690' }] },
];

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
    styles: DARK_MAP_STYLE,
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

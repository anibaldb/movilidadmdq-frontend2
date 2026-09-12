import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-nav-tabs',
  styleUrl: './nav-tabs.css',
  templateUrl: './nav-tabs.html',
})
export class NavTabs {}

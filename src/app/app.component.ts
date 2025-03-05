import { AuthService } from './core/services/Authentication/auth.service';
import { FlowbiteService } from './core/services/Flowbite/flowbite.service';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreeBackgroundComponent } from "./shared/components/three-background/three-background.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThreeBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private flowbiteService: FlowbiteService ) {}
  private readonly authService=inject(AuthService)
  isLoggedIn = false;
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
    
      this.isLoggedIn = this.authService.isLoggedIn();

    });


    
  }
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}

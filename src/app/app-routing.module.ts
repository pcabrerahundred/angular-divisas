import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//
import { CambioComponent } from './components/cambio/cambio.component';

const routes: Routes = [
  /* { path: '', pathMatch: 'full', redirectTo: '/' },
  { path: 'convertir', component: CambioComponent }, */
  { path: '', pathMatch: 'full', component: CambioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

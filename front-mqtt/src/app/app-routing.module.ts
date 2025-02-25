import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { Client1Component } from './client1/client1.component';
import { Client2Component } from './client2/client2.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path:'', component: LayoutComponent, 
    children: [
      { path:'', component: PrincipalComponent},
      { path:'home', component: PrincipalComponent},
      { path:'client1', component: Client1Component},
      { path:'client2', component: Client2Component}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

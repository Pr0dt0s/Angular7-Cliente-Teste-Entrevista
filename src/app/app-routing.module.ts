import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DataPageComponent } from './pages/data-page/data-page.component';
import { ConfigurationPageComponent } from './pages/configuration-page/configuration-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'dados', component: DataPageComponent },
  {path:'dashboard',component: DashboardComponent},
  { path: 'home', component: HomePageComponent },
  { path: 'configuracao', component: ConfigurationPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './layout_components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './layout_components/footer/footer.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SidebarComponent } from './layout_components/sidebar/sidebar.component';
import { DataPageComponent } from './pages/data-page/data-page.component';
// import { TabulatorComponent } from './components/tabulator/tabulator.component';
import { ClientConfigurationComponent } from './components/client-configuration/client-configuration.component';
import { ServerConfigurationComponent } from './components/server-configuration/server-configuration.component'
import { ConfigurationService } from './services/configuration.service';
import { DataService } from './services/data.service';
import { ConfigurationPageComponent } from './pages/configuration-page/configuration-page.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select'
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    SidebarComponent,
    DataPageComponent,
    // TabulatorComponent,
    ClientConfigurationComponent,
    ServerConfigurationComponent,
    ConfigurationPageComponent,
    DataTableComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [
    ConfigurationService,
    DataService
  ],
  bootstrap: [AppComponent],
  entryComponents:[DataTableComponent]
})
export class AppModule { }

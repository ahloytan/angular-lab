import { Routes } from '@angular/router';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';
import { MyNewPageComponent } from '../components/my-new-page/my-new-page.component';
import { NewsTableComponent } from '../components/news-table/news-table.component';

export const routes: Routes = [
    { path : '', component: ObservableFormComponent },
    { path: 'news-table', component: NewsTableComponent },
    { path: 'my-new-page', component: MyNewPageComponent },
];

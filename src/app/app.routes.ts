import { Routes } from '@angular/router';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';
import { MyNewPageComponent } from '../components/my-new-page/my-new-page.component';

export const routes: Routes = [
    {path : '', component: ObservableFormComponent},
    { path: 'my-new-page', component: MyNewPageComponent },
];

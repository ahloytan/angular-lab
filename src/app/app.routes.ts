import { MyNewPageComponent } from '../components/my-new-page/my-new-page.component';
import { NewsTableComponent } from '../components/news-table/news-table.component';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';
import { ServerSentEventsComponent } from '../components/server-sent-events/server-sent-events.component';
import { Routes } from '@angular/router';

export const routesName = {
    HOME: '',
    NEWS: 'news-table',
    SSE: 'server-sent-events',
    NEW_PAGE: 'my-new-page'
};

export const routes: Routes = [
    { path: routesName.HOME, component: ObservableFormComponent, title: 'Angular Lab | Home'  },
    { path: routesName.NEWS, component: NewsTableComponent, title: 'Angular Lab | News' },
    { path: routesName.SSE, component: ServerSentEventsComponent, title: 'Angular Lab | SSE'  },
    { path: routesName.NEW_PAGE, component: MyNewPageComponent, title: 'Angular Lab | New Page'  }
];

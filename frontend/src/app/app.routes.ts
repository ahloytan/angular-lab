import { WebSocketsComponent } from '../components/web-sockets/web-sockets.component';
import { NewsTableComponent } from '../components/news-table/news-table.component';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';
import { ServerSentEventsComponent } from '../components/server-sent-events/server-sent-events.component';
import { Routes } from '@angular/router';
import { PushNotificationComponent } from '../components/push-notification/push-notification.component';

export const routesName = {
    HOME: '',
    NEWS: 'news-table',
    SSE: 'server-sent-events',
    WS: 'web-sockets',
    PN: 'push-notification'
};

export const routes: Routes = [
    { path: routesName.HOME, component: ObservableFormComponent, title: 'Angular Lab | Home'  },
    { path: routesName.NEWS, component: NewsTableComponent, title: 'Angular Lab | News' },
    { path: routesName.SSE, component: ServerSentEventsComponent, title: 'Angular Lab | SSE'  },
    { path: routesName.WS, component: WebSocketsComponent, title: 'Angular Lab | Web Sockets'  },
    { path: routesName.PN, component: PushNotificationComponent, title: 'Angular Lab | Push Notification'  }
];

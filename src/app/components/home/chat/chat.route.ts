import { Routes } from "@angular/router";
import { ChatComponent } from "./chat.component";

export const ChatRoutes: Routes = [
  {
    path: '',
    component: ChatComponent,
    data: {
      title: 'Community chat',
      urls: [
        { title: 'Chat', url: '/chat' },
        { title: 'Community chat' },
      ],
    },
  },
];

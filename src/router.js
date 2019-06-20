import Login from './components/Login';
import Messager from './components/Messager';
import Page404 from './components/Page404';

const routes = [
  {
    name: 'login',
    path: '/',
    icon: 'dashboard',
    component: Login
  },
  {
    name: 'messager',
    path: '/im',
    icon: 'dashboard',
    component: Messager
  },
  {
    name: 'page404',
    icon: 'page404',
    component: Page404
  }
];

export default routes;

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Index from './pages/Index';
import Search from './pages/search/Search';
import Provider from './pages/provider/Provider';
import Login from './pages/auth/Login';
import LoginRedirect from './pages/auth/LoginRedirect';
import Error from './pages/Error';
import EditStore from './pages/provider/EditStore';
import Menu from './pages/store/Menu';
import SignUp from './pages/auth/SignUp';
import SignUpInfo from './pages/auth/SignUpInfo';
import SelectMap from './pages/search/SelectMap';
import Store from './pages/store/Store';
import MenuTime from './pages/store/MenuTime';
import Find from './pages/find/Find';
import FindList from './pages/find/FindList';
import Reservation from './pages/reservation/Reservation';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<Error />}>
      <Route index element={<Index />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signup/info" element={<SignUpInfo />} />

      <Route path="search" element={<Search />} />
      <Route path="search/map" element={<SelectMap />} />

      <Route path="store/:slug">
        <Route index element={<Store />} />
        <Route path="menu/:number">
          <Route index element={<Menu />} />
          <Route path="time" element={<MenuTime />} />
        </Route>
      </Route>

      <Route path="provider">
        <Route index element={<Provider />} />
        <Route path="provider/store" element={<EditStore />} />
      </Route>

      <Route path="find" element={<Find />} />
      <Route path="find/:phone" element={<FindList />} />

      <Route path="reservation">
        <Route path=":id" element={<Reservation />} />
      </Route>

      <Route path="oauth2/redirect/:token" element={<LoginRedirect />} />
    </Route>
  )
);

export default router;

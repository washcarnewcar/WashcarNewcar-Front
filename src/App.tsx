import './App.css';
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from 'react-router-dom';
import Index from './pages/Index';
import Search from './pages/search/Search';
import Provider from './pages/provider/Provider';
import Login from './pages/auth/Login';
import LoginRedirect from './pages/auth/LoginRedirect';
import Seller from './pages/Seller';
import Contact from './pages/Contact';
import Error from './pages/Error';
import EditStore from './pages/provider/EditStore';
import Reservation from './pages/store/Reservation';
import SignUp from './pages/auth/SignUp';
import SignUpInfo from './pages/auth/SignUpInfo';
import SelectMap from './pages/search/SelectMap';
import Store from './pages/store/Store';
import ReservationTime from './pages/store/ReservationTime';
import Find from './pages/find/Find';
import FindList from './pages/find/FindList';

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
          <Route index element={<Reservation />} />
          <Route path="time" element={<ReservationTime />} />
        </Route>
      </Route>

      <Route path="provider">
        <Route index element={<Provider />} />
        <Route path="provider/store" element={<EditStore />} />
      </Route>

      <Route path="find" element={<Find />} />
      <Route path="find/:phone" element={<FindList />} />

      <Route path="oauth2/redirect/:token" element={<LoginRedirect />} />
      {/* <Route path="/provider/menu/:code" element={<Reservation />} /> */}
    </Route>
  )
);

export default router;

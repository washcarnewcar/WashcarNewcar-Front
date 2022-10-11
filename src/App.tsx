import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/info" element={<SignUpInfo />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/map" element={<SelectMap />} />
        <Route path="/store/:slug" element={<Store />} />
        <Route path="/store/:slug/menu/:number" element={<Reservation />} />
        <Route
          path="/store/:slug/menu/:number/time"
          element={<ReservationTime />}
        />
        <Route path="/provider" element={<Provider />} />
        <Route path="/provider/store" element={<EditStore />} />
        {/* <Route path="/reservation" element={<Reservation />} /> */}
        <Route path="/oauth2/redirect/:token" element={<LoginRedirect />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/error" element={<Error />} />
        <Route path="/provider/menu/:code" element={<Reservation />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

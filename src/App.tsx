import './App.css';
import { IsBurgermenuOpenProvider } from './contexts/burgermenu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Search from './pages/consumer/Search';
import Provider from './pages/provider/Provider';
import Login from './pages/auth/Login';
import Reservation from './pages/Reservation';
import LoginRedirect from './pages/LoginRedirect';
import Seller from './pages/Seller';
import LoginCheck from './pages/LoginCheck';
import Contact from './pages/Contact';
import Error from './pages/Error';
import Store from './pages/Store';
import Menu from './pages/Menu';
import SignUp from './pages/auth/SignUp';
import SignUpInfo from './pages/auth/SignUpInfo';
import Map from './pages/consumer/SelectMap';
import SelectMap from './pages/consumer/SelectMap';

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
        <Route path="/provider" element={<Provider />} />
        <Route path="/provider/store" element={<Store />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/oauth2/redirect/:token" element={<LoginRedirect />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/error" element={<Error />} />
        <Route path="/provider/menu/:code" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

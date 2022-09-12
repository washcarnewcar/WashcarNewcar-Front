import './App.css';
import { IsBurgermenuOpenProvider } from './contexts/burgermenu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Provider from './pages/Provider';
import Login from './pages/Login';
import Reservation from './pages/Reservation';
import LoginRedirect from './pages/LoginRedirect';
import Seller from './pages/Seller';
import LoginCheck from './pages/LoginCheck';
import Contact from './pages/Contact';
import Error from './pages/Error';
import Store from './pages/Store';
import Menu from './pages/Menu';

function App() {
  return (
    // <IsBurgermenuOpenProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
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
    // </IsBurgermenuOpenProvider>
  );
}

export default App;

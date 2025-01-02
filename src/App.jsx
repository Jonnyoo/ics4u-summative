import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./Context/context.jsx";
import HomeView from "./Views/HomeView.jsx";
import RegisterView from "./Views/RegisterView.jsx";
import LoginView from "./Views/LoginView.jsx";
import MoviesView from "./Views/MoviesView.jsx";
import DetailMovieView from "./Views/DetailView.jsx";
import GenreView from "./Views/GenreView.jsx";
import CartView from "./Views/CartView.jsx";
import SettingsView from "./Views/SettingsView.jsx";
import ErrorView from "./Views/ErrorView.jsx";
import ProtectedRoutes from "./util/ProtectedRoutes.jsx";

function App() {

  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/cart" element={<CartView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/movies" element={<MoviesView />}>
              <Route path="genre/:genre_id" element={<GenreView />} />
              <Route path="details/:id" element={<DetailMovieView />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App

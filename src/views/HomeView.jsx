import Header from "../Components/Header.jsx";
import Hero from "../Components/Hero.jsx";
import Feature from "../Components/Feature.jsx";
import Footer from "../Components/Footer.jsx";
import "./HomeView.css";

function HomeView() {
  return (
    <div className="home-view">
      <Header />
      <Hero />
      <Feature />
      <Footer />
    </div>
  );
}

export default HomeView;
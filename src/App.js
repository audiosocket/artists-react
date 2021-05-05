import logo from './logo.svg';
import './App.scss';
import Header from "./pages/Artist/components/Header/Header";
import Footer from "./pages/Artist/components/Footer/Footer";
import Sidebar from "./pages/Artist/components/Sidebar/Sidebar";

function App() {
  return (
    <div className="contain">
      <Header />
      <Sidebar />
      <div className="body-container">Body</div>
      <Footer />
    </div>
  );
}

export default App;

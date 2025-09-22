import Collection from "../../components/Collection";
import DotGrid from "../../components/DotGrid/DotGrid";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Hero from "../../components/Hero";

const Home = (props) => {
  return (
    <div className="w-screen h-full flex flex-col font-mono bg-[#161616]">
      <Header />
      <Hero />
      <Collection />
      <Footer />
    </div>
  );
};

export default Home;

import Location from "@/components/common/Location";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import Reviews from "@/components/sections/Reviews";
import ThaiDishHighlight from "@/components/sections/ThaiDishHighlight";
const Index = () => {
  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <ThaiDishHighlight />
          <About />
          <Reviews />
          <Location />
        </main>
        <Footer />
      </div>
  );
};

export default Index;

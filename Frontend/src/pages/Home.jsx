import Categories from '../components/Categories.jsx';
import HeroSection from "../components/HeroSection.jsx";
import ProductTabs from '../components/ProductTabs.jsx';
import ScrollToTop from "../components/ScrollToTop.jsx";
import Footer from "../components/Footer.jsx";

function Home(){
    return (
        <>
        <HeroSection />
        <Categories />
        <ProductTabs />
        <ScrollToTop />
        <Footer />
        </>
    );
}
export default Home;

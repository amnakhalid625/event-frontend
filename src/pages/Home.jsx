import Hero from '../components/Hero';
import AboveCard from '../components/AboveCard';
import Testimonials from '../components/Testimonails';
import Pattern from '../components/Pattern';
import { Helmet } from 'react-helmet-async';
import LinkBuilding from '../components/AboutSection';
import FAQ from '../components/FAQ'
import Partners from '../components/Partners';
import Pricing from '../components/Pricing';


const Home = () => {
  return (
    <>
      <Helmet>
      <title>Kaboozat</title>
       <meta name="description" content="Business Technology Management business" />
      </Helmet>
      <Hero />
      <AboveCard />
      <LinkBuilding />

      <Pattern />
      <FAQ />
      <Partners />
      <Pricing />
      {/* <About /> */}
      <Testimonials />
    </>
  );
};

export default Home;

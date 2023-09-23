import Image from "next/image";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { FAQ } from "~~/components/section/faq";
import { Hero } from "~~/components/section/hero";
import { Countdown } from "~~/components/section/countdown";
import { LandingNav } from "~~/components/LandingNav";
import { HowItWorks } from "~~/components/section/how-it-works";

const Home: NextPage = () => {
  return (
    <>
      <LandingNav />
      <Hero />
      <Countdown />
      <HowItWorks />
      <FAQ />
    </>
  );
};

export default Home;

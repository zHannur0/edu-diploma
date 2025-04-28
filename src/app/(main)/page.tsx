import Hero from "@/features/landing/Hero";
import WhyUs from "@/features/landing/WhyUs";
import StepList from "@/features/landing/StepList";
import Advantages from "@/features/landing/Advantages";
import FutureUniversity from "@/features/landing/FutureUniversity";
import AboutUs from "@/features/landing/AboutUs";
import UsCarousel from "@/features/landing/UsCarousel";

export default function Home() {
  return (
      <div className="relative flex flex-col items-center w-full">
          <Hero/>
          <h2 className="font-bold leading-normal text-[32px] text-black mb-12 ">
              Неліктен AqylShyn’-мен оқу тиімді?
          </h2>
          <WhyUs/>
          <h2 className="font-bold leading-normal text-[32px] text-black mb-12 ">
              AqуlShyn платформасында оқу қалай өтеді?
          </h2>
          <StepList/>
          <Advantages/>
          <AboutUs/>
          <UsCarousel/>
          <FutureUniversity/>
      </div>
  );
}

import Hero from "@/features/landing/Hero";
import WhyUs from "@/features/landing/WhyUs";
import StepList from "@/features/landing/StepList";
import Advantages from "@/features/landing/Advantages";
import FutureUniversity from "@/features/landing/FutureUniversity";

export default function Home() {
  return (
      <div className="relative flex flex-col items-center w-full">
          <Hero/>
          <WhyUs/>
          <StepList/>
          <Advantages/>
          <FutureUniversity/>
      </div>
  );
}

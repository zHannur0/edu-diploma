import Hero from "@/widgets/landing/Hero";
import WhyUs from "@/widgets/landing/WhyUs";
import StepList from "@/widgets/landing/StepList";
import Advantages from "@/widgets/landing/Advantages";
import FutureUniversity from "@/widgets/landing/FutureUniversity";

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

import Hero from "@/widgets/landing/Hero";
import WhyUs from "@/widgets/landing/WhyUs";
import StepList from "@/widgets/landing/StepList";

export default function Home() {
  return (
      <div className="relative flex flex-col items-center w-full">
          <Hero/>
          <WhyUs/>
          <StepList/>
      </div>
  );
}

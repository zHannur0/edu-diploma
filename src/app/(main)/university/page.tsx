import Wrapper from "@/components/layout/Wrapper";
import ProgramByCategory from "@/features/university/ProgramByCategory";
import Journey from "@/features/university/Journey";


export default function UniversityPage() {
    return (
        <Wrapper>
            <div className="relative w-full h-125 bg-cover bg-no-repeat bg-[url(/img/ListUniversity.png)] flex items-center p-20 rounded-2xl mb-40">
                <h2 className="text-white text-[48px] font-bold w-full">
                    Университеттер тізімі
                </h2>
                <div className="absolute w-full flex justify-center left-0 -bottom-px">
                    <div className="w-full max-w-[1100px] bg-white p-6 rounded-xl grid grid-cols-3 gap-4">
                        <div className="col-span-3 col-start-1">
                            <h3>
                                Оқыту бөлімі
                            </h3>
                        </div>
                        <div className="col-span-1">
                        </div>
                    </div>
                </div>
            </div>
            <ProgramByCategory/>
            <Journey/>
        </Wrapper>
    );
}

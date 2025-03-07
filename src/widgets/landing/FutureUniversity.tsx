import Wrapper from "@/components/layout/Wrapper";

const FutureUniversity = () => {
    return (
        <Wrapper>
            <div className="w-full bg-[#EEF4FF] rounded-2xl h-[231px] pt-10 flex flex-col items-center text-center mb-[50px]">
                <h2 className="font-bold text-[28px] mb-4">
                    Сенің болашақ университетін
                </h2>
                <p>
                    Тізімге өту
                </p>
                <button className="bg-[#FB9130] rounded-[50px] w-[170px] flex justify-center items-center text-white mt-9 py-2">
                    Университет
                </button>
            </div>
        </Wrapper>
    )
}

export default FutureUniversity;
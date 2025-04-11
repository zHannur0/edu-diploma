import {categories} from "@/config/categories";
import Image from "next/image";

const ProgramByCategory = () => {
    return (
        <div className="w-full flex flex-col items-center gap-6 mb-30">
            <p className="text-3xl font-bold">
                Санаты бойынша өзіңе керек бағдарламаны таңда
            </p>
            <div className="grid grid-cols-5 w-full gap-4">
                {
                    categories.map((category, index) => (
                        <div key={index} className="flex flex-col items-center justify-center gap-4 bg-[#EEF4FF] rounded-3xl h-50">
                            <Image src={category.icon} alt={category.title} width={80} height={80} className="w-20 h-20"/>
                            <b className="text-lg">
                                {category.title}
                            </b>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProgramByCategory
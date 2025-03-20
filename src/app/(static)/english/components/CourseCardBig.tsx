import Image from "next/image";
import Button from "@/components/ui/button/Button";

const CourseCardBig = () => {
    return (
        <div className="p-6 min-w-[514px] flex flex-col mr-6 shadow shadow-sm rounded-xl">
            <Image src={""} alt={""} width={465} height={180} className="w-full h-[180px] mb-5"/>
            <p className="text-[#7D7D7D] text-sm mb-2">
                Курс атауы
            </p>
            <h3 className="text-[#242424] font-medium mb-5">
                General English
            </h3>
            <p className="text-[#7D7D7D] text-sm mb-2">
                Деңгей анықтау
            </p>
            <h3 className="text-[#242424] font-medium mb-5">
                Бар
            </h3>
            <p className="text-[#7D7D7D] text-sm mb-2">
                Өту уақыты
            </p>
            <h3 className="text-[#242424] font-medium mb-5">
                12 сағат
            </h3>
            <p className="text-[#7D7D7D] text-sm mb-2">
                Прогресс
            </p>
            <h3 className="text-[#242424] font-medium mb-5">
                12 сағат
            </h3>
            <p className="text-black mb-2">
                Вы остановились на:
            </p>
            <h3 className="text-[#0375DF] mb-4">
                Модуль №4 “Тақырып” - 5 сабақ - “Тақырып”
            </h3>
            <Button label={"Продолжить обучение"}/>
        </div>
    )
}

export default CourseCardBig;
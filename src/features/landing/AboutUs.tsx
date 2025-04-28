import Wrapper from "@/components/layout/Wrapper";
import Image from "next/image";

const AboutUs = () => {
    return (
        <Wrapper>
            <div className="mb-24">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">

                    <div className="w-full">
                        <Image
                            src={"/img/AboutUs.png"}
                            alt={"Біз жайлы"}
                            width={600}
                            height={600}
                            className={"w-full h-auto rounded-xl shadow-lg object-cover aspect-square lg:aspect-auto"}
                        />
                    </div>

                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5 md:mb-8">
                            Біз жайлы
                        </h3>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            Біздің команда — жасанды интеллект көмегімен ағылшын тілін үйрену және шетелде оқу бойынша ақпаратты қазақ тілінде қолжетімді ету арқылы Қазақстан жастарына сапалы білім беру процесін жақсартуды мақсат еткен топ.
                        </p>

                    </div>

                </div>
            </div>
        </Wrapper>
    )
}

export default AboutUs;
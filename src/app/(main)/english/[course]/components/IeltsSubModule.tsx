import React, {useState} from "react";
import {IeltsSubModule} from "@/types/Ielts";
import IeltsTest from "@/app/(main)/english/[course]/components/IeltsTest";

interface IeltsSubModuleProps extends IeltsSubModule {
    index: number;
}

const IeltsSubModuleCard:React.FC<IeltsSubModuleProps> = ({index, tests, title}) => {
    const [openSections, setOpenSections] = useState<boolean>(false);

    return (
        <>
            <div className={`w-full flex justify-between items-center px-4 rounded-2xl cursor-pointer bg-white ${openSections ? "pb-1" : "pb-4"}`} onClick={() => {
               setOpenSections(!openSections)
            }}>
                <p className="font-medium">
                    {index}. {title}
                </p>
            </div>
            {
                openSections && (
                    <>
                        {
                            tests.map((test) => (
                                <IeltsTest key={test.id} id={test.id} name={test.name} />
                            ))
                        }
                    </>
                )
            }
        </>

    )
}

export default IeltsSubModuleCard;
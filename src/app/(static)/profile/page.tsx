import Wrapper from "@/components/layout/Wrapper";
import Input from "@/components/ui/input/Input";
import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import Button from "@/components/ui/button/Button";

export default function ProfilePage() {
    return (
            <div className="w-full bg-[#EEF4FF] flex flex-col gap-5">
                <Wrapper>
                    <h1 className="font-bold text-[32px] mb-8">
                        Менің парақшам
                    </h1>
                    <div className="w-full gap-7 grid grid-cols-[60%_40%]">
                        <div className="bg-white p-8 rounded-xl">
                            <h2 className="font-semibold text-[22px]e">
                                Парақша
                            </h2>
                            <div className="flex gap-6 w-full">
                                <div>

                                </div>
                                <div className="flex flex-col gap-4 w-full">
                                    <h3>
                                        Жеке кабинет
                                    </h3>
                                    <Input label={"Толық есім"} value={"Дильназ"} disabled={true}/>
                                    <EmailInput label={"Email"} value={"dilnaz@gmail.com"} disabled={true}/>
                                    <p className="text-sm mt-2">
                                        Пароль
                                    </p>
                                    <PasswordInput label="Старый пароль" value={"asdf"} className={"mb-2"}/>
                                    <div className="flex justify-end">
                                        <Button width={328}
                                                style={{backgroundColor: "transparent"}}>
                                            Дұрыстау
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl">
                            <h2 className="font-semibold text-[22px]e">
                                Менің жетістіктерім
                            </h2>
                            <div className="w-full p-8">

                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl">
                            <h2 className="font-semibold text-[22px]e">
                                Таңдаулы
                            </h2>
                            <div className="w-full p-8">

                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl">
                            <h2 className="font-semibold text-[22px]e">
                                Прогресс
                            </h2>
                            <div className="w-full p-8">

                            </div>
                        </div>
                    </div>
                </Wrapper>

            </div>
    )
}
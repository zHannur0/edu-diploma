"use client"

import {useGetProfileQuery} from "@/store/api/proileApi";
import Input from "@/components/ui/input/Input";
import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

const UserInfoForm = () => {
    const {data: user} = useGetProfileQuery();
    console.log(user)
    return (
        <div>
            <div className="bg-white p-8 rounded-xl">
                <h2 className="font-semibold text-[22px]e">
                    Парақша
                </h2>
                <div className="flex gap-6 w-full">
                    <div>
                        {user?.profile_picture &&
                            <Image src={user.profile_picture} alt={"avatar"} className="rounded-2xl w-25 h-25"
                                   width={100} height={100}/>
                        }
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <h3>
                            Жеке кабинет
                        </h3>
                        <Input label={"Толық есім"} value={"Дильназ"} disabled={true} onChange={() => {
                        }}/>
                        <EmailInput label={"Email"} value={"dilnaz@gmail.com"} disabled={true} onChange={() => {
                        }}/>
                        <p className="text-sm mt-2">
                            Пароль
                        </p>
                        <PasswordInput label="Старый пароль" value={"asdf"} className={"mb-2"} onChange={() => {
                        }}/>
                        <div className="flex justify-end">
                            <Button width={328}
                                    style={{backgroundColor: "transparent"}}>
                                Дұрыстау
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfoForm;
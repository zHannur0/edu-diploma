"use client"

import Input from "@/components/ui/input/Input";
import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import useProfileForm from "@/hooks/useProfileform";
import React, {useEffect, useRef, useState} from "react";
import SuccessModal from "@/components/modal/SuccessModal";
import {useModalLogic} from "@/hooks/useModalLogic";

const ProfileInfoForm = () => {

    const [isEdit, setIsEdit] = useState(false);
    const {values, handleChange, handleSubmit, setAvatarFile, isError, isSuccess} = useProfileForm();
    const [isHovering, setIsHovering] = useState(false);

    const modalLogic = useModalLogic();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                handleChange({
                    target: {
                        name: 'avatar',
                        value: event.target.result
                    }
                } as React.ChangeEvent<HTMLInputElement>);
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (isSuccess) {
            modalLogic.showSuccess();
        }
        if (isError) {
            modalLogic.showError();
        }
    }, [isSuccess, isError])

    return (
        <div>
            {
                modalLogic.showSuccessModal && (
                    <SuccessModal onOk={modalLogic.onSuccessModalClose} onClose={modalLogic.onSuccessModalClose}/>
                )
            }
            {
                modalLogic.showErrorModal && (
                    <SuccessModal onOk={() => {}} onClose={modalLogic.onErrorModalClose}/>
                )
            }
            <div className="bg-[#F9F9F9] p-8 rounded-xl">
                <h2 className="font-semibold text-[22px] mb-5">
                    Парақша
                </h2>
                <form className="flex gap-6 w-full" onSubmit={handleSubmit}>
                    <div className="relative">
                        {typeof values?.avatar === "string" && values.avatar !== "" ? (
                            <div className="relative"
                                 onMouseEnter={() => isEdit && setIsHovering(true)}
                                 onMouseLeave={() => setIsHovering(false)}
                            >
                                <Image
                                    src={values.avatar}
                                    alt={"avatar"}
                                    className="rounded-2xl min-w-25 h-25 object-cover"
                                    width={100}
                                    height={100}
                                />
                                {isEdit && isHovering && (
                                    <div
                                        className="absolute flex items-center justify-center border border-[#7B68EE] bg-[#F9F9F9] inset-0 rounded-2xl cursor-pointer"
                                        onClick={triggerFileInput}
                                    >
                                        <span className="text-[#7B68EE] text-xs text-center">Фотосуретті өзгерту</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={`rounded-2xl min-w-25 h-25 flex items-center justify-center bg-[#F9F9F9] border border-[#7B68EE] p-4 ${isEdit ? 'cursor-pointer' : ''}`}
                                onClick={isEdit ? triggerFileInput : undefined}
                            >
                                {isEdit ? (
                                    <div className="text-center">
                                        <span className="text-center text-[#7B68EE] text-xs">Фотосурет қосу</span>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={!isEdit}
                        />
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <h3>
                            Жеке кабинет
                        </h3>
                        <Input label={"Толық есім"}
                               value={values.username}
                               name={"username"}
                               onChange={handleChange}
                               disabled={!isEdit}
                        />
                        <EmailInput label={"Email"}
                                    value={values.email}
                                    onChange={handleChange}
                                    name={"email"}
                                    disabled={true}
                        />
                        {isEdit && (
                            <>
                                <p className="text-sm mt-2">
                                    Жаңа Құпия Сөз
                                </p>
                                <PasswordInput label="Жаңа Құпия сөз"
                                               value={values.newPassword}
                                               className={"mb-2"}
                                               name={"newPassword"}
                                               onChange={handleChange}
                                />
                                <p className="text-sm mt-2">
                                    Жаңа Құпия Сөзді Растаңыз
                                </p>
                                <PasswordInput label="Растау"
                                               value={values.newPasswordConfirm}
                                               className={"mb-2"}
                                               name={"newPasswordConfirm"}
                                               onChange={handleChange}
                                />
                                <p className="text-sm mt-2">
                                    Ескі құпия сөзіңізді теріңіз
                                </p>
                                <PasswordInput label="Растау"
                                               value={values.last_password}
                                               className={"mb-2"}
                                               name={"last_password"}
                                               onChange={handleChange}
                                />
                            </>
                        )}
                        <div className="w-full flex justify-end gap-3 items-center">
                            <Button width={200}
                                    onClick={() => {
                                        setIsEdit(!isEdit)
                                    }}
                                    style={{color: "#7B68EE"}}
                                    className="bg-transparent"
                                    type="button"
                            >
                                {isEdit ? "Жабу" : "Дұрыстау"}
                            </Button>
                            {
                                isEdit && (
                                    <Button width={200}
                                            type="submit"
                                    >
                                        Сақтау
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileInfoForm;
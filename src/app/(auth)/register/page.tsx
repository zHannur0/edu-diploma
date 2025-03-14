"use client"

import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import CustomLink from "@/components/ui/link/CustomLink";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";

export default function LoginPage() {
    return (
        <div className="flex flex-col w-full max-w-[520px]">
            <h1 className="mb-6 text-[#363E4A] text-[28px] font-bold">
                {"Let's Learn English Creatively!"}
            </h1>
            <p className="mb-14 text-[#363E4A] text-lg font-medium">
                Master English with AI-powered learning and engaging <br/> lessons!
            </p>
            <form action="" className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <Input placeholder={"Username"} label={"Username"}/>
                    <EmailInput/>
                    <PasswordInput type={1}/>
                    <PasswordInput type={2}/>
                </div>

                <div className="flex w-full justify-between">
                    <div></div>
                </div>

                <Button label={"Create account"} type="submit" onClick={(e) => e.preventDefault()}/>
            </form>
        </div>
    );
}
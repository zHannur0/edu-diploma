"use client"

import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import CustomLink from "@/components/ui/link/CustomLink";
import Button from "@/components/ui/button/Button";

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
                <EmailInput/>
                <PasswordInput/>
                <div className="flex w-full justify-between">
                    <div></div>
                    <CustomLink href={"#"} label={"Forgot Password?"}/>
                </div>
                <Button label={"Continue"} type="submit" onClick={(e) => e.preventDefault()}/>
                <div className="w-full text-center">
                    <span className="text-[#99A0AB] font-semibold">{"Don't have an account?"}</span> <CustomLink href={"/register"} label={"Sign In"}/>
                </div>
            </form>
        </div>
    );
}
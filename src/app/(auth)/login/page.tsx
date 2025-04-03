"use client"

import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import CustomLink from "@/components/ui/link/CustomLink";
import Button from "@/components/ui/button/Button";
import {useLoginForm} from "@/hooks/useLoginForm";

export default function LoginPage() {
    const {values, handleChange, handleSubmit, isLoading} = useLoginForm()

    return (
        <div className="flex flex-col w-full max-w-[520px]">
            <h1 className="mb-6 text-[#363E4A] text-[28px] font-bold">
                {"Let's Learn English Creatively!"}
            </h1>
            <p className="mb-14 text-[#363E4A] text-lg font-medium">
                Master English with AI-powered learning and engaging <br/> lessons!
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <EmailInput value={values.email} onChange={handleChange} name="email" />
                <PasswordInput value={values.password} onChange={handleChange} typeLabel={1} name="password" />
                <div className="flex w-full justify-between">
                    <div></div>
                    <CustomLink href={"#"} label={"Forgot Password?"}/>
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Continue"}
                </Button>
                <div className="w-full text-center">
                    <span className="text-[#99A0AB] font-semibold">{"Don't have an account?"}</span> <CustomLink href={"/register"} label={"Sign Up"}/>
                </div>
            </form>
        </div>
    );
}
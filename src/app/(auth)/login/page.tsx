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
                Ағылшынды жеңіл үйренейік
            </h1>
            <p className="mb-14 text-[#363E4A] text-lg font-medium">
                AI көмегімен тілді үйреніп, қызықты сабақтар арқылы <br/> ағылшын тілін меңгер! <br/> Және өзің
                армандаған оқу орыны жайлы ақпараттар біл!
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <EmailInput value={values.email} onChange={handleChange} name="email" />
                <PasswordInput value={values.password} onChange={handleChange} typeLabel={1} name="password" />
                <div className="flex w-full justify-between">
                    <div></div>
                    <CustomLink href={"/forgot-password"} label={"Құпия сөзді ұмыттыңыз ба?"}/>
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Жүктелуде..." : "Кіру"}
                </Button>
                <div className="w-full text-center">
                    <span className="text-[#99A0AB] font-semibold">{"Don't have an account?"}</span> <CustomLink href={"/register"} label={"Тіркелу"}/>
                </div>
            </form>
        </div>
    );
}
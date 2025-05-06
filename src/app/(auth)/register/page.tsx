"use client"

import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import {useRegisterForm} from "@/hooks/useRegisterForm";

export default function LoginPage() {
    const {values, handleSubmit, handleChange, isLoading, isError} = useRegisterForm()

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
                <div className="grid grid-cols-2 gap-6">
                    <Input placeholder={"Пайдаланушы аты"} label={"Пайдаланушы аты"} value={values.username} onChange={handleChange}
                           name="username"/>
                    <EmailInput value={values.email} onChange={handleChange} name="email"/>
                    <PasswordInput typeLabel={1} value={values.password} onChange={handleChange} name="password"/>
                    <PasswordInput typeLabel={2} value={values.repeatPassword} onChange={handleChange}
                                   name="repeatPassword"/>
                </div>

                {isError && (
                    <p className="text-red-600 text-sm text-center font-medium">
                        Бұл пошта қолданушысы ендігі кезекте тіркелген. Немесе толтырылған деректер қате!
                    </p>
                )}
                <Button type="submit">{isLoading ? "Жүктелуде..." : "Тіркелу"}</Button>
            </form>
        </div>
    );
}
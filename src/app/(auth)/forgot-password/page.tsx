"use client"

import EmailInput from "@/app/(auth)/components/EmailInput";
import PasswordInput from "@/app/(auth)/components/PasswordInput";
import Button from "@/components/ui/button/Button";
import React, { useState, ChangeEvent, FormEvent } from "react";
import {
    useResetPasswordEmailMutation,
    useVerifyResetPasswordMutation,
    useResetPasswordMutation
} from "@/store/api/authApi"; // API мутацияларының импорты
import Link from "next/link";

interface FormValues {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
    api?: string;
}

export default function ForgotPage() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [values, setValues] = useState<FormValues>({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [sessionToken, setSessionToken] = useState<string>();

    const [resetPasswordEmail, { isLoading: isLoadingEmail }] = useResetPasswordEmailMutation();
    const [verifyResetPassword, { isLoading: isLoadingOtp }] = useVerifyResetPasswordMutation();
    const [resetPassword, { isLoading: isLoadingPassword }] = useResetPasswordMutation();

    const isLoading = isLoadingEmail || isLoadingOtp || isLoadingPassword;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // TextAreaElement қосылды (қажет болса)
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof Errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        setErrors(prev => ({ ...prev, api: undefined }));
    };

    const validateStep1 = (): boolean => {
        const newErrors: Errors = {};
        if (!values.email) {
            newErrors.email = "Email міндетті.";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = "Email форматы жарамсыз.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Errors = {};
        if (!values.otp) {
            newErrors.otp = "OTP коды міндетті.";
        } else if (!/^\d{6}$/.test(values.otp)) { // Тек 6 саннан тұруын тексеру
            newErrors.otp = "OTP 6 саннан тұруы керек.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = (): boolean => {
        const newErrors: Errors = {};
        if (!values.password) {
            newErrors.password = "Құпия сөз міндетті.";
        } else if (values.password.length < 8) {
            newErrors.password = "Құпия сөз кемінде 8 таңбадан тұруы керек.";
        }
        if (!values.confirmPassword) {
            newErrors.confirmPassword = "Құпия сөзді қайталау міндетті.";
        } else if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
            newErrors.confirmPassword = "Құпия сөздер сәйкес келмейді.";
            newErrors.password = "Құпия сөздер сәйкес келмейді."; // Екі өріске де қате көрсету
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        try {
            if (currentStep === 1) {
                if (!validateStep1()) return;
                await resetPasswordEmail({ email: values.email }).unwrap();
                setCurrentStep(2);
            } else if (currentStep === 2) {
                if (!validateStep2()) return;
                // Осы жерде email мәнін қайта қолдану маңызды
                const res = await verifyResetPassword({ email: values.email, otp: values.otp }).unwrap();
                setSessionToken(res.session_token);
                setCurrentStep(3);
            } else if (currentStep === 3) {
                if (!validateStep3()) return;
                // API сұрауында password2 күтілуі мүмкін
                await resetPassword({ password: values.password, password2: values.confirmPassword, session_token: sessionToken || "" }).unwrap();
                setSuccessMessage("Құпия сөз сәтті жаңартылды!");
                setCurrentStep(4);
            }
        } catch (err) {
            console.error("Password reset error:", err);
            const apiErrorMessage = "Белгісіз қате пайда болды.";
            setErrors({ api: apiErrorMessage });
        }
    };

    const renderButtonText = () => {
        if (isLoading) return "Жүктелуде...";
        switch (currentStep) {
            case 1: return "Кодты Жіберу";
            case 2: return "Тексеру";
            case 3: return "Құпия Сөзді Жаңарту";
            default: return "";
        }
    };

    const renderDescription = () => {
        switch (currentStep) {
            case 1: return "Email поштаңызды енгізіп, кодты жіберуді басыңыз.";
            case 2: return `${values.email} поштасына жіберілген 6 санды кодты енгізіңіз.`;
            case 3: return "Жаңа құпия сөзді орнатып, оны растаңыз.";
            default: return "Құпия сөзді қалпына келтіріп, бірнеше қадамда аккаунтыңызға қайта кіріңіз."; // Бастапқы мәтін
        }
    };


    if (currentStep === 4) {
        return (
            <div className="flex flex-col w-full max-w-[520px] items-center text-center gap-4">
                <h1 className="text-[#363E4A] text-[28px] font-bold">Сәтті Аяқталды!</h1>
                <p className="text-green-600">{successMessage}</p>
                <Link href="/login" legacyBehavior>
                    <a className="text-sm text-indigo-600 hover:underline">
                        Кіру бетіне оралу
                    </a>
                </Link>
            </div>
        );
    }

    return (
        // Бастапқы контейнер (дизайнсыз)
        <div className="flex flex-col w-full max-w-[520px]">
            {/* Бастапқы тақырып */}
            <h1 className="mb-6 text-[#363E4A] text-[28px] font-bold">
                Құпия сөзді ұмыттыңыз ба?
            </h1>
            {/* Динамикалық сипаттама */}
            <p className="mb-14 text-[#363E4A] text-lg font-medium">
                {renderDescription()}
            </p>

            {/* Бастапқы форма */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Email - тек 1-ші қадамда көрсетіледі */}
                {currentStep === 1 && (
                    <EmailInput
                        value={values.email}
                        onChange={handleChange}
                        name="email"
                        disabled={isLoading}
                    />
                )}

                {/* OTP - тек 2-ші қадамда көрсетіледі */}
                {currentStep === 2 && (
                    <div className="flex flex-col gap-1">
                        <label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP Коды</label>
                        <input
                            id="otp"
                            name="otp"
                            type="text" // text немесе number, бірақ text әдетте жақсырақ
                            inputMode="numeric" // Сандық пернетақтаны көрсету (мобильді)
                            pattern="\d{6}" // 6 сан pattern-і
                            maxLength={6}
                            value={values.otp}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.otp ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'}`} // Минималды стиль
                            placeholder="------"
                            required
                        />
                        {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp}</p>}
                    </div>
                )}

                {/* Пароль өрістері - тек 3-ші қадамда көрсетіледі */}
                {currentStep === 3 && (
                    <>
                        <PasswordInput
                            value={values.password}
                            onChange={handleChange}
                            typeLabel={1} // 1 - 'Құпия сөз'
                            name="password"
                            disabled={isLoading}
                        />
                        <PasswordInput
                            value={values.confirmPassword}
                            onChange={handleChange}
                            typeLabel={2} // 2 - 'Құпия сөзді қайталаңыз'
                            name="confirmPassword"
                            disabled={isLoading}
                        />
                    </>
                )}

                {/* Жалпы API қатесі */}
                {errors.api && <p className="text-xs text-red-500 text-center -mt-2">{errors.api}</p>}

                {/* Батырма */}
                <Button type="submit" disabled={isLoading}>
                    {renderButtonText()}
                </Button>
            </form>

            {/* Кіру бетіне сілтеме (4-ші қадамнан басқа) */}
            <div className="mt-6 text-center">
                <Link href="/login" legacyBehavior>
                    <a className="text-sm text-indigo-600 hover:underline">
                        Кіру бетіне оралу
                    </a>
                </Link>
            </div>
        </div>
    );
}
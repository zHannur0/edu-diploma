import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {useSignInMutation} from "@/store/api/authApi";

interface LoginFormValues {
    email: string;
    password: string;
}

interface LoginFormErrors {
    email: string;
    password: string;
}

interface UseLoginFormReturn {
    values: LoginFormValues;
    errors: LoginFormErrors;
    isLoading: boolean;
    isError: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
    const [values, setValues] = useState<LoginFormValues>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<LoginFormErrors>({
        email: '',
        password: ''
    });

    const router = useRouter();
    const [signIn, { isLoading, isError }] = useSignInMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof LoginFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!values.email) {
            newErrors.email = 'Email обязателен';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = 'Неверный формат email';
            isValid = false;
        }

        if (!values.password) {
            newErrors.password = 'Пароль обязателен';
            isValid = false;
        } else if (values.password.length < 3) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const result = await signIn({
                email: values.email,
                password: values.password
            }).unwrap();

            if (result.access) {
                localStorage.setItem('token', result.access);
                router.push('/profile');
            }
        } catch (err) {
            console.log('Ошибка входа:', err);
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        isError,
        isLoading
    }

}
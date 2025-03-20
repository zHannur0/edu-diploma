import React, {FormEvent, useState} from "react";
import {useSignUpMutation} from "@/store/api/authApi";

interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
}

interface RegisterFormValuesErrors {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
}

interface UseRegisterFormReturn {
    values: RegisterFormValues;
    errors: RegisterFormValuesErrors;
    isLoading: boolean;
    isError: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useRegisterForm = (): UseRegisterFormReturn => {
    const [values, setValues] = useState<RegisterFormValues>({
        username: "",
        email: "",
        password: "",
        repeatPassword: ""
    });

    const [errors, setErrors] = useState<RegisterFormValuesErrors>({
        username: "",
        email: "",
        password: "",
        repeatPassword: ""
    });

    const [signUp, {isLoading, isError}] = useSignUpMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof RegisterFormValuesErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const result = await signUp({
                first_name: values.username,
                email: values.email,
                password: values.password,
                password2: values.repeatPassword
            }).unwrap()
            console.log(result)
            // if (result.id) {
            //     router.push("/login");
            // }
        } catch (err) {
            console.log(err)
        }
    }

    return {
        values,
        errors,
        isError,
        isLoading,
        handleSubmit,
        handleChange
    }
}


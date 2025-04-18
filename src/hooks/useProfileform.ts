import React, {FormEvent, useEffect, useState} from "react";
import {useGetProfileQuery, useUpdateProfileMutation} from "@/store/api/proileApi";

interface ProfileFormValues {
    id?: number;
    username: string;
    avatar: string;
    email: string;
    last_password?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
}

interface UseProfileFormReturna {
    values: ProfileFormValues;
    isLoading?: boolean;
    isError?: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
    isSuccess: boolean;
}

const useProfileForm = (): UseProfileFormReturna => {
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [values, setValues] = useState<ProfileFormValues>({
        username: "",
        avatar: "",
        newPassword: "",
        newPasswordConfirm: "",
        email: "",
        last_password: "",
    });

    const {data: user} = useGetProfileQuery(undefined, {refetchOnMountOrArgChange: true});
    const [updateProfile, {isSuccess, isError}] = useUpdateProfileMutation();

    useEffect(() => {
        if (user) {
            setValues({
                ...values,
                username: user.first_name,
                email: user.email,
                avatar: user.profile_picture
            })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const { name, value } = e.target;

        if (file) {
            setValues((prev) => ({
                ...prev,
                [name]: value
            }));
            return;
        }

        setValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!values.username) {
            newErrors.email = 'Username обязателен';
            isValid = false;
        }

        if (values.newPassword && (!values.newPasswordConfirm || !values.last_password)) {
            isValid = false;
        }

        if (values.newPasswordConfirm && (!values.newPassword || !values.last_password)) {
            isValid = false;
        }

        if (values.last_password && (!values.newPasswordConfirm || !values.newPassword)) {
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();

        if (values.username) {
            formData.append('first_name', values.username);
        }

        if (avatarFile) {
            formData.append('profile_picture', avatarFile);
        }

        if (values.newPassword) {
            formData.append('password', values.newPassword);

        }

        if (values.newPasswordConfirm) {
            formData.append('password2', values.newPasswordConfirm);
        }

        if (values.last_password) {
            formData.append('last_password', values.last_password);
        }

        try {
            await updateProfile(formData)
        } catch (e) {
            console.log(e)
        }
    }

    return {
        values,
        handleChange,
        handleSubmit,
        setAvatarFile,
        isSuccess,
        isError
    }
}

export default useProfileForm;
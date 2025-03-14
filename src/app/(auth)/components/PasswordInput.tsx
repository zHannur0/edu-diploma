import Input from "@/components/ui/input/Input";

const PasswordInput = (
    {type}: {type: number},
) => {
    return (
        <Input iconEnd={"/icon/auth/closed.svg"} type={"password"} label={type === 1 ? "Password" : "Reset Password"} placeholder={type === 1 ? "Password" : "Reset Password"} />
    );
}

export default PasswordInput;
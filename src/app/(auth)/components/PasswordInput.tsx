import Input from "@/components/ui/input/Input";

const PasswordInput = () => {
    return (
        <Input iconEnd={"/icon/auth/closed.svg"} type={"password"} label={"Password"}/>
    );
}

export default PasswordInput;
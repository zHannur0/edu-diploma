import Input from "@/components/ui/input/Input";

const EmailInput = () => {
    return (
        <Input iconStart={"/icon/auth/letter.svg"} type={"email"} label={"Email"} placeholder={"Email"}/>
    );
}

export default EmailInput;
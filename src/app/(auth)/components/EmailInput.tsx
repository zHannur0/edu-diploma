import Input, {InputProps} from "@/components/ui/input/Input";
import React from "react";

const EmailInput: React.FC<InputProps> = ({...props}) => {
    return (
        <Input iconStart={"/icon/auth/letter.svg"} type={"email"} label={"Email"} placeholder={"Email"} {...props} />
    );
}

export default EmailInput;
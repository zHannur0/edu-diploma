import {ReactNode} from "react";

const Wrapper = ({children}: {children: ReactNode }) => {
    return (
        <div className="wrapper relative w-full max-w-[1440px] h-auto flex flex-col items-center px-12">
            {children}
        </div>
    );
}

export default Wrapper;
import {ReactNode} from "react";
import Loading from "@/components/ui/loading/Loading";

interface WrapperProps {
    children: ReactNode;
    isLoading?: boolean;
    className?: string;
}

const Wrapper = ({children, isLoading, className}: WrapperProps) => {
    return (
        <>
            {isLoading && (
                <Loading/>
            )}
            <div className={`wrapper relative w-full max-w-[1440px] h-auto px-12 ${className}`}>
                {children}
            </div>
        </>
    );
}

export default Wrapper;
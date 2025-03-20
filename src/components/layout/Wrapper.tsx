import {ReactNode} from "react";
import Loading from "@/components/ui/loading/Loading";

const Wrapper = ({children, isLoading}: {children: ReactNode, isLoading?: boolean }) => {
    return (
        <>
            {isLoading && (
                <Loading/>
            )}
            <div className="wrapper relative w-full max-w-[1440px] h-auto px-12">
                {children}
            </div>
        </>
    );
}

export default Wrapper;
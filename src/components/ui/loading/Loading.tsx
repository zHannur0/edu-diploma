import React from "react";

const Loading = () => {
    return (
        <div className="fixed flex justify-center items-center h-screen w-full bg-black/10">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;

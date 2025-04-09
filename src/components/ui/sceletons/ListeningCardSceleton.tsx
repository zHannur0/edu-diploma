const ListeningCardSkeleton = () => {
    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl animate-pulse">
            <div className="flex gap-3 mb-6 items-start w-full">
                <div className="font-bold text-lg rounded-full bg-gray-200 flex items-center justify-center h-11 w-11">

                </div>
                <div className="flex flex-col gap-3">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
            <div className="p-2 flex gap-3 mb-13 items-center bg-gray-100 rounded-[28px] w-full">
                <div className="font-bold text-lg rounded-full bg-gray-200 p-[10px] h-[60px] w-[60px]">

                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="w-full flex justify-between gap-4 mt-6">
                {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center w-full max-w-[268px] bg-gray-100 p-3 rounded-2xl">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="p-3 rounded-2xl bg-white">
                            <div className="w-4 h-4 rounded-sm bg-gray-200"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ListeningCardSkeleton;
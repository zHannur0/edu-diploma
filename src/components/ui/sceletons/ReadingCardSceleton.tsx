const ReadingCardSkeleton = () => {
    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl animate-pulse">
            <div className="flex gap-3 mb-10 items-start w-full">
                <div className="font-bold text-lg rounded-full bg-gray-200 flex items-center justify-center h-11 w-11">

                </div>
                <div className="flex flex-col gap-3">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
            <div className="flex gap-10 mb-10 w-full">
                <div className="min-w-[300px] h-[170px] bg-gray-200 rounded"></div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
            <div className="w-full flex justify-between gap-4">
                {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center w-full max-w-[268px] bg-gray-100 p-2 rounded-2xl">
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

export default ReadingCardSkeleton;
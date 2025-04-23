
const MyAchievments = () => {

    return (
        <div className="bg-[#F9F9F9] p-8 rounded-xl max-h-[400px] min-h-[400px]">
            <h2 className="font-semibold text-[22px] mb-6">
                Менің жетістіктерім
            </h2>
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
                    <ul className="space-y-5">
                        <li className="flex items-center">
        <span className="inline-block p-2 bg-purple-100 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </span>
                            <div>
                                <p className="text-sm text-gray-600">Күнделікті прогресс</p>
                                <p className="font-semibold text-gray-900">200</p>
                            </div>
                        </li>

                        <li className="flex items-center">
        <span className="inline-block p-2 bg-orange-100 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round"
                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/> </svg>
        </span>
                            <div>
                                <p className="text-sm text-gray-600">Ұпайлар</p>
                                <p className="font-semibold text-gray-900">34</p>
                            </div>
                        </li>

                        <li className="flex items-center">
        <span className="inline-block p-2 bg-blue-100 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round"
                   d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/> </svg>
        </span>
                            <div>
                                <p className="text-sm text-gray-600">Деңгей</p>
                                <p className="font-semibold text-blue-600">Beginner</p>
                            </div>
                        </li>

                        <li className="flex items-center">
         <span className="inline-block p-2 bg-red-100 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/> </svg>
        </span>
                            <div>
                                <p className="text-sm text-gray-600">Дайындық</p>
                                <p className="font-semibold text-gray-900">General English</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
    );
}

export default MyAchievments;
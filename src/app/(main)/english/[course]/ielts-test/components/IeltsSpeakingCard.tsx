// "use client"
// import React, {ChangeEvent, useEffect, useState} from "react";
// import {useSubmitWritingMutation} from "@/store/api/generalEnglishApi";
// import {useRouter} from "next/navigation";
// import SuccessModal from "@/components/modal/SuccessModal";
// import ErrorModal from "@/components/modal/ErrorModal";
// import {useModalLogic} from "@/hooks/useModalLogic";
// import useVoiceRecorder from "@/hooks/useVoiceRecorder";
// import {FaMicrophone, FaStop} from "react-icons/fa";
//
// const IeltsSpeakingCard = () => {
//     const router = useRouter();
//     const [writingAnswer, setWritingAnswer] = useState<string>("Start writing");
//     const modalLogic = useModalLogic();
//
//     const [submitWriting] = useSubmitWritingMutation();
//
//     const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
//
//     useEffect(() => {
//         const writingAns = sessionStorage.getItem("writingAnswer");
//         setWritingAnswer(String(writingAns || ""));
//     }, [])
//
//     // const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//     //     const value = e.target.value;
//     //     setWritingAnswer(value)
//     //     sessionStorage.setItem("writingAnswer", value);
//     // }
//     //
//     // const handleSubmit = async () => {
//     //     try {
//     //         await submitWriting({
//     //             id: Number(module),
//     //             data: {writing: writingAnswer}
//     //         }).unwrap();
//     //
//     //         modalLogic.showSuccess();
//     //         sessionStorage.removeItem("writingAnswer");
//     //     } catch (e) {
//     //         console.log(e);
//     //         modalLogic.showError();
//     //     }
//     // }
//
//     return (
//         <div className="w-full max-w-[1100px] p-4 flex flex-col bg-white items-start rounded-3xl gap-3">
//             <div className="flex flex-col gap-3">
//                 <p className="font-bold">
//                     Speaking
//                 </p>
//                 {/*<p className="text-sm text-[#737B98] font-medium">*/}
//                 {/*    {writing?.title}*/}
//                 {/*</p>*/}
//                 {/*<p className="text-xs text-[#737B98]">*/}
//                 {/*    {writing?.description}*/}
//                 {/*</p>*/}
//                 {/*{*/}
//                 {/*    writing?.images.map((image, i) => (*/}
//                 {/*        <Image key={i + 12431} src={image} alt={`image-${i}`} width={300} height={170}/>*/}
//                 {/*    ))*/}
//                 {/*}*/}
//             </div>
//             <div className="w-full flex flex-col items-center gap-4 mb-2">
//                 <button
//                     onClick={isRecording ? stopRecording : startRecording}
//                     className={`mt-4 w-full max-w-[200px] h-16 flex items-center justify-center rounded-full
//                     ${isRecording ? "bg-red-500 animate-pulse" : "bg-blue-500"} text-white text-2xl shadow-lg`}
//                 >
//                     {isRecording ? <FaStop/> : <FaMicrophone/>}
//                 </button>
//             </div>
//             {
//                 modalLogic.showSuccessModal && (
//                     <SuccessModal
//                         onOk={() => router.push(`/listening/2`)}
//                         onClose={modalLogic.onSuccessModalClose}
//                     />
//                 )
//             }
//             {
//                 modalLogic.showErrorModal && (
//                     <ErrorModal
//                         onClose={modalLogic.onErrorModalClose}
//                     />
//                 )
//             }
//         </div>
//     )
// }
//
// export default IeltsSpeakingCard;
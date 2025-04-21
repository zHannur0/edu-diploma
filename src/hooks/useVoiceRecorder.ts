import { useState, useEffect } from "react";

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: ((event: Event) => void) | null;
}

// Add type declaration for the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
}

// Extend Window interface
declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

interface UseVoiceRecorderReturn {
    isRecording: boolean;
    transcript: string;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    audioBlob: Blob | null;
    setTranscript: (transcript: string) => void;
}

const useVoiceRecorder = (): UseVoiceRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcript, setTranscript] = useState<string>("");
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    console.log(transcript)
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognitionAPI) {
            const recognitionInstance = new SpeechRecognitionAPI();
            recognitionInstance.continuous = true;
            recognitionInstance.lang = 'en-US';  // You can make this configurable
            recognitionInstance.interimResults = false;
            recognitionInstance.maxAlternatives = 1;

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                const currentTranscript = event.results[event.results.length - 1][0].transcript;
                setTranscript(prev => prev + " " + currentTranscript);
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.log('Speech recognition error:', event.error);
            };

            recognitionInstance.onend = () => {
                if (isRecording) {
                    recognitionInstance.start();
                }
            };

            setRecognition(recognitionInstance);
        } else {
            console.log("Speech recognition not supported in this browser");
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [isRecording]);

    const startRecording = async () => {
        if (transcript) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            const chunks: BlobPart[] = [];
            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);

                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);

            if (recognition) {
                recognition.start();
            }
        } catch (error) {
            console.log("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }

        if (recognition) {
            recognition.stop();
        }

        setIsRecording(false);
    };

    return { isRecording, transcript, startRecording, stopRecording, audioBlob, setTranscript };
};

export default useVoiceRecorder;
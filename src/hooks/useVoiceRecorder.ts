import { useState, useEffect, useRef, useCallback } from "react";

// --- Interfaces ---
interface SpeechRecognitionResultList { length: number; item(index: number): SpeechRecognitionResult; [index: number]: SpeechRecognitionResult; }
interface SpeechRecognitionResult { isFinal: boolean; length: number; item(index: number): SpeechRecognitionAlternative; [index: number]: SpeechRecognitionAlternative; }
interface SpeechRecognitionAlternative { transcript: string; confidence: number; }
interface SpeechRecognition extends EventTarget { continuous: boolean; lang: string; interimResults: boolean; maxAlternatives: number; start(): void; stop(): void; abort(): void; onresult: ((event: Event) => void) | null; onerror: ((event: Event) => void) | null; onend: ((event: Event) => void) | null; }
interface SpeechRecognitionConstructor { new (): SpeechRecognition; }

// Custom interface extending Event for onresult handler
interface SpeechRecognitionEventWithIndex extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

// Custom interface extending Event for onerror handler
interface SpeechRecognitionErrorEventCustom extends Event {
    error: string; // Common type for SpeechRecognition error codes
}

// MediaRecorderErrorEvent type (should be globally available)
// Assuming it has 'error' property of type DOMException

declare global { interface Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; } }
// --- End Interfaces ---


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
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcript, setTranscript] = useState<string>("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);

    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            const recognitionInstance = new SpeechRecognitionAPI();
            recognitionInstance.continuous = true;
            recognitionInstance.lang = 'en-US';
            recognitionInstance.interimResults = true;
            recognitionInstance.maxAlternatives = 1;

            recognitionInstance.onresult = (event: Event) => { // Base Event type
                const recogEvent = event as SpeechRecognitionEventWithIndex; // Cast to custom type
                let finalTranscript = '';
                for (let i = recogEvent.resultIndex; i < recogEvent.results.length; ++i) {
                    if (recogEvent.results[i].isFinal) {
                        finalTranscript += recogEvent.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => (prev + finalTranscript).trim());
                }
            };

            recognitionInstance.onerror = (event: Event) => { // Base Event type
                const errorEvent = event as SpeechRecognitionErrorEventCustom; // Cast to custom type
                console.error('Speech recognition error:', errorEvent.error);
            };

            recognitionInstance.onend = () => {
                // console.log('Speech recognition ended.'); // Optional log
            };

            recognitionRef.current = recognitionInstance;
        } else {
            console.warn("Speech recognition not supported in this browser");
        }

        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                try { mediaRecorderRef.current.stop(); } catch(e) {
                    console.log(e)
                }
            }
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch(e) {
                    console.log(e)
                }
            }
        };
    }, []);

    const startRecording = useCallback(async () => {
        if (isRecording) {
            return;
        }

        setAudioBlob(null);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // Check if MediaRecorder is available
            if (typeof MediaRecorder === 'undefined') {
                console.error("MediaRecorder API is not supported in this browser.");
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop()); // Cleanup stream
                return;
            }

            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                setAudioBlob(blob);
                audioChunksRef.current = [];

                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                    mediaStreamRef.current = null;
                }
                mediaRecorderRef.current = null;
            };

            // Use specific MediaRecorderErrorEvent type if available, otherwise check structure
            recorder.onerror = (event: Event) => {
                let error: DOMException | null = null;
                // Use type guard 'instanceof ErrorEvent' or check property 'error'
                // Assuming MediaRecorderErrorEvent extends ErrorEvent or has error property
                if ('error' in event && event.error instanceof DOMException) {
                    error = event.error;
                } else if (event instanceof ErrorEvent) {
                    console.error("MediaRecorder ErrorEvent:", event.message);
                }

                console.error("MediaRecorder error:", error ? `${error.name}: ${error.message}` : "Unknown structure", event);

                setIsRecording(false);
                if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch(e) {
                        console.log(e)
                    }
                }
                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                    mediaStreamRef.current = null;
                }
                mediaRecorderRef.current = null;
            };

            recorder.start();
            setIsRecording(true);

            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (recogError) {
                    console.error("Speech recognition start error:", recogError);
                }
            }
        } catch (error) {
            console.error("Failed to start recording (getUserMedia or other):", error);
            setIsRecording(false);
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            mediaRecorderRef.current = null;
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (recogError) {
                console.error("Speech recognition stop error:", recogError);
            }
        }

        // Check state before stopping MediaRecorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
                mediaRecorderRef.current.stop();
            } catch(e) {
                console.error("Error stopping MediaRecorder:", e);
                // Force cleanup even if stop throws error
                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                    mediaStreamRef.current = null;
                }
                mediaRecorderRef.current = null;
            }
        } else {
            // If recorder not active, ensure stream is stopped
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
        }
        // Set isRecording to false regardless of stop errors
        setIsRecording(false);
    }, []);

    const handleSetTranscript = useCallback((newTranscript: string) => {
        setTranscript(newTranscript);
    }, []);

    return {
        isRecording,
        transcript,
        startRecording,
        stopRecording,
        audioBlob,
        setTranscript: handleSetTranscript
    };
};

export default useVoiceRecorder;
export interface OptionTest {
    id: number;
    option: string;
}

export interface AnswerTest {
    option_id?: number | null;
    question_id: number;
}

export interface QuestionReading {
    id: number;
    context: string;
    options: OptionTest[];
    source: string;
    image: string;
}

export interface Reading {
    id: number;
    context: string;
    image: string;
    source: string;
    readings: QuestionReading[];
}

export interface QuestionListening {
    id: number;
    audio_question: string;
    context: string;
    options: OptionTest[];
}

export interface Listening {
    id: number;
    name: string;
    listening_questions: QuestionListening[];
}

export interface WritingQuestion {
    id: number;
    title: string;
    requirements: string;
}

export interface Writing {
    id: number;
    name: string;
    writing: WritingQuestion
}

export interface AnswerSpeaking {
    speaking_id?: number | null;
    text: string;
}

export interface SpeakingQuestion {
    id: number;
    context: string;
}

export interface Speaking {
    id: number;
    name: string;
    speakings: SpeakingQuestion[];
}
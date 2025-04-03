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
    question: string;
    options: OptionTest[];
}

export interface Reading {
    id: number;
    context: string;
    image: string;
    source: string;
    questions: QuestionReading[];
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
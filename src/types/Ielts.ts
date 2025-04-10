
export interface Ielts {
    id: number;
    name: string;
    readings: Reading[];
    listenings: Listening[];
    writings: Writing[];
}

interface Reading {
    id: number;
    title: string;
    content: string;
    questions: Question[];
}

interface Listening {
    id: number;
    title: string;
    audio_file: string;
    questions: Question[];
}

interface Writing {
    id: number;
    title: string;
    description: string;
    images: string[];
}

interface Question {
    id: number;
    question_content: string;
    question_type: QuestionType;
    options: Option[] | string[];
}

type QuestionType = 'OPTIONS' | 'FILL_BLANK' | 'SELECT_INSERT_ANSWER';

interface Option {
    id: number;
    option: string;
}

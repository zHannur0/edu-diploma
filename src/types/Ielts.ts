
export interface Ielts {
    id: number;
    name: string;
    readings: IeltsReading;
    listenings: IeltsListening[];
    writings: IeltsWriting[];
}

export interface IeltsReading {
    id: number;
    title: string;
    content: string;
    questions: QuestionIelts[];
}

interface IeltsListening {
    id: number;
    title: string;
    audio_file: string;
    questions: QuestionIelts[];
}

export interface IeltsWriting {
    id: number;
    title: string;
    description: string;
    images: string[];
}

export interface QuestionIelts {
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

export interface IeltsModule {
    id: number;
    title: string;
    cover: string;
    sub_modules: IeltsSubModule[];
}

export interface IeltsSubModule {
    id?: number;
    title: string;
    difficulty?: string;
    tests: IeltsTests[];
}

export interface IeltsTests {
    id: number;
    name: string;
}




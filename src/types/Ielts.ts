
export interface Ielts {
    id: number;
    name: string;
    reading_passages: IeltsReading[];
    listening_parts: IeltsListening[];
    writing_tasks: IeltsWriting[];
    speaking_parts: IeltsSpeaking[];
}

export interface IeltsSpeakingQuestion {
    id: number;
    question: string;
    additional_information: string | null;
}

export interface IeltsSpeaking {
    part: number;
    speaking_questions: IeltsSpeakingQuestion[];
}

export interface IeltsReading {
    id: number;
    title: string;
    content: string;
    passage_number: number;
    questions: QuestionIelts[];
}

export interface IeltsListening {
    id: number;
    title: string;
    part: number;
    part_label: string;
    audio_file: string;
    questions: QuestionIelts[];
}

export interface IeltsWriting {
    id: number;
    title: string;
    description: string;
    images: string[];
    part: number;
}

export interface QuestionIelts {
    id: number;
    question_content: string;
    question_type: QuestionType;
    options: OptionIelts | OptionIelts[] | string[];
}

type QuestionType = 'OPTIONS' | 'FILL' | 'SELECT_INSERT';

export interface OptionIelts {
    id: number;
    option: string;
    options?: string[];
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




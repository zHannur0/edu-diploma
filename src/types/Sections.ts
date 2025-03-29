interface Option {
    id: number;
    option: string;
}

interface Question {
    id: number;
    question: string;
    options: Option[];
}

export interface Reading {
    id: number;
    context: string;
    image: string;
    source: string;
    questions: Question[];
}
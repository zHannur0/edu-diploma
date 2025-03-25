interface Option {
    id: number;
    option: string;
}


export interface Question {
    id: number;
    question: string;
    question_type: string;
    options: Option[];
}

export interface TrialQuestions {
    id: number;
    name: string;
    questions: Question[];
}
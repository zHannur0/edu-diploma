interface Option {
    option: string;
    is_correct: boolean;
    is_chosen: boolean;
}

interface Test {
    id: number;
    context: string;
    question: string;
    image: string | null;
    source: string;
    options: Option[];
}

export interface ReadingAttempt {
    section: string;
    score: number;
    test: Test[];
}
export interface AttemptOption {
    id?:number;
    option: string;
    is_correct: boolean;
    is_chosen: boolean;
}

export interface AttemptTest {
    id: number;
    context: string;
    question: string;
    image: string | null;
    source: string;
    options: AttemptOption[];
}

export interface ReadingAttempt {
    section: string;
    score: number;
    test: AttemptTest[];
}
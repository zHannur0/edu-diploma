export interface AttemptOption {
    id?:number;
    option: string;
    is_correct: boolean;
    is_chosen: boolean;
}

export interface AttemptReadingTest {
    id: number;
    context: string;
    question: string;
    image: string | null;
    source: string;
    options: AttemptOption[];
}

export interface AttemptListeningTest {
    id: number;
    context: string;
    audio_question: string;
    source: string;
    options: AttemptOption[];
}

export interface ReadingAttempt {
    section: string;
    score: number;
    test: AttemptReadingTest[];
}

export interface ListeningAttempt {
    section: string;
    score: number;
    test: AttemptListeningTest[];
}

export interface WritingAttemptTexts {
    user_text: string;
    ai_feedback: string;
}

export interface WritingAttempt {
    section: string;
    score: number;
    writing: WritingAttemptTexts;
}
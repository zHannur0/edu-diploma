export interface Course {
    id: number;
    name: string;
    modules_count: number;
    has_level_define: true;
    trial_passed: string;
    description: string;
    duration: number;
    last_module: number;
    last_module_name: string;
    user_course: string;
    user_progress: number;
    modules: Module[];
}

export interface Module {
    id: number;
    name: string;
    is_completed: boolean;
    total_score: number;
    sections: {
        reading: Section;
        listening: Section;
        writing: Section;
        speaking: Section;
    };
}

export interface Section {
    has_section: boolean;
    already_passed: boolean;
    score: number | null;
};

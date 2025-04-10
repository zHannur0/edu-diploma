export interface UserProfile {
    id: number;
    profile_picture: string;
    first_name: string;
    email: string;
    is_staff: boolean;
}

export interface CourseProgress {
    course_id: number;
    course_name: string;
    last_module: number;
    last_module_name: string;
    progress_percentage: string;
    modules_count: string;
    level: string;
}



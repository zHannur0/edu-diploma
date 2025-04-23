export interface UniversitiesResponse {
    id: number;
    name: string;
    image: string;
    duration: string;
    pace: string;
    location: string;
    languages: string;
    description: string;
    is_favorite: boolean;
}

export interface Location {
    id: number;
    name: string;
}

export interface Language {
    id: number;
    name: string;
}

export interface StudyFormat {
    id: number;
    name: string;
}

export interface Duration {
    id: number;
    duration: number;
    prefix: string;
}

export interface DegreeType {
    id: number;
    name: string;
}

export interface FieldOfStudy {
    id: number;
    name: string;
    tuition_fee?: string;
}

export interface University {
    id: number;
    location: Location;
    languages: Language[];
    study_formats: StudyFormat[];
    duration: Duration;
    degree_type: DegreeType;
    fields_of_study: FieldOfStudy[];
    name: string;
    image: string;
    about: string;
    logo: string;
    key_summary: string;
    introduction: string;
    academic_requirements: string;
    scholarships_funding: string;
    tuition_fees: string;
    pace: string;
    application_deadline: string;
}


interface FavoritesUniversity {
    id: number;
    name: string;
    image: string;
    duration: string;
    pace: string;
    location: string;
    languages: string;
    description: string;
}

export interface FavoritesData {
    id: number;
    university: FavoritesUniversity;
    created_at: string;
}
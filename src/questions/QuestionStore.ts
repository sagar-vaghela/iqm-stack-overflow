export interface QuestionQuery {
    limit: number;
    offset: number;
}

export interface QuestionData {
    author: string;
    title: string;
    creationDate: number;
    body: string;
    link: string;
}

export type QuestionStore = QuestionData[];
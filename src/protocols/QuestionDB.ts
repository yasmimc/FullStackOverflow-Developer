export default interface QuestionDB {
    id?: number;
    question: string;
    student_name: string;
    student_class: string;
    answered: boolean;
    submit_at?: number;
}

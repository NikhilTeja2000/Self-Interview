export type InterviewType = 'behavioral' | 'technical' | 'product' | 'f1-visa' | 'b1b2-visa' | 'custom';

export interface InterviewOption {
  id: InterviewType;
  title: string;
  description: string;
  icon: any;
}

export interface Question {
  id: string;
  text: string;
  type: InterviewType;
  tip?: string;
}

export interface Feedback {
  clarity: number;
  confidence: number;
  completeness: number;
  suggestions: string[];
}

export interface Answer {
  questionId: string;
  text: string;
  feedback: Feedback;
}

export interface InterviewSession {
  type: InterviewType;
  questions: Question[];
  answers: Answer[];
  date: string;
}
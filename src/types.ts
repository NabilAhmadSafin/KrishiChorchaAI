export type Difficulty = "Low" | "Medium" | "High";

export interface Symptom {
  text: string;           // E.g., "Diamond-shaped spots"
  points: Record<string, number>; // e.g., { "Rice Blast": 3 }
}

export interface Question {
  id: string;
  question: string;
  options: Symptom[];
  optionsAreMultipleSelect?: boolean;
}

export interface Disease {
  id: string;
  name: string;          // English + Bengali
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: string;      // English + Bengali e.g., "High | উচ্চ"
}

export interface CropData {
  id: string;
  name: string;          // English + Bengali
  icon: string;          // Emoji or icon name
  diseases: Disease[];
  questions: Question[];
}

export interface QuizPreviewDto {
    id: number
    ownerId: number
    name: string
    description: string
    creationDate: string
}
  


  export type Answer = {
    isCorrect: boolean
    id: number
    content: string
  }
  
  export type Question = {
    id: number
    content: string
    score: number
    answers: Answer[]
  }
  
  export type Quiz = {
    id: number
    name: string
    description: string
    creationDate: string
    questions: Question[]
  }
  
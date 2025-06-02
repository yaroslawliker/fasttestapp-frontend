import { QuizPreviewDto } from '@/app/types'

const localhost:string = 'http://localhost:8080';

export async function fetchLatestQuizzes(count = 10): Promise<QuizPreviewDto[]> {
  const response = await fetch(`${localhost}}/quizzes?count=${count}`)

  if (!response.ok) {
    throw new Error('Failed to fetch quizzes')
  }

  const data: QuizPreviewDto[] = await response.json()
  return data
}

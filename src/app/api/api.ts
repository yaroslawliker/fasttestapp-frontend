import { QuizPreviewDto } from '@/app/types'

const localhost:string = 'http://localhost:8080';


export async function fetchLatestQuizzes(count = 10): Promise<QuizPreviewDto[]> {
  const response = await fetch(`${localhost}/quizzes?count=${count}`)

  if (!response.ok) {
    throw new Error('Failed to fetch quizzes')
  }

  const data: QuizPreviewDto[] = await response.json()
  return data
}

export async function login(username: string, password: string): Promise<string> {
  const response = await fetch(`${localhost}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  const token = await response.text();
  return token;
}



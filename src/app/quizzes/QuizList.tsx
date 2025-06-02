'use client'

import { useEffect, useState } from 'react'
import { QuizPreviewDto } from '@/app/types'
import { fetchLatestQuizzes } from '@/app/api/api'

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizPreviewDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchLatestQuizzes()
      .then(data => setQuizzes(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Завантаження...</p>
  if (error) return <p>Помилка: {error}</p>

  return (
    <ul>
      {quizzes.map(quiz => (
        <li key={quiz.id}>
          <h3>{quiz.name}</h3>
          <p>{quiz.description}</p>
          <small>Створено: {new Date(quiz.creationDate).toLocaleDateString()}</small>
        </li>
      ))}
    </ul>
  )
}

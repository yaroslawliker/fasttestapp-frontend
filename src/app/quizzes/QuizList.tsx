'use client'

import { useEffect, useState } from 'react'
import { QuizPreviewDto } from '@/app/types'
import { fetchLatestQuizzes } from '@/app/api/api'
import { useRouter } from 'next/navigation'


import styles from '@/app/quizzes/QuizList.module.css'
import StartQuizButton from './StartQuizButton'

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizPreviewDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter();


  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    setLoading(true)
    fetchLatestQuizzes()
      .then(data => setQuizzes(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Завантаження...</p>
  if (error) return <p>Помилка: {error} </p>

  return (
    <div className={styles.container}>
      <h2 className={styles.quizzesName}>Quizzes</h2>
      <div className={styles.quizContainer}>
        {quizzes.map((quiz) => (
          <div key={quiz.id} className={styles.quizItem}>
            <div className={styles.quizBlock}>
              <div className={styles.name}>{quiz.name}</div>
              <div className={styles.description}>{quiz.description}</div>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.authorDate}>
                <div className={styles.author}>Автор: {quiz.ownerId}</div>
                <div className={styles.date}>
                  Створено: {new Date(quiz.creationDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <StartQuizButton quizId={quiz.id}/>
          </div>
        ))}
      </div>
    </div>
  )
  
}

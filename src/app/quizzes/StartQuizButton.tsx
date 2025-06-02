'use client'
import { useRouter } from 'next/navigation'
import { startQuiz } from '../api/api'
import styles from '@/app/quizzes/QuizList.module.css'


export default function StartQuizButton({ quizId}: { quizId: number }) {
  const router = useRouter()

  const handleStartQuiz = async () => {
    try {
        
      startQuiz(quizId)

      router.push(`/quizzes/${quizId}/in-progress`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button onClick={handleStartQuiz} className={styles.startButton}>
      Почати тест
    </button>
  )
}

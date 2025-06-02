'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Quiz } from '@/app/types'

export default function QuizPassingForm({ quizId }: { quizId: number }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<{ [questionIndex: number]: Set<number> }>({})
  const router = useRouter()

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8080/quizzes/${quizId}/in-progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setQuiz(data)
    }

    fetchQuiz()
  }, [quizId])

  const handleCheckboxChange = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const updated = new Set(prev[questionIndex] || [])
      if (updated.has(answerIndex)) {
        updated.delete(answerIndex)
      } else {
        updated.add(answerIndex)
      }
      return { ...prev, [questionIndex]: updated }
    })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')

    const payload = quiz?.questions?.map((_, questionIndex) => ({
      questionIndex: questionIndex,
      selectedAnswerIndexes: Array.from(answers[questionIndex] || []),
    }))

    const res = await fetch(`http://localhost:8080/quizzes/${quizId}/finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const resultJSON = await res.json()
      const score = resultJSON.score;

      alert("Ваш рахунок: " + score)

      router.push("/quizzes")

      
    } else {
      alert('Помилка при завершенні тесту')
    }
  }

  if (!quiz) return <p>Завантаження...</p>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{quiz.name}</h1>
      <p className="mb-4 text-gray-700">{quiz.description}</p>

      {quiz.questions?.map((question, questionIndex) => (
        <div key={question.id} className="mb-6 p-4 border rounded-xl bg-gray-100">
          <h2 className="font-semibold mb-2">{question.content}</h2>
          <p className="text-sm text-gray-500 mb-2">Балів: {question.score}</p>
          {question.answers.map((answer, answerIndex) => (
            <label key={answer.id} className="block ml-4">
              <input
                type="checkbox"
                checked={answers[questionIndex]?.has(answerIndex) || false}
                onChange={() => handleCheckboxChange(questionIndex, answerIndex)}
                className="mr-2"
              />
              {answer.content}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Завершити тест
      </button>
    </div>
  )
}

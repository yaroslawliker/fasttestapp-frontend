'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Answer = {
  content: string
  isCorrect: boolean
}

type Question = {
  content: string
  score: number
  answers: Answer[]
}

type QuizForm = {
  name: string
  description: string
  questions: Question[]
}

export default function QuizEditForm() {
  const [quiz, setQuiz] = useState<QuizForm>({
    name: '',
    description: '',
    questions: [
      {
        content: '',
        score: 1,
        answers: [{ content: '', isCorrect: false }],
      },
    ],
  })

    const router = useRouter();
  
  
    useEffect(() => {
      if (localStorage.getItem("token") == null) {
        router.push('/login')
      }
    }, [router])

  const handleQuizChange = (field: keyof QuizForm, value: string) => {
    setQuiz(prev => ({ ...prev, [field]: value }))
  }

  const handleQuestionChange = (index: number, field: keyof Question, value: string | number) => {
    setQuiz(prev => {
      const newQuestions = [...prev.questions]
      newQuestions[index] = { ...newQuestions[index], [field]: value }
      return { ...prev, questions: newQuestions }
    })
  }

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { content: '', score: 1, answers: [{ content: '', isCorrect: false }] }],
    }))
  }

  const removeQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const handleAnswerChange = (
    qIndex: number,
    aIndex: number,
    field: keyof Answer,
    value: string | boolean
  ) => {
    setQuiz(prev => {
      const newQuestions = prev.questions.map((q, i) => {
        if (i !== qIndex) return q
        const newAnswers = q.answers.map((a, j) => {
          if (j !== aIndex) return a
          return { ...a, [field]: value }
        })
        return { ...q, answers: newAnswers }
      })
      return { ...prev, questions: newQuestions }
    })
  }

  const addAnswer = (qIndex: number) => {
    setQuiz(prev => {
      const newQuestions = prev.questions.map((q, i) => {
        if (i !== qIndex) return q
        return { ...q, answers: [...q.answers, { content: '', isCorrect: false }] }
      })
      return { ...prev, questions: newQuestions }
    })
  }

  const removeAnswer = (qIndex: number, aIndex: number) => {
    setQuiz(prev => {
      const newQuestions = prev.questions.map((q, i) => {
        if (i !== qIndex) return q
        return { ...q, answers: q.answers.filter((_, j) => j !== aIndex) }
      })
      return { ...prev, questions: newQuestions }
    })
  }

  const mapToDto = () => ({
    name: quiz.name,
    description: quiz.description,
    questions: quiz.questions.map(q => ({
      text: q.content,
      score: q.score,
      answers: q.answers.map(a => ({
        text: a.content,
        isCorrect: a.isCorrect,
      })),
    })),
  })

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const payload = mapToDto()

    const res = await fetch('http://localhost:8080/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      alert('Тест успішно створено!')
    } else {
      alert('Помилка при створенні тесту')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Створити / Редагувати Тест</h1>

      <label className="block mb-2">
        Назва тесту:
        <input
          type="text"
          value={quiz.name}
          onChange={e => handleQuizChange('name', e.target.value)}
          className="border p-2 w-full"
          required
        />
      </label>

      <label className="block mb-4">
        Опис тесту:
        <textarea
          value={quiz.description}
          onChange={e => handleQuizChange('description', e.target.value)}
          className="border p-2 w-full"
        />
      </label>

      {quiz.questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Питання {qIndex + 1}</h2>
            <button
              onClick={() => removeQuestion(qIndex)}
              className="text-red-600 hover:underline"
              type="button"
            >
              Видалити питання
            </button>
          </div>

          <label className="block mb-2">
            Текст питання:
            <input
              type="text"
              value={question.content}
              onChange={e => handleQuestionChange(qIndex, 'content', e.target.value)}
              className="border p-2 w-full"
              required
            />
          </label>

          <label className="block mb-2">
            Бал за питання:
            <input
              type="number"
              min={0}
              step={0.1}
              value={question.score}
              onChange={e => handleQuestionChange(qIndex, 'score', parseFloat(e.target.value) || 0)}
              className="border p-2 w-24"
              required
            />
          </label>

          <div>
            <h3 className="font-semibold mb-2">Відповіді:</h3>
            {question.answers.map((answer, aIndex) => (
              <div key={aIndex} className="flex items-center mb-2 space-x-2">
                <input
                  type="checkbox"
                  checked={answer.isCorrect}
                  onChange={e => handleAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                />
                <input
                  type="text"
                  value={answer.content}
                  onChange={e => handleAnswerChange(qIndex, aIndex, 'content', e.target.value)}
                  className="border p-1 flex-grow"
                  required
                />
                <button
                  onClick={() => removeAnswer(qIndex, aIndex)}
                  type="button"
                  className="text-red-600 hover:underline"
                >
                  Видалити
                </button>
              </div>
            ))}
            <button
              onClick={() => addAnswer(qIndex)}
              type="button"
              className="mt-2 text-blue-600 hover:underline"
            >
              Додати відповідь
            </button>
          </div>
        </div>
      ))}

      <button onClick={addQuestion} type="button" className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Додати питання
      </button>

      <br />

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Зберегти тест
      </button>
    </div>
  )
}

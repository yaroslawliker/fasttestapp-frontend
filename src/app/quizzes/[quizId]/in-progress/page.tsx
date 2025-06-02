import QuizPassingForm from '@/app/quizzes/[quizId]/in-progress/QuizPassingForm'
export default function Page({ params }: { params: { quizId: string } }) {
  return <QuizPassingForm quizId={parseInt(params.quizId)} />
}
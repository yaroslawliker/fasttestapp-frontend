'use client'
import { signup } from "@/app/api/api";
import { useState } from "react"


export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        try {
          await signup(username, password, isTeacher)
          alert('Signed up successfully!')
        } catch {
          setError('Invalid username or password')
        }
      }

    return <form
      onSubmit={handleSubmit}
    >
        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isTeacher}
          onChange={e => setIsTeacher(e.target.checked)}
        />
        Teacher
      </label>

      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>

}
// app/test-auth/page.tsx
"use client"

import { useState } from "react"
import { signUp } from "@/lib/auth"

export default function TestAuth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSignUp = async () => {
    const { error } = await signUp(email, password)
    setMessage(error ? error.message : "Sign-up successful!")
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test Sign-Up</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>{message}</p>
    </div>
  )
}
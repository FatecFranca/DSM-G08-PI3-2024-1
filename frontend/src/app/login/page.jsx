'use client'
import { signIn, useSession } from "next-auth/react"
import Image from 'next/image'
import { useState } from 'react'
import styles from './styles.module.css'
import { useRouter } from "next/navigation"



function LoginForm() {
  const session = useSession()
  console.log('session', session)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) return

    await signIn('credentials', {
      email, password, asEmployee: false
    })

    // router.push('/')

    // setEmail('')
    // setPassword('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/images/logosaudeON.png"
          alt=""
          width={550}
          height={550}
        />
      </div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div>
          <h2>Bem vindo ao SaudeOn</h2>

          <button type="submit" className={styles.buttonGoogle}>
            <Image
              src="/images/google.png"
              alt="__"
              width={35}
              height={35}
            />
            Acesse com o Google
          </button>

          <button type="submit" className={styles.buttonFuncionario}>
            <Image
              src="/images/saudeON.png"
              alt=""
              width={45}
              height={45}
            />
            Acesse como funcionario
          </button>

          <p className={styles.paragrafo}>___________________________________________________________</p>

          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className={styles.input}

          />

        </div>

        <button type="submit" className={styles.button}>Login</button>
        <div className={styles.NaoPossuiConta}>
          <p>Não possui conta ? <a href="./registro">Registrar</a></p>
        </div>
      </form>
    </div>

  )
}

export default LoginForm
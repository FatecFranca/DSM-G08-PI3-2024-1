'use client'
import { useUserSession } from "@/app/hooks/useUserSession"
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import logoSaudeOm from '../../assets/logoSaudeOn.png'
import styles from './styles.module.css'



function LoginForm() {
  const { login, loginAsEmployee, session, loading } = useUserSession()

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

    await login(email, password)

    return router.replace('/')
  }

  const handleLoginAsEmployee = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) return

    await loginAsEmployee(email, password)

    // return router.replace('/')
  }

  if (session) {
    return redirect('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={logoSaudeOm}
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

          <button
            onClick={handleLoginAsEmployee}
            type="submit" className={styles.buttonFuncionario}>
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
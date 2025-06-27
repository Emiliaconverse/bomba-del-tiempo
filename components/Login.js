import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [emailOrUser, setEmailOrUser] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const isEmail = emailOrUser.includes('@')
    if (isEmail) {
      await supabase.auth.signInWithOtp({ email: emailOrUser })
      alert('Revisá tu correo para iniciar sesión.')
    } else {
      const { data, error } = await supabase
        .from('usuarios')
        .select('email')
        .eq('nombre', emailOrUser)
        .single()
      if (data?.email) {
        await supabase.auth.signInWithOtp({ email: data.email })
        alert('Revisá tu correo para iniciar sesión.')
      } else {
        alert('Usuario no encontrado.')
      }
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email o usuario"
        value={emailOrUser}
        onChange={(e) => setEmailOrUser(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Enviando...' : 'Iniciar sesión'}
      </button>
    </div>
  )
}

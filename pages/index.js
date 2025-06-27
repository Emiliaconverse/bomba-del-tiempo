import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Objetivos from './Objetivos'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [logueado, setLogueado] = useState(false)
  const [modoRegistro, setModoRegistro] = useState(false)

  useEffect(() => {
    const jugadorGuardado = typeof window !== 'undefined' ? localStorage.getItem('jugador') : null
    if (jugadorGuardado) {
      setLogueado(true)
    }
  }, [])

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre', usuario)
      .single()

    if (data) {
      localStorage.setItem('jugador', JSON.stringify(data))
      setLogueado(true)
    } else {
      alert('Usuario no encontrado.')
    }
  }

  const handleRegistro = async () => {
    if (!usuario || !email) return alert('Completá los datos')

    const existe = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre', usuario)
      .single()

    if (existe.data) return alert('Ese nombre ya está registrado')

    const { data, error } = await supabase
      .from('usuarios')
      .insert({ nombre: usuario, email })
      .select()
      .single()

    if (data) {
      localStorage.setItem('jugador', JSON.stringify(data))
      setLogueado(true)
    } else {
      alert('Error al registrar usuario')
    }
  }

  if (logueado) return <Objetivos />

  return (
    <div>
      <h2>{modoRegistro ? 'Registro de nuevo jugador' : 'Ingresá tu nombre de jugador'}</h2>

      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Ej: v11"
      />

      {modoRegistro && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      )}

      <button onClick={modoRegistro ? handleRegistro : handleLogin}>
        {modoRegistro ? 'Registrarme' : 'Ingresar'}
      </button>

      <button onClick={() => setModoRegistro(!modoRegistro)} style={{ backgroundColor: '#888' }}>
        {modoRegistro ? 'Ya tengo usuario' : 'Quiero registrarme'}
      </button>
    </div>
  )
}

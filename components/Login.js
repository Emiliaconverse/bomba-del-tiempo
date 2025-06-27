import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Objetivos from './Objetivos'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [logueado, setLogueado] = useState(false)

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

  import { useEffect } from 'react'

// ...

useEffect(() => {
  const jugadorGuardado = typeof window !== 'undefined' ? localStorage.getItem('jugador') : null
  if (jugadorGuardado) {
    setLogueado(true)
  }
}, [])

if (logueado) {
  return <Objetivos />
}


  return (
    <div>
      <h2>Ingresá tu nombre de jugador</h2>
      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Ej: v11"
      />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Tablero from './Tablero'
import NavBar from './NavBar'

export default function Objetivos() {
  const [objetivos, setObjetivos] = useState([])
  const [jugando, setJugando] = useState(null)

  useEffect(() => {
    // Evitar ejecución en servidor (Vercel)
    if (typeof window === 'undefined') return

    const jugador = JSON.parse(localStorage.getItem('jugador'))
    if (!jugador) return

    const fetchObjetivos = async () => {
      const { data: cumplidos } = await supabase
        .from('cumplimientos')
        .select('objetivo_id, usado')
        .eq('jugador_id', jugador.id)

      const usados = cumplidos?.filter(c => c.usado).map(c => c.objetivo_id) || []

      const { data: todos } = await supabase.from('objetivos').select('*')
      const disponibles = todos.filter(obj => !usados.includes(obj.id))

      setObjetivos(disponibles)
    }

    fetchObjetivos()
  }, [])

  if (jugando) {
    return (
      <div>
        <NavBar />
        <Tablero
          jugadorId={JSON.parse(localStorage.getItem('jugador'))?.id}
          objetivoId={jugando.id}
          chances={jugando.chances}
          onTerminarPartida={() => setJugando(null)}
        />
      </div>
    )
  }

  return (
    <div>
      <NavBar />
      <h3>Elegí un objetivo para jugar</h3>
      <ul>
        {objetivos.map((obj) => (
          <li key={obj.id}>
            {obj.nombre} — {obj.chances} chance(s)
            <button onClick={() => setJugando(obj)}>Jugar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}


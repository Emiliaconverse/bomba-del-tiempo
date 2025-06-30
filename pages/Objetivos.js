import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Tablero from '../components/Tablero'
import NavBar from '../components/NavBar' // ⬅️ El import tiene que ir arriba

export default function Objetivos() {
  const [objetivos, setObjetivos] = useState([])
  const [jugando, setJugando] = useState(null)

  useEffect(() => {
    const jugador = JSON.parse(localStorage.getItem('jugador'))
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

 const jugador = JSON.parse(localStorage.getItem('jugador'))

return (
  <Tablero
    jugadorId={jugador.id}
    objetivoId={jugando.id}
    chances={jugando.chances}
    onTerminarPartida={() => setJugando(null)}
  />
)

  return (
    <div>
      <NavBar /> {/* ⬅️ Ahora sí va acá, dentro del return */}
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

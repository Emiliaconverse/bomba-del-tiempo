import NavBar from './NavBar'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const generarTablero = () => {
  const totalCasilleros = 25
  const bombas = new Set()
  while (bombas.size < 3) {
    bombas.add(Math.floor(Math.random() * totalCasilleros))
  }
  return Array.from({ length: totalCasilleros }, (_, i) => ({
    tieneBomba: bombas.has(i),
    abierto: false,
  }))
}

export default function Tablero({ jugadorId, objetivoId, chances, onTerminarPartida }) {
  const [tablero, setTablero] = useState([])
  const [chancesRestantes, setChancesRestantes] = useState(chances)
  const [bombasEncontradas, setBombasEncontradas] = useState(0)
  const [finalizado, setFinalizado] = useState(false)

  useEffect(() => {
    setTablero(generarTablero())
  }, [])

  const manejarClick = async (index) => {
    if (tablero[index].abierto || finalizado) return

    const nuevoTablero = [...tablero]
    nuevoTablero[index].abierto = true
    setTablero(nuevoTablero)

    const nuevasChances = chancesRestantes - 1
    setChancesRestantes(nuevasChances)

    if (nuevoTablero[index].tieneBomba) {
      alert('¡Encontraste la bomba! Estás un paso más cerca del premio mayor')
      setBombasEncontradas((prev) => prev + 1)

      await supabase.from('bombas_encontradas').insert({
        jugador_id: jugadorId,
        fecha: new Date().toISOString(),
        objetivo_id: objetivoId
      })
    }

    if (nuevasChances === 0) {
      setFinalizado(true)

      await supabase.from('jugadas').insert({
        jugador_id: jugadorId,
        objetivo_id: objetivoId,
        fecha_jugada: new Date().toISOString(),
        bombas_encontradas: bombasEncontradas,
        casilleros_abiertos: chances
      })

      // Marcar objetivo como usado
      await supabase
        .from('cumplimientos')
        .update({ usado: true })
        .match({ jugador_id: jugadorId, objetivo_id: objetivoId })

      onTerminarPartida()
    }
  }

  return (
    <>
      <NavBar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gap: '10px', marginTop: '20px' }}>
        {tablero.map((casillero, i) => (
          <button
            key={i}
            style={{
              height: '60px',
              width: '60px',
              backgroundColor: casillero.abierto
                ? casillero.tieneBomba
                  ? 'red'
                  : 'lightgray'
                : 'black',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px'
            }}
            onClick={() => manejarClick(i)}
          >
            {casillero.abierto ? (casillero.tieneBomba ? '💣' : '') : ''}
          </button>
        ))}
      </div>
    </>
  )
}


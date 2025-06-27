import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const generarTablero = () => {
  const posiciones = Array.from({ length: 25 }, (_, i) => i)
  const bombas = []
  while (bombas.length < 3) {
    const rand = posiciones.splice(Math.floor(Math.random() * posiciones.length), 1)[0]
    bombas.push(rand)
  }
  return bombas
}

export default function Tablero({ objetivo }) {
  const [bombas, setBombas] = useState([])
  const [abiertos, setAbiertos] = useState([])
  const [chancesRestantes, setChancesRestantes] = useState(objetivo.chances)

  useEffect(() => {
    setBombas(generarTablero())
  }, [])

  const handleClick = async (index) => {
    if (abiertos.includes(index) || chancesRestantes <= 0) return

    const jugador = JSON.parse(localStorage.getItem('jugador'))
    const esBomba = bombas.includes(index)
    setAbiertos([...abiertos, index])
    setChancesRestantes(chancesRestantes - 1)

    if (esBomba) {
      alert('¡Encontraste la bomba! Estás un paso más cerca del premio mayor')

      await supabase.from('bombas_encontradas').insert({
        jugador_id: jugador.id,
        fecha: new Date().toISOString(),
        objetivo_id: objetivo.id,
      })
    }

    if (chancesRestantes - 1 === 0) {
      await supabase
        .from('cumplimientos')
        .update({ usado: true })
        .match({ jugador_id: jugador.id, objetivo_id: objetivo.id })
    }
  }

  return (
    <div>
      <h3>Tablero</h3>
      <p>Chances restantes: {chancesRestantes}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gap: '5px' }}>
        {Array.from({ length: 25 }, (_, i) => (
          <button
            key={i}
            style={{ height: '60px', width: '60px', fontSize: '20px' }}
            onClick={() => handleClick(i)}
            disabled={abiertos.includes(i)}
          >
            {abiertos.includes(i) ? (bombas.includes(i) ? '💣' : '✔️') : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

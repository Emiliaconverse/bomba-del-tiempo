import NavBar from '../components/NavBar'
import { useState } from 'react'

export default function Admin() {
  const [file, setFile] = useState(null)

  const handleUpload = () => {
  if (!file) return alert('Subí un archivo primero')

  const reader = new FileReader()

  reader.onload = async (e) => {
    const text = e.target.result
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(val => val.trim())
      const venta = Object.fromEntries(headers.map((h, j) => [h, row[j]]))

      const { jugador, fecha, categoria, cantidad, monto } = venta

      // Buscamos el jugador por nombre
      const { data: jugadorData } = await supabase
        .from('usuarios')
        .select('id')
        .eq('nombre', jugador)
        .single()

      if (!jugadorData) {
        console.warn(`Jugador ${jugador} no encontrado. Salteado.`)
        continue
      }

      await supabase.from('ventas').insert({
        jugador_id: jugadorData.id,
        fecha,
        categoria,
        cantidad: Number(cantidad),
        monto: Number(monto)
      })
    }

    alert('Ventas cargadas con éxito 🎉')
    setFile(null)
  }

  reader.readAsText(file)
}


  return (
    <div>
      <NavBar />
      <h2>Panel de administración</h2>
      <p>Subí el archivo de ventas del día (.xlsx o .csv)</p>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Procesar archivo</button>
    </div>
  )
}

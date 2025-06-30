import { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabaseClient'
import NavBar from '../components/NavBar'

export default function CargarVentas() {
  const [archivo, setArchivo] = useState(null)

  const handleUpload = (e) => {
    setArchivo(e.target.files[0])
  }

  const procesarArchivo = async () => {
    if (!archivo) return alert('Subí un archivo primero')

    Papa.parse(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const datos = results.data

        for (let fila of datos) {
          await supabase.from('objetivos').insert({
            nombre: fila.DESCRIPCION || 'Sin nombre',
            chances: 1,
            modelo: fila.MODELO,
            familia: fila.FAMILIA,
            vendedor: fila['Nombres vendedores (no tocar)'],
            fecha_venta: fila.FECHA
              ? new Date(fila.FECHA).toISOString()
              : new Date().toISOString()
          })
        }

        alert('Archivo procesado correctamente 🚀')
      }
    })
  }

  return (
    <div>
      <NavBar />
      <h2>Subir archivo de ventas (.csv)</h2>
      <input type="file" accept=".csv" onChange={handleUpload} />
      <button onClick={procesarArchivo}>Procesar</button>
    </div>
  )
}

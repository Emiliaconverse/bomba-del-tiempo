import NavBar from '../components/NavBar'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Papa from 'papaparse'

export default function Admin() {
  const [file, setFile] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const handleUpload = async () => {
    if (!file) return alert('Subí un archivo primero')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const ventas = results.data

        // Suponemos que las columnas son: modelo, familia, vendedor, fecha_venta
        const insertVentas = ventas.map((v) => ({
          modelo: v.modelo,
          familia: v.familia,
          vendedor: v.vendedor,
          fecha_venta: new Date(v.fecha_venta),
        }))

        const { error } = await supabase.from('ventas').insert(insertVentas)

        if (error) {
          console.error(error)
          setMensaje('❌ Error al subir las ventas')
        } else {
          setMensaje('✅ Ventas cargadas correctamente')

          // Ahora procesamos objetivos por vendedor
          const ventasPorVendedor = {}
          insertVentas.forEach((venta) => {
            const key = venta.vendedor
            ventasPorVendedor[key] = (ventasPorVendedor[key] || 0) + 1
          })

          const nuevosObjetivos = Object.entries(ventasPorVendedor).map(([vendedor, cantidad]) => ({
            nombre: `Objetivo de ${vendedor}`,
            tipo: 'ventas',
            chances: Math.floor(cantidad / 5), // Ejemplo: 1 chance cada 5 ventas
          })).filter(obj => obj.chances > 0)

          await supabase.from('objetivos').insert(nuevosObjetivos)
          setMensaje((prev) => prev + ' y objetivos generados.')
        }
      },
    })
  }

  return (
    <div style={{ padding: '20px' }}>
      <NavBar />
      <h2>Panel de administración</h2>
      <p>Subí el archivo de ventas (.csv con encabezados: modelo, familia, vendedor, fecha_venta)</p>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Procesar archivo</button>
      {mensaje && <p style={{ marginTop: '10px' }}>{mensaje}</p>}
    </div>
  )
}


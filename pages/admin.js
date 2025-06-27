import { useState } from 'react'

export default function Admin() {
  const [file, setFile] = useState(null)

  const handleUpload = async () => {
    if (!file) return alert('Subí un archivo primero')
    alert('Simulación: archivo procesado correctamente')
    // En versión real se procesará y actualizará Supabase
  }
import NavBar from './NavBar'

  return (
    <div>
      <h2>Panel de administración</h2>
      <p>Subí el archivo de ventas del día (.xlsx o .csv)</p>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Procesar archivo</button>
    </div>
  )
}

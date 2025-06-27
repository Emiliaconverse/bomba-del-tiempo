// components/NavBar.js
import { useRouter } from 'next/router'

export default function NavBar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('jugador')
    router.push('/')
  }

  return (
    <nav style={{ display: 'flex', gap: '10px', padding: '10px' }}>
      <button onClick={() => router.push('/')}>🏠 Home</button>
      <button onClick={() => router.back()}>🔙 Volver</button>
      <button onClick={handleLogout}>🚪 Cerrar sesión</button>
    </nav>
  )
}

import Head from 'next/head'
import Login from '../components/Login'

export default function Home() {
  return (
    <div>
      <Head>
        <title>La bomba del tiempo</title>
      </Head>
      <main>
        <Login />
      </main>
    </div>
  )
}

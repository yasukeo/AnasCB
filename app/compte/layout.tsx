import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

export default async function CompteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/connexion')
  }

  return <>{children}</>
}

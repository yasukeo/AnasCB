import { Header } from '@/components/client/header'
import { Footer } from '@/components/client/footer'
import { getUser } from '@/lib/actions/auth'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

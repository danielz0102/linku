import { Navigation } from "~/shared/layout/navigation"

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-dvh flex-col md:flex-row-reverse">
      <main className="flex-1 p-4">{children}</main>
      <Navigation />
    </div>
  )
}

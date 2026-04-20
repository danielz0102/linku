import type { User } from "~/modules/users/domain/user"

type ProfileCardProps = React.PropsWithChildren<{
  user: User
  Avatar: React.ReactNode
}>

export function ProfileCard({ user, Avatar, children }: ProfileCardProps) {
  const { firstName, lastName, username, bio } = user.data

  return (
    <section className="bg-surface shadow-foreground/10 w-full max-w-2xl space-y-4 rounded-xl p-6 shadow">
      <h1 className="title text-center md:text-left">{`${firstName} ${lastName}`}</h1>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        {Avatar}
        <div className="space-y-1 text-center md:text-left">
          <h2 className="font-bold">@{username}</h2>
          <p className="text-muted max-w-prose">
            {bio ? bio : <span className="italic">No bio available</span>}
          </p>
        </div>
        <div className="mt-4 self-start md:ml-auto md:self-end">{children}</div>
      </div>
    </section>
  )
}

type ActionProps = React.PropsWithChildren<{
  onClick: () => void
}>

ProfileCard.Action = ({ onClick, children }: ActionProps) => {
  return (
    <button className="button rounded-xl" onClick={onClick}>
      {children}
    </button>
  )
}

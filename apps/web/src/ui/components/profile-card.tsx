type ProfileCardProps = React.PropsWithChildren<{
  data: {
    username: string
    firstName: string
    lastName: string
    profilePicUrl: string | null
    bio: string | null
  }
  pictureOverlay?: React.ReactNode
}>

export function ProfileCard({ data, pictureOverlay, children }: ProfileCardProps) {
  const fullname = `${data.firstName} ${data.lastName}`

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-800 p-8 text-center">
      <div className="relative">
        <img
          src={data.profilePicUrl || "/default-pp.jpg"}
          alt=""
          className="size-32 rounded-full object-cover"
        />
        {pictureOverlay}
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{fullname}</h1>
        <p className="text-sm text-neutral-300">@{data.username}</p>
      </div>

      {data.bio ? (
        <p className="max-w-72 overflow-hidden wrap-break-word md:max-w-lg">{data.bio}</p>
      ) : (
        <p className="italic">No bio available.</p>
      )}

      {children}
    </div>
  )
}

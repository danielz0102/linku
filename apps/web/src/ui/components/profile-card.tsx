import type React from "react"

type ProfileCardProps = {
  profilePicUrl: string | null
  firstName: string
  lastName: string
  username: string
  bio: string | null
  pictureOverlay?: React.ReactNode
  children?: React.ReactNode
}

export function ProfileCard({
  profilePicUrl,
  firstName,
  lastName,
  username,
  bio,
  pictureOverlay,
  children,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-800 p-8 text-center">
      <div className="relative">
        <img
          src={profilePicUrl || "/default-pp.jpg"}
          alt=""
          className="size-32 rounded-full object-cover"
        />
        {pictureOverlay}
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {firstName} {lastName}
        </h1>
        <p className="text-sm text-neutral-300">@{username}</p>
      </div>

      {bio ? (
        <p className="max-w-72 overflow-hidden wrap-break-word md:max-w-lg">{bio}</p>
      ) : (
        <p className="italic">No bio available.</p>
      )}

      {children}
    </div>
  )
}

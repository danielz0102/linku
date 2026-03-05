import { SquarePen } from "lucide-react"
import { useRef } from "react"
import { Link } from "react-router"
import { useUser } from "~/auth/context/auth-context"
import { UpdatePictureModal } from "./components/update-picture-modal"

export default function Profile() {
  const { username, firstName, lastName, bio, profilePicUrl } = useUser()
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <main className="flex size-full flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="relative">
        <img
          src={profilePicUrl || "/default-pp.jpg"}
          alt="Profile picture"
          className="size-32 rounded-full object-cover"
        />
        <button
          type="button"
          aria-label="Edit profile picture"
          onClick={() => dialogRef.current?.showModal()}
          className="absolute right-0 bottom-0 cursor-pointer rounded-full border-4 border-blue-950 bg-blue-600 p-2"
        >
          <SquarePen strokeWidth={1.5} size={16} />
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {firstName} {lastName}
        </h1>
        <p className="text-sm text-neutral-300">@{username}</p>
      </div>

      {bio ? (
        <p className="max-w-72 overflow-hidden wrap-break-word md:max-w-lg">
          {bio}
        </p>
      ) : (
        <p className="italic">No bio available.</p>
      )}

      <Link to="/update-profile" className="link flex items-center gap-1">
        <SquarePen strokeWidth={1.5} size={18} />
        Update profile
      </Link>

      <UpdatePictureModal ref={dialogRef} />
    </main>
  )
}

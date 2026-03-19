import { SquarePen } from "lucide-react"
import { useRef } from "react"
import { Link } from "react-router"

import { useUser } from "~/shared/context/auth-context"
import { ProfileCard } from "~/ui/components/profile-card"

import { UpdatePictureModal } from "./components/update-picture-modal"

export default function Profile() {
  const user = useUser()
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <main className="flex size-full flex-col items-center justify-center p-4">
      <ProfileCard
        data={user}
        pictureOverlay={
          <button
            type="button"
            aria-label="Edit profile picture"
            onClick={() => dialogRef.current?.showModal()}
            className="absolute right-0 bottom-0 cursor-pointer rounded-full border-4 border-blue-950 bg-blue-600 p-2"
          >
            <SquarePen strokeWidth={1.5} size={16} />
          </button>
        }
      >
        <Link to="/update-profile" className="flex items-center gap-1 link">
          <SquarePen strokeWidth={1.5} size={18} />
          Update profile
        </Link>
      </ProfileCard>

      <UpdatePictureModal ref={dialogRef} />
    </main>
  )
}

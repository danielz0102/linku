import { Link } from "react-router"

import { ProfileAvatar } from "~/shared/components/profile-avatar"

import type { User } from "../../domain/user"

type UserListProps = {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  return (
    <ul className="bg-surface border-border divide-border max-h-96 overflow-hidden overflow-y-auto rounded-2xl border shadow-sm">
      {users.map((user) => {
        const fullName = `${user.firstName} ${user.lastName}`

        return (
          <li key={user.id}>
            <Link
              to={`/profile/${user.username}`}
              className="flex size-full items-center gap-3 px-4 py-3 hover:bg-blue-100"
            >
              <ProfileAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                avatarUrl={user.profilePictureUrl ?? undefined}
                className="size-16"
              />

              <div className="min-w-0">
                <p className="truncate font-semibold">{fullName}</p>
                <p className="text-muted truncate text-sm">@{user.username}</p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

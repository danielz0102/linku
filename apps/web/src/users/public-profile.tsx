import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { ErrorPage } from "~/app/pages/error-page"
import { ApiError } from "~/shared/api/api-error"
import { LoadingSpinner } from "~/shared/components/loading-spinner"
import { getUserById } from "./services/get-user-by-id"

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    throw new Error("User ID is required to view public profile.")
  }

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
  })

  if (isPending) {
    return (
      <main className="flex size-full items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  if (error) {
    const isNotFound = ApiError.isApiError(error) && error.code === "NOT_FOUND"
    return (
      <ErrorPage
        status={isNotFound ? 404 : 500}
        message={isNotFound ? "User not found." : "Something went wrong."}
      />
    )
  }

  return (
    <main className="flex size-full flex-col items-center justify-center gap-4 p-4 text-center">
      <img
        src={user.profilePicUrl || "/default-pp.jpg"}
        alt=""
        className="size-32 rounded-full object-cover"
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-neutral-300">@{user.username}</p>
      </div>

      {user.bio ? (
        <p className="max-w-72 overflow-hidden wrap-break-word md:max-w-lg">
          {user.bio}
        </p>
      ) : (
        <p className="italic">No bio available.</p>
      )}
    </main>
  )
}

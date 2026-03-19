import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { ApiError } from "~/api/api-error"
import { ErrorPage } from "~/app/pages/error-page"
import { LoadingSpinner } from "~/ui/components/loading-spinner"
import { ProfileCard } from "~/ui/components/profile-card"

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
    <main className="flex size-full flex-col items-center justify-center p-4">
      <ProfileCard data={user} />
    </main>
  )
}

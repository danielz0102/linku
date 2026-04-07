import { ProfileView } from "../ui/profile-view"

export default function ProfilePage() {
  return (
    <main className="flex size-full items-center justify-center">
      <ProfileView
        avatarUrl="https://cataas.com/cat"
        username="john_doe"
        firstName="John"
        lastName="Doe"
        bio="Coffee-fueled builder, cat enthusiast, and always shipping small improvements."
      />
    </main>
  )
}

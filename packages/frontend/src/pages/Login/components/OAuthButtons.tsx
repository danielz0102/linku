import Button from "~/components/ui/Button"
import { Google } from "~/components/icons/Google"
import cn from "~/utils/cn"

export default function OAuthButtons() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Separator className="flex-1" />
        <span className="text-neutral-400">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button type="button" variant="secondary" className="w-full">
        <Google />
        Continue with Google
      </Button>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("border-t border-neutral-600/50", className)}></div>
}

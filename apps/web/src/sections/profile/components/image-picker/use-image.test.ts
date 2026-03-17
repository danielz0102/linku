import { act, renderHook } from "@testing-library/react"

import { useImage } from "./use-image"

test("accepts valid image files and creates preview", () => {
  const { result } = renderHook(() => useImage())
  const file = new File(["abc"], "avatar.png", { type: "image/png" })

  act(() => {
    result.current.updateImage(file)
  })

  expect(result.current.error).toBeNull()
  expect(result.current.preview).toContain("blob:")
})

test("rejects non-image mime type", () => {
  const { result } = renderHook(() => useImage())
  const file = new File(["abc"], "note.txt", { type: "text/plain" })

  act(() => {
    result.current.updateImage(file)
  })

  expect(result.current.preview).toBeNull()
  expect(result.current.error).toBe("Allowed files are: JPEG, PNG, JPG, WEBP")
})

test("rejects files larger than 5MB", () => {
  const { result } = renderHook(() => useImage())
  const file = new File([new Uint8Array(6 * 1024 * 1024)], "avatar.png", {
    type: "image/png",
  })

  act(() => {
    result.current.updateImage(file)
  })

  expect(result.current.preview).toBeNull()
  expect(result.current.error).toBe("Picture file cannot be larger than 5MB")
})

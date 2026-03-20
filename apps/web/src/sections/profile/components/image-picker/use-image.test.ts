import { renderHook } from "vitest-browser-react"

import { useImage } from "./use-image"

test("accepts valid image files and creates preview", async () => {
  const { result, act } = await renderHook(() => useImage())
  const file = new File(["abc"], "avatar.png", { type: "image/png" })

  await act(() => {
    result.current.updateImage(file)
  })

  expect(result.current.error).toBeNull()
  expect(result.current.preview).toContain("blob:")
})

test("rejects non-image mime type", async () => {
  const { result, act } = await renderHook(() => useImage())
  const file = new File(["abc"], "note.txt", { type: "text/plain" })

  await act(() => {
    result.current.updateImage(file)
  })

  expect(result.current.preview).toBeNull()
  expect(result.current.error).toBe("Allowed files are: JPEG, PNG, JPG, WEBP")
})

test("rejects files larger than 5MB", async () => {
  const { result, act } = await renderHook(() => useImage())
  const file = new File([new Uint8Array(6 * 1024 * 1024)], "avatar.png", {
    type: "image/png",
  })

  await act(() => {
    result.current.updateImage(file)
  })

  expect(result.current.preview).toBeNull()
  expect(result.current.error).toBe("Picture file cannot be larger than 5MB")
})

import { useCallback, useState } from "react"

export function useConfirmDialog() {
  const [request, setRequest] = useState(null)

  const confirm = useCallback((options) => new Promise((resolve) => {
    setRequest({
      title: "Are you sure?",
      message: "Please confirm this action.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      tone: "dark",
      ...options,
      resolve,
    })
  }), [])

  const closeConfirm = useCallback((confirmed) => {
    request?.resolve(confirmed)
    setRequest(null)
  }, [request])

  return { confirm, confirmRequest: request, closeConfirm }
}

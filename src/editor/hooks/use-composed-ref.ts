"use client"

import { useCallback, useRef } from "react"

type RefType<T> = React.LegacyRef<T> | undefined

const setRef = <T>(ref: RefType<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && typeof ref === "object" && "current" in ref) {
    ;(ref as { current: T | null }).current = value
  }
}

export const useComposedRef = <T extends HTMLElement>(
  libRef: React.RefObject<T | null>,
  userRef: RefType<T>
) => {
  const prevUserRef = useRef<RefType<T>>(undefined)

  return useCallback(
    (instance: T | null) => {
      ;(libRef as { current: T | null }).current = instance

      if (prevUserRef.current) {
        setRef(prevUserRef.current, null)
      }

      prevUserRef.current = userRef

      if (userRef) {
        setRef(userRef, instance)
      }
    },
    [libRef, userRef]
  )
}

"use client"

import { useEffect, useMemo, useRef } from "react"
import type { AutoUpdateOptions, UseDismissProps, UseFloatingOptions } from "@floating-ui/react"
import {
  autoUpdate,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles
} from "@floating-ui/react"

interface FloatingElementReturn {
  isMounted: boolean
  ref: (node: HTMLElement | null) => void
  style: React.CSSProperties
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>
  update: () => void
}

export function useFloatingElement(
  show: boolean,
  reference: HTMLElement | DOMRect | (() => DOMRect | null) | null,
  zIndex: number,
  options?: Partial<UseFloatingOptions & { dismissOptions?: UseDismissProps }>,
  autoUpdateOptions?: AutoUpdateOptions
): FloatingElementReturn {
  const { dismissOptions, ...floatingOptions } = options || {}
  const cachedRectRef = useRef<DOMRect | null>(null)

  const { refs, context, floatingStyles, update, placement } = useFloating({
    open: show,
    transform: false,
    whileElementsMounted(referenceEl, floatingEl, updateFn) {
      return autoUpdate(referenceEl, floatingEl, updateFn, autoUpdateOptions)
    },
    ...floatingOptions
  })

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: "scale(0.98)" },
    open: { opacity: 1, transform: "scale(1)" },
    close: { opacity: 0, transform: "scale(0.98)" }
  })

  const dismiss = useDismiss(context, dismissOptions)
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  useEffect(() => {
    if (!show && isMounted && cachedRectRef.current) {
      refs.setReference({ getBoundingClientRect: () => cachedRectRef.current! })
      return
    }

    if (!isMounted) {
      cachedRectRef.current = null
      if (!reference) refs.setReference(null)
      return
    }

    if (!reference) {
      refs.setReference(null)
      return
    }

    if (reference instanceof HTMLElement) {
      cachedRectRef.current = reference.getBoundingClientRect()
      refs.setReference(reference)
      return
    }

    const rect = reference instanceof DOMRect ? reference : reference()
    cachedRectRef.current = rect
    refs.setReference({ getBoundingClientRect: () => rect || new DOMRect() })
  }, [reference, refs, show, isMounted])

  const transformOrigin = useMemo(() => {
    const [side, align] = placement.split("-")
    const vertical = side === "bottom" ? "top" : side === "top" ? "bottom" : "center"
    const horizontal = align === "start" ? "left" : align === "end" ? "right" : "center"
    return `${vertical} ${horizontal}`
  }, [placement])

  const combinedStyle = useMemo(
    () => ({ ...floatingStyles, ...styles, zIndex, transformOrigin }),
    [floatingStyles, styles, zIndex, transformOrigin]
  )

  return useMemo(
    () => ({
      isMounted,
      ref: refs.setFloating,
      style: combinedStyle,
      getFloatingProps,
      getReferenceProps,
      update
    }),
    [combinedStyle, isMounted, refs.setFloating, getFloatingProps, getReferenceProps, update]
  )
}

"use client"

import { useEffect, useState } from "react"
import { LiquidMetal } from "@paper-design/shaders-react"

export function LiquidMetalBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 -z-10 bg-[#00042e]" />
  }

  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <div className="absolute inset-0 opacity-30">
      <LiquidMetal
        width="100%"
        height="100%"
        colorBack="#0d0f14"
        colorTint="#00D6B1"
        repetition={4}
        softness={0.45}
        shiftRed={-0.5}
        shiftBlue={-1}
        distortion={0.1}
        contour={1}
        shape="none"
        speed={0.4}
        scale={2.2}
      />
      </div>
    </div>
  )
}

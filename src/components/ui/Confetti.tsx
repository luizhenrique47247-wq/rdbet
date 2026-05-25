import React, { useEffect, useRef } from 'react'

interface ConfettiProps {
  active: boolean
}

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const colors = ['#00ff3c', '#ff3344', '#ffcc00', '#a855f7', '#00e676', '#3b82f6', '#ec4899', '#ffe600']
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight - 20,
      r: Math.random() * 6 + 4,
      d: Math.random() * window.innerHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    }))

    let animationId: number
    const draw = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      let activeParticles = false
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental
        p.y += (Math.cos(p.d) + 3.5 + p.r / 2) * 0.8
        p.x += Math.sin(p.tiltAngle) * 0.5
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 3

        if (p.y < canvas.height) {
          activeParticles = true
        }

        ctx.beginPath()
        ctx.lineWidth = p.r
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2)
        ctx.stroke()
      })

      if (activeParticles) {
        animationId = requestAnimationFrame(draw)
      }
    }

    draw()
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9998]"
    />
  )
}

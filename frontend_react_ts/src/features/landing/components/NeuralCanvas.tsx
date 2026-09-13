import React, { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  phase: number
}

export const NeuralCanvas: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const nodesCount = Math.min(Math.floor(window.innerWidth / 30), 45)
    const nodes: Node[] = []

    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 1 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Move and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.phase += 0.008
        node.x += node.vx + Math.cos(node.phase) * 0.05
        node.y += node.vy + Math.sin(node.phase) * 0.05

        // Boundary wrap
        if (node.x < -20) node.x = canvas.width + 20
        if (node.x > canvas.width + 20) node.x = -20
        if (node.y < -20) node.y = canvas.height + 20
        if (node.y > canvas.height + 20) node.y = -20

        // Gentle mouse interaction
        const dx = node.x - mouse.x
        const dy = node.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120
          node.x += (dx / dist) * force * 0.6
          node.y += (dy / dist) * force * 0.6
        }

        // Draw node
        ctx.beginPath()
        ctx.fillStyle = `rgba(236, 72, 153, ${node.alpha})`
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            const alpha = Math.pow((150 - dist) / 150, 2) * 0.18
            ctx.beginPath()
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`
            ctx.lineWidth = 0.75
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className={className || 'pointer-events-none fixed inset-0 z-0 opacity-40'}
      aria-hidden="true"
    />
  )
}

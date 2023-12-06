import CanvasOption from './js/CanvasOption'
import Particle from './js/Particle'
import Spark from './js/Spark'
import Tail from './js/Tail'
import { hypotenuse, randomNumBetWeen } from './js/utils'

class Canvas extends CanvasOption {
  constructor() {
    super()

    this.tails = []
    this.particles = []
    this.sparks = []
  }

  init() {
    this.canvasWidth = innerWidth
    this.canvasHeight = innerHeight
    this.canvas.width = this.canvasWidth * this.dpr
    this.canvas.height = this.canvasHeight * this.dpr
    this.ctx.scale(this.dpr, this.dpr)

    this.canvas.style.width = this.canvasWidth + 'px'
    this.canvas.style.height = this.canvasHeight + 'px'
  }

  createTail() {
    const x = randomNumBetWeen(this.canvasWidth * 0.2, this.canvasWidth * 0.8)
    const vy = this.canvasHeight * randomNumBetWeen(0.01, 0.015) * -1
    const colorDeg = randomNumBetWeen(0, 360)
    this.tails.push(new Tail(x, vy, colorDeg))
  }

  createParticles(x, y, colorDeg) {
    const PARTICLE_NUM = 400

    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r =
        randomNumBetWeen(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001
      const angle = (Math.PI / 180) * randomNumBetWeen(0, 360)

      const vx = r * Math.cos(angle)
      const vy = r * Math.sin(angle)
      const opacity = randomNumBetWeen(0.6, 0.9)
      const _colorDeg = randomNumBetWeen(-20, 20) + colorDeg
      this.particles.push(new Particle(x, y, vx, vy, opacity, _colorDeg))
    }
  }

  render() {
    let now, delta
    let then = Date.now()

    const frame = () => {
      requestAnimationFrame(frame)
      now = Date.now()
      delta = now - then
      if (delta < this.interval) return
      this.ctx.fillStyle = this.bgColor + '40'
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      this.ctx.fillStyle = `rgba(255, 255, 255, ${
        this.particles.length / 50000
      })`
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      if (Math.random() < 0.03) this.createTail()

      this.tails.forEach((tail, index) => {
        tail.update()
        tail.draw()

        for (let i = 0; i < Math.round(-tail.vy * 0.5); i++) {
          const vx = randomNumBetWeen(-5, 5) * 0.05
          const vy = randomNumBetWeen(-5, 5) * 0.05
          const opacity = Math.min(-tail.vy, 0.5)

          this.sparks.push(
            new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg)
          )
        }

        if (tail.vy > -0.7) {
          this.tails.splice(index, 1)
          this.createParticles(tail.x, tail.y, tail.colorDeg)
        }
      })

      this.particles.forEach((particle, index) => {
        particle.update()
        particle.draw()

        if (Math.random() < 0.1) {
          this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45))
        }

        if (particle.opacity < 0) this.particles.splice(index, 1)
      })

      this.sparks.forEach((spark, index) => {
        spark.update()
        spark.draw()

        if (spark.opacity < 0) this.sparks.splice(index, 1)
      })

      then = now - (delta % this.interval)
    }

    requestAnimationFrame(frame)
  }
}

const canvas = new Canvas()

window.addEventListener('load', () => {
  canvas.init()
  canvas.render()
})

window.addEventListener('resize', () => {
  canvas.init()
})

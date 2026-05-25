class CasinoAudioEngine {
  private ctx: AudioContext | null = null
  private volumeFactor = 1.0

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setVolumeFactor(factor: number) {
    // Ensure factor is between 0 and 1
    this.volumeFactor = Math.max(0, Math.min(1, factor))
  }

  // Quick crisp UI click tick
  playTick() {
    try {
      this.init()
      if (!this.ctx || this.volumeFactor <= 0) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(400, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.06 * this.volumeFactor, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.06)
    } catch (e) {
      console.warn('AudioContext failed:', e)
    }
  }

  // Coin arrived chime sound
  playCoinChime() {
    try {
      this.init()
      if (!this.ctx || this.volumeFactor <= 0) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime) // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, this.ctx.currentTime + 0.08) // E6

      gain.gain.setValueAtTime(0.04 * this.volumeFactor, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.15)
    } catch (e) {
      console.warn('AudioContext failed:', e)
    }
  }

  // Win melody (escalating arpeggio)
  playWinMelody() {
    try {
      this.init()
      if (!this.ctx || this.volumeFactor <= 0) return
      
      const now = this.ctx.currentTime
      const playTone = (freq: number, startTime: number, duration: number) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)
        
        gain.gain.setValueAtTime(0.06 * this.volumeFactor, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.02)
        
        osc.start(startTime)
        osc.stop(startTime + duration)
      }

      // Simple major chord arpeggio: C5 -> E5 -> G5 -> C6
      playTone(523.25, now, 0.1)      // C5
      playTone(659.25, now + 0.08, 0.1) // E5
      playTone(783.99, now + 0.16, 0.1) // G5
      playTone(1046.50, now + 0.24, 0.3) // C6
    } catch (e) {
      console.warn('AudioContext failed:', e)
    }
  }

  // Loss sweep sound
  playLossSweep() {
    try {
      this.init()
      if (!this.ctx || this.volumeFactor <= 0) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.25)

      gain.gain.setValueAtTime(0.04 * this.volumeFactor, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.35)
    } catch (e) {
      console.warn('AudioContext failed:', e)
    }
  }

  // Warning buzz
  playWarning() {
    try {
      this.init()
      if (!this.ctx || this.volumeFactor <= 0) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.type = 'square'
      osc.frequency.setValueAtTime(150, this.ctx.currentTime)
      
      gain.gain.setValueAtTime(0.05 * this.volumeFactor, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.2)
    } catch (e) {
      console.warn('AudioContext failed:', e)
    }
  }
}

export const casinoAudio = new CasinoAudioEngine()

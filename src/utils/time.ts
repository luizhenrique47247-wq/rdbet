export const formatTime = (secs: number): string => {
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  const remainingSecs = secs % 60
  return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`
}

export const formatCooldownTime = (totalSeconds: number): string => {
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

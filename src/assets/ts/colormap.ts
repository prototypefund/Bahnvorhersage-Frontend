function rdylgrColormap(x: number, min = 0, max = 1, max_brightness = 255): string {
  x = (x - min) / (max - min)
  x = Math.max(0, Math.min(x, 1))
  if (x > 0.5) {
    // yellow -> green
    const r = Math.round(Math.sqrt(max_brightness * max_brightness * 2 * (1 - x)))
    return `rgb(${r}, ${max_brightness}, 0)`
  } else {
    // yellow -> red
    const g = Math.round(Math.sqrt(max_brightness * max_brightness * 2 * x))
    return `rgb(${max_brightness}, ${g}, 0)`
  }
}

function rdylgrCSSLinearGradient(from: number, to: number, steps: number): string {
  let gradient = 'linear-gradient('
  for (let i = 0; i < steps; i++) {
    const influenceTo = i / (steps)
    const influenceFrom = 1 - influenceTo
    gradient += `${rdylgrColormap(from * influenceFrom + to * influenceTo, 0.2, 0.8, 200)}`
    gradient += `${influenceTo * 100}%,`
  }
  gradient += `${rdylgrColormap(to, 0.2, 0.8, 200)}`
  gradient += '100%)'
  return gradient
}

export { rdylgrColormap, rdylgrCSSLinearGradient }

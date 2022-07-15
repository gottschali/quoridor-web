export function shuffleArray(arr: Array<any>) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function selectRandomly(arr: Array<any>) {
    return arr[Math.floor(Math.random() * arr.length)];
}

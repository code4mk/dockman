// globals.ts
export const globalState = {
  get backendPort(): string | null {
    return localStorage.getItem('backendPort')
  },
  set backendPort(value: string | null) {
    if (value) {
      localStorage.setItem('backendPort', value)
    } else {
      localStorage.removeItem('backendPort')
    }
  }
}

import type { RandomProvider } from '../../domain/ports'

export class MathRandomProvider implements RandomProvider {
  next(): number {
    return Math.random()
  }
}

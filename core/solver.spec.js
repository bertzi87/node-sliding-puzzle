const Puzzle = require('./puzzle.js')
const Solver = require('./solver.js')

describe('A* Solver', () => {

  it('should solve 3x3 board in 1 step', () => {
    const puzzle = new Puzzle(3, [1, 2, 3, 4, 5, 0, 7, 8, 6])
    const solver = new Solver(puzzle)
    const path = solver.getPath()
    expect(path.toString()).toMatch('D')
  })

  it('should solve 3x3 board in 31 step (shortes)', () => {
    const puzzle = new Puzzle(3, [6, 4, 7, 8, 5, 0, 3, 2, 1])

    const solver = new Solver(puzzle, true)
    const path = solver.getPath()

    expect(path.length).toEqual(31)

    path.forEach((direction) => {
      puzzle.moveEmpty(direction)
    })

    expect(puzzle.board).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0])
  })

  it('should solve 4x4 board', () => {
    const puzzle = new Puzzle(4, [
      10, 7, 5, 2,
      3, 8, 1, 11,
      15, 14, 0, 4,
      6, 9, 13, 12])
    const solver = new Solver(puzzle)
    solver.getPath().forEach((direction) => {
      puzzle.moveEmpty(direction)
    })

    expect(puzzle.board).toEqual(puzzle.getSolvedBoard())
  })
})

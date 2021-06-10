const Puzzle = require('./puzzle.js')

const solved3 = [
  1,2,3,
  4,5,6,
  7,8,0
]

const sum = (array) => {
  return array.reduce((sum, item) => sum + item)
}

describe('Board creation and shuffle', () => {

  for (let size = 3; size <= 10; size++) {

    let solved = [...Array(size * size).keys()]
    solved.push(solved.shift())
    let puzzle = {}

    it(`should create the ${size}x${size} board`, () => {

      puzzle = new Puzzle(size)
      expect(puzzle.board).toEqual(solved)

      const puzzle2 = new Puzzle(`${size}`)
      expect(puzzle2.board).toEqual(solved)
    })

    it(`should shuffle the ${size}x${size} board`, () => {
      const sumOld = sum(puzzle.board)
      puzzle.shuffle()
      const sumNew = sum(puzzle.board)

      expect(puzzle.board.length).toEqual(solved.length)
      expect(sumOld).toEqual(sumNew)
      expect(puzzle.board).not.toEqual(solved)
      expect(puzzle.indexOfEmpty).toEqual(puzzle.board.indexOf(0))
    })
  }
})

describe('Clicks for 3x3', () => {
  const puzzle3 = new Puzzle(3)

  it('should move left', () => {

    puzzle3.clickTo(7)
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      7,0,8
    ])

    puzzle3.clickTo(6)
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      0,7,8
    ])
  })

  it('should move right', () => {

    puzzle3.clickTo(7)
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      7,0,8
    ])

    puzzle3.clickTo(8)
    expect(puzzle3.board).toEqual(solved3)
  })

  it('should move left and right multiple times', () => {
    puzzle3.clickTo(6)
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      0,7,8
    ])
    puzzle3.clickTo(8)
    expect(puzzle3.board).toEqual(solved3)
  })

  it('should move up', () => {

    puzzle3.clickTo(5)
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,0,
      7,8,6
    ])

    puzzle3.clickTo(2)
    expect(puzzle3.board).toEqual([
      1,2,0,
      4,5,3,
      7,8,6
    ])
  })

  it('should move down', () => {

    puzzle3.clickTo(5)
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,0,
      7,8,6
    ])

    puzzle3.clickTo(8)
    expect(puzzle3.board).toEqual(solved3)
  })

  it('should move up and down multiple times', () => {
    puzzle3.clickTo(2)
    expect(puzzle3.board).toEqual([
      1,2,0,
      4,5,3,
      7,8,6
    ])
    puzzle3.clickTo(8)
    expect(puzzle3.board).toEqual(solved3)
  })

  it('shouldn\'t move', () => {
    puzzle3.clickTo(0)
    puzzle3.clickTo(1)
    puzzle3.clickTo(3)
    puzzle3.clickTo(4)
    expect(puzzle3.board).toEqual(solved3)
  })
})

describe('Moves for 3x3', () => {
  const puzzle3 = new Puzzle(3)

  test('move empty left, right', () => {
    puzzle3.moveEmpty('left')
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      7,0,8
    ])
    puzzle3.moveEmpty('left')
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      0,7,8
    ])
    puzzle3.moveEmpty('left')
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      0,7,8
    ])
    puzzle3.moveEmpty('right')
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,6,
      7,0,8
    ])
    puzzle3.moveEmpty('right')
    expect(puzzle3.board).toEqual(solved3)
    puzzle3.moveEmpty('right')
    expect(puzzle3.board).toEqual(solved3)
  })

  test('move empty up, down', () => {
    puzzle3.moveEmpty('up')
    expect(puzzle3.board).toEqual([
      1,2,3,
      4,5,0,
      7,8,6
    ])
    puzzle3.moveEmpty('up')
    expect(puzzle3.board).toEqual([
      1,2,0,
      4,5,3,
      7,8,6
    ])
    puzzle3.moveEmpty('up')
    expect(puzzle3.board).toEqual([
      1,2,0,
      4,5,3,
      7,8,6
    ])
    puzzle3.moveEmpty('down')
    puzzle3.moveEmpty('down')
    puzzle3.moveEmpty('down')
    puzzle3.moveEmpty('down')
    expect(puzzle3.board).toEqual(solved3)
  })

})

describe('Manhattan distance', () => {

  test('manhattan difference changes after moves', () => {

    const puzzle = new Puzzle(3)
    expect(puzzle.manhattanSum()).toEqual(0)

    expect(puzzle.moveEmpty('U')).toEqual(1)
    expect(puzzle.manhattanSum()).toEqual(1)

    expect(puzzle.moveEmpty('U')).toEqual(1)
    expect(puzzle.manhattanSum()).toEqual(2)

    expect(puzzle.moveEmpty('U')).toEqual(0)
    expect(puzzle.manhattanSum()).toEqual(2)

    expect(puzzle.moveEmpty('D')).toEqual(-1)
    expect(puzzle.manhattanSum()).toEqual(1)

    expect(puzzle.moveEmpty('L')).toEqual(1)
    expect(puzzle.manhattanSum()).toEqual(2)
  })
})

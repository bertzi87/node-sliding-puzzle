// export default class Puzzle {
module.exports = class Puzzle {

  constructor(size, board = false) {

    this.size = parseInt(size)
    this.range = this.size * this.size
    this.board = board ? board : this.getSolvedBoard()
    this.indexOfEmpty = this.board.indexOf(0)
  }

//   getSolvedBoard = () => [...Array(this.range).keys()].map(item => item == this.range - 1 ? 0 : item + 1)

  getSolvedBoard = () => {
    const solved = []
    for (let i = 0; i < this.range - 1; i++) {
      solved.push(i + 1)
    }
    solved[this.range - 1] = 0
    return solved
  }

  col = (index) =>  index % this.size
  row = (index) => Math.floor(index / this.size)

//   indexOfEmpty = () => this.board.indexOf(0)

  colOfEmpty = () => this.col(this.indexOfEmpty)
  rowOfEmpty = () => this.row(this.indexOfEmpty)

  colDiff = (index1, index2) => this.col(index1) - this.col(index2)
  rowDiff = (index1, index2) => this.row(index1) - this.row(index2)

  colDiffEmpty = (index) => this.colDiff(this.indexOfEmpty, index)
  rowDiffEmpty = (index) => this.rowDiff(this.indexOfEmpty, index)

  swap(index1, index2) {
    [this.board[index1], this.board[index2]] = [this.board[index2], this.board[index1]]
  }

  swapWithEmpty(index) {
    const nr = this.board[index]
    const oldManhattanDistance = this.manhattanDistance(nr, index)

    this.swap(index, this.indexOfEmpty)
    this.indexOfEmpty = index

    return this.manhattanDistance(nr) - oldManhattanDistance
  }

  moveEmptyLeft() {
    if (this.colOfEmpty() > 0) {
      return this.swapWithEmpty(this.indexOfEmpty - 1)
    }
    return 0
  }

  moveEmptyRight() {
    if (this.colOfEmpty() < this.size - 1) {
      return this.swapWithEmpty(this.indexOfEmpty + 1)
    }
    return 0
  }

  moveEmptyUp() {
    if (this.rowOfEmpty() > 0) {
      return this.swapWithEmpty(this.indexOfEmpty - this.size)
    }
    return 0
  }

  moveEmptyDown() {
    if (this.rowOfEmpty() < this.size - 1) {
      return this.swapWithEmpty(this.indexOfEmpty + this.size)
    }
    return 0
  }

  moveEmpty(direction, reverse = false) {
    switch(direction) {
      case 'L':
      case 'left':
        return (reverse) ? this.moveEmptyRight() : this.moveEmptyLeft()
      case 'R':
      case 'right':
        return (reverse) ? this.moveEmptyLeft() : this.moveEmptyRight()
      case 'U':
      case 'up':
        return (reverse) ? this.moveEmptyDown() : this.moveEmptyUp()
      case 'D':
      case 'down':
        return (reverse) ? this.moveEmptyUp() : this.moveEmptyDown()
    }
  }

  move(direction) {
    return this.moveEmpty(direction, true)
  }

  shuffle() {
    const directions = ['U', 'D', 'L', 'R']
    let moves = 0
    // to avoud slow reactivity use a temporary board
    const copy = new Puzzle(this.size, [...this.board])
    while (moves < this.range * 100) {
      const di = Math.floor(Math.random() * 4)
      if (copy.moveEmpty(directions[di])) {
        moves++
      }
    }
    this.board = [...copy.board]
    this.indexOfEmpty = copy.indexOfEmpty
  }

  moveEmptyMultiple(times, direction) {
    for (let i = 0; i < times; i++) {
      this.moveEmpty(direction)
    }
  }

  isValidMove(index) {
    return (this.rowDiffEmpty(index) == 0 || this.colDiffEmpty(index) == 0)
  }

  clickTo(index) {

    const rowDiff = this.rowDiffEmpty(index)
    const colDiff = this.colDiffEmpty(index)

    const isSameRow = rowDiff == 0
    const isSameCol = colDiff == 0

    if (!isSameRow && !isSameCol) {
      return false
    }

    const diff = rowDiff || colDiff
    this.moveEmptyMultiple(Math.abs(diff),
      (isSameRow) ? (diff > 0 ? 'left' : 'right')
                  : (diff > 0 ? 'up' : 'down')
    )
  }

  toString() {
    let result = ''

    this.board.forEach((item, index) => {
      result += (this.col(index) == 0 ) ? '        ' : ''
      result += (item == 0) ? '  '
              : (item < 10) ? ' ' + item : item
      result += (this.col(index) == this.size - 1 ) ? '\n' : ' '
    })

    return result
  }

  manhattanDistance = (nr, currentIndex = false) => {
    if (nr == 0) {
      return 0
    }
    if (currentIndex === false) {
      currentIndex = this.board.indexOf(nr)
    }
    const solvedIndex = nr - 1
    return Math.abs(this.colDiff(solvedIndex, currentIndex)) + Math.abs(this.rowDiff(solvedIndex, currentIndex))
  }

  manhattanSum = () => this.board.reduce((sum, nr, index) => sum + this.manhattanDistance(nr, index), 0)
}

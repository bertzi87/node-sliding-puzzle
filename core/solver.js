
// const FastPriorityQueue  = require('fastpriorityqueue')
const Heap  = require('qheap')
const Puzzle = require('./puzzle.js')

// export default class Solver {
module.exports = class Solver {

  constructor (puzzle, shortest = false) {
    this.puzzle = puzzle

    this.visited = new Set();

//     this.queue = new FastPriorityQueue(shortest ? this.compareFunctionShortest : this.compareFunction)
    this.queue = new Heap({
      comparBefore: (a, b) => shortest ? this.compareFunctionShortest(a, b) : this.compareFunction(a, b)
    })

  }

  compareFunction(a, b) {
    if (a.manhattan == b.manhattan) {
      return a.level < b.level
    }

    return a.manhattan < b.manhattan
  }

  compareFunctionShortest(a, b) {
    return a.manhattan + a.level < b.manhattan + b.level
  }

  getPath() {
    let node = this.solve()
//     return node.path
    const reverse = []
    while (node.prevNode !== null) {
      reverse.push(node.dir)
      node = node.prevNode
    }
    reverse.reverse()
    return reverse
  }

  solve() {
    const initialNode = {
      board: [...this.puzzle.board],
//       path: [],
      prevNode: null,
      dir: '',
      level: 0,
      manhattan: this.puzzle.manhattanSum(),
    }

    const solvedString = this.puzzle.getSolvedBoard().join('.')

//     this.queue.add(initialNode)
    this.queue.insert(initialNode)
    this.visited.add(initialNode.board.join('.'))

    let steps = 0

//     while (!this.queue.isEmpty()) {
    while (this.queue.length > 0) {

//       const current = this.queue.poll()
      const current = this.queue.remove()

      if (steps % 10000 == 0) {
        console.timeEnd('time')
        console.log('steps:', steps)
        console.log('visited boards:', this.visited.size)
        console.log('current:', current.board)
        console.time('time')
      }

      if (current.board.join('.') == solvedString) {
        return current
      }

      this.expandNode(current)
      steps++
    }
  }

  expandNode (node) {
    const directions = ['U', 'D', 'L', 'R']

    for (let direction of directions) {

      const puzzle = new Puzzle(this.puzzle.size, [...node.board])

      const manhattanDifference = puzzle.moveEmpty(direction)
      if ( manhattanDifference !== 0) {

        const newNode = {
          board: puzzle.board,
//           path: [...node.path, direction],
          prevNode: node,
          dir: direction,
          level: node.level + 1,
          manhattan: node.manhattan + manhattanDifference,
//           manhattan: puzzle.manhattanSum(),
        }

        const boardString = puzzle.board.join('.')
//         if (!this.visited.contains(boardString)) {

        if (!this.visited.has(boardString)) {
          this.visited.add(boardString)
//           this.queue.add(newNode)
          this.queue.insert(newNode)
          this.visitedNr += 1
        }
      }
    }
  }
}


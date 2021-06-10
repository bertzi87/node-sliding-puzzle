const { Puzzle, Solver } = require('./index.js')
const keypress = require('keypress');

const printBoard = () => {
  console.clear()
//   console.log(puzzle.board.join(', '))
  console.log('\n\n')
  console.log(puzzle.toString())
  console.log('\n\n')
}

let puzzle = new Puzzle(process.argv[2] || 4);

puzzle.shuffle()

printBoard()
console.log("Press 's' key to solve or play with arrow keys")

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', async function (ch, key) {

  switch(key.name) {
    case 'left':
    case 'right':
    case 'down':
    case 'up':
      puzzle.move(key.name)
      printBoard()
//       console.log(key.name)
      return
    case 's':
      let solver = new Solver(puzzle)
      const path = solver.getPath()

      for (const dir of path) {
        await new Promise(resolve => setTimeout(resolve, 100)); // sleep(100)
        puzzle.moveEmpty(dir)
        printBoard()
        console.log(path.toString())
      }
  }

  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }

});

process.stdin.setRawMode(true);
process.stdin.resume();

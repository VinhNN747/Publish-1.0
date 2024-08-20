// Select all elements with class "bigBox" and "smallBox"
const bigBoxes = document.querySelectorAll(".bigBox")
const smallBoxes = document.querySelectorAll(".smallBox")

// Select the restart button and the element to display messages
const restartButton = document.getElementById('restartBtn')
const thongbao = document.getElementById("thongbao")

// Set the initial player to 'X' and update the display message
var currentPlayer = 'X'
thongbao.textContent = `${currentPlayer}'s turn!`

// Variables to control the game flow
var validMoveCheck = 1 // Used to track if the next move is valid
var lastSelectedSmallBox// Stores the last selected small box
let running = false // Indicates if the game is running
let smallWon = Array(9) // Tracks which small grids have been won
smallWon.fill(false) // Initialize all as not won

// Winning conditions for a grid
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// Initialize small grids and big grid options
let smallOption = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
]

let bigOption = ['', '', '', '', '', '', '', '', '']

function autoPlayer() { 
    selectedBoxToPlay(0,0)
    selectedBoxToPlay(0,1)
    selectedBoxToPlay(1,0)
    selectedBoxToPlay(0,4)
    selectedBoxToPlay(4,0)
    selectedBoxToPlay(0,7)
    selectedBoxToPlay(7,4)
    selectedBoxToPlay(4,3)
    selectedBoxToPlay(3,4)
    selectedBoxToPlay(4,5)
    selectedBoxToPlay(5,4)
    selectedBoxToPlay(4,4)
    selectedBoxToPlay(4,8)
    selectedBoxToPlay(8,6)
    selectedBoxToPlay(6,8)
    selectedBoxToPlay(8,7)
    selectedBoxToPlay(7,8)
    selectedBoxToPlay(8,8)
}

function selectedBoxToPlay(big, small) {
    boxClicked(document.getElementById(`${big}`).querySelectorAll(".smallBox")[small])
}

// Resets the color of all boxes to the default color
function resetColor() {
    // bigBoxes.forEach(bigBox => bigBox.style.backgroundColor = '#3BB2E2')
    bigBoxes.forEach(bigBox => bigBox.removeAttribute("style"))
    smallBoxes.forEach(smallBox => () => {
        if (smallBox.style.backgroundColor != '#2A93C1' ) {
            smallBox.style.backgroundColor = '#3BB2E2'
        }
    })
}

// Clears the text content of all small boxes
function resetText() {
    smallBoxes.forEach(smallBox => smallBox.textContent = '')
}

// Start the game by adding event listeners to the small boxes and restart button
gameStart()

function gameStart() {
    running = true // Set the game to running state
    smallBoxes.forEach(smallBox => smallBox.addEventListener('click', () => boxClicked(smallBox)))
    // autoPlayer()
    
    restartButton.addEventListener('click', restart)
}

// Switch the current player between 'X' and 'O'
function changePlayer() {
    currentPlayer = (currentPlayer == 'X') ? 'O' : 'X'
}

// Handles the event when a small box is clicked
function boxClicked(smallBox) {
    
    const smallBoxIndex = smallBox.getAttribute("smallId") // Get the selected small box index
    const bigBoxIndex = smallBox.parentElement.id // Get the big box in which the small box was played
    
    // Validate the move
    if (smallOption[bigBoxIndex][smallBoxIndex] != '' || bigBoxIndex != lastSelectedSmallBox && validMoveCheck == 0 || running == 0) {
        return;
        
    }
    
    var clickSound = document.getElementById("clickSound")
    clickSound.play()
    clickSound.currentTime = 0
    
    lastSelectedSmallBox = smallBoxIndex // Update the last selected small box
    validMoveCheck = 0 // Reset the validMoveCheck variable

    // Update the board and check for winners
    updateBoard(smallBox, bigBoxIndex, smallBoxIndex)
    checkWinnerSmall(bigBoxIndex, smallWon, bigOption)
    checkWinnerBig(bigBoxIndex)

    // Check if there is any small box available to be selected
    if (!smallOption[smallBoxIndex].includes('')) {
        lastSelectedSmallBox = undefined
        validMoveCheck = 1
        resetColor()
    }
}

// Update the board with the current player's move
function updateBoard(smallBox, bigBoxIndex, smallBoxIndex) {
    smallBox.textContent = currentPlayer // Display the current player's move
    smallOption[bigBoxIndex][smallBoxIndex] = currentPlayer // Update the small grid options

    console.clear()
    console.log(smallBox)
    console.log(smallOption) // Log the current state of smallOption

    // Highlight the next big grid to be played in
    resetColor()
    nextPlayingBox(smallBoxIndex)
}

function nextPlayingBox(smallBoxIndex) {
    bigBoxes[smallBoxIndex].style.backgroundColor = '#1d7a9f'
    document.querySelectorAll('.smallBox').forEach(smallBox => {
        smallBox.style.pointerEvents = "none";
    });
    document.getElementById(smallBoxIndex).querySelectorAll('.smallBox').forEach(smallBox => { 
        if(smallBox.textContent == "") {
        smallBox.style.pointerEvents = "auto"
        }
    });
}

// Check if a player has won in the small grid
function checkWinnerSmall(bigBoxIndex, smallWon, bigOption) { 
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i]
        let smallBoxA = smallOption[bigBoxIndex][condition[0]]
        let smallBoxB = smallOption[bigBoxIndex][condition[1]]
        let smallBoxC = smallOption[bigBoxIndex][condition[2]]
        
        // Continue if any of the small boxes in the win condition are empty
        if (smallBoxA == '' || smallBoxB == '' || smallBoxC == '') {
            continue
        }

        // Check if all small boxes in the win condition have the same player's mark
        if (smallBoxA == smallBoxB && smallBoxB == smallBoxC && smallWon[bigBoxIndex] == false) {
            smallWon[bigBoxIndex] = true // Mark the small grid as won
            bigOption[bigBoxIndex] = currentPlayer // Update the big grid option

            var smallWinSound = document.getElementById("smallWinSound")
            smallWinSound.play()
            smallWinSound.currentTime = 0

            // Apply color based on which player won
            document.getElementById(bigBoxIndex).querySelectorAll('.smallBox').forEach(smallBox => {
                const smallBoxId = parseInt(smallBox.getAttribute('smallId')) // Get the smallId and convert to integer
                if (smallBoxId % 2 === 0 && currentPlayer == "X") { // Check if the smallId is even
                    smallBox.style.backgroundColor = '#2A93C1' // Apply the color
                } else if (smallBoxId != 4 && currentPlayer == "O") {
                    smallBox.style.backgroundColor = '#2A93C1'
                }
            })
            break
        }
    }
    console.log(smallWon) // Log the smallWon state
    console.log(bigOption) // Log the bigOption state
}

// Check if a player has won in the big grid
function checkWinnerBig() {
    let bigWon = false // Flag to check if the game is won

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i]
        let bigBoxA = bigOption[condition[0]]
        let bigBoxB = bigOption[condition[1]]
        let bigBoxC = bigOption[condition[2]]
        
        // Continue if any of the big boxes in the win condition are empty
        if (bigBoxA == '' || bigBoxB == '' || bigBoxC == '') {
            continue;
        }

        // Check if all big boxes in the win condition have the same player's mark
        if (bigBoxA == bigBoxB && bigBoxB == bigBoxC) {
            bigWon = true // Mark the big grid as won
            break
        }
    }

    // If the game is won or drawn, stop the game and display the message   
    if (bigWon) {
        var bigWinSound = document.getElementById("bigWinSound")
        bigWinSound.play()
        bigWinSound.currentTime = 0
        console.log(`${currentPlayer} wins!`)
        thongbao.textContent = `${currentPlayer} wins!`
        resetColor()
        running = 0
    } else if (!bigOption.includes('')) {
        thongbao.textContent = "DRAW!"
        resetColor()
        running = 0
    }
    else {
        changePlayer()
        thongbao.textContent = `${currentPlayer}'s turn!` // Update the display message
    }
    console.log(bigWon) // Log the bigWon state
}

// Restart the game and reset all the states
function restart() {    
    var restartButtonSound = document.getElementById("restartButtonSound")
    restartButtonSound.play()
    restartButtonSound.currentTime = 0
    smallWon.fill(false) // Reset the small grids
    smallOption = [
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
    ]
    bigOption = ['', '', '', '', '', '', '', '', ''] // Reset the big grid
    currentPlayer = 'X' // Reset the current player to 'X'
    thongbao.textContent = `${currentPlayer}'s turn!` // Update the display message
    lastSelectedSmallBox = undefined // Reset the lastSelectedSmallBox variable
    validMoveCheck = 1 // Reset the check variable
    resetText() // Clear all the text on the board
    resetColor() // Reset the colors of the boxes
    console.clear()
    running = true // Restart the game
    smallBoxes.forEach(smallBox => smallBox.removeAttribute('style'));
    // autoPlayer()
}
import React,{useState} from 'react';
import "./canvas.css"
const Board = () => {
    const [showBorder, setShowBorder] = useState(false);

    const toggleBorder = () => {
        setShowBorder(!showBorder);
      };
    function initiate() {
        // null -> null
        // populate the board with whatever the user inputted
        var startingBoard = [[]]
        console.log("hah")
        var j = 0
        for (var i = 1; i <= 81; i++){
            const val = document.getElementById(String(i)).value
            if (val == ""){
                startingBoard[j].push(null)
            }
            else { 
                startingBoard[j].push(Number(val))
            }
            if (i % 9 == 0 && i < 81){
                startingBoard.push([])
                j++
            }
        }
        console.log(startingBoard)
        
        const inputValid = validBoard(startingBoard)
        if (!inputValid){
            inputIsInvalid()
        }
        else{
            const answer = solve(startingBoard)
            updateBoard(answer, inputValid)
        }

        toggleBorder();

    }
    
    function solve(board) {
        // THIS FUNCTION WORKS.
        // Board -> Board
        // solves the given sudoku board
        // ASSUME the given sudoku board is valid
        if (solved(board)) {
            return board
        }
        else {
            const possibilities = nextBoards(board)
            const validBoards = keepOnlyValid(possibilities)
            return searchForSolution(validBoards)
        }
    }
    
    
    
    function searchForSolution(validBoards){
        // List[Board] -> Board or false
        // finds a valid solution to the sudoku problem
        if (validBoards.length < 1){
            return false
        }
        else {
            // backtracking search for solution
            var first = validBoards.shift()
            const tryPath = solve(first)
            if (tryPath != false){
                return tryPath
            }
            else{
                return searchForSolution(validBoards)
            }
        }
    }
    
    
    function solved(board){
        // THIS FUNCTION WORKS.
        // Board -> Boolean
        // checks to see if the given puzzle is solved
        for (var i = 0; i < 9; i++){
            for (var j = 0; j < 9; j++){
                if (board[i][j] == null){
                    return false
                }
            }
        }
        return true
    }
    
    
    function nextBoards(board){ 
        // THIS FUNCTION WORKS.
        // Board -> List[Board]
        // finds the first emply square and generates 9 different boards filling in that square with numbers 1...9
        var res = []
        const firstEmpty = findEmptySquare(board)
        if (firstEmpty != undefined){
            const y = firstEmpty[0]
            const x = firstEmpty[1]
            for (var i = 1; i <= 9; i++){
                var newBoard = [...board]
                var row = [...newBoard[y]]
                row[x] = i
                newBoard[y] = row
                res.push(newBoard)
            }
        }
        return res
    }
    
    function findEmptySquare(board){
        // THIS FUNCTION WORKS.
        // Board -> [Int, Int] 
        // (get the i j coordinates for the first empty square)
        for (var i = 0; i < 9; i++){
            for (var j = 0; j < 9; j++){
                if (board[i][j] == null) {
                    return [i, j]
                }
            }
        }
    }
    
    function keepOnlyValid(possibilities){
        // THIS FUNCTION WORKS.
        // List[Board] -> List[Board]
        // filters out all of the invalid boards from the list
        var res = []
        for (var i = 0; i < possibilities.length; i++){
            if (validBoard(possibilities[i])){
                res.push(possibilities[i])
            }
        }
        return res
    }
    
    
    function validBoard(board){
        // THIS FUNCTION WORKS.
        // Board -> Boolean
        // checks to see if given board is valid
        return rowsGood(board) && columnsGood(board) && boxesGood(board)
    }
    
    function rowsGood(board){
        // THIS FUNCTION WORKS.
        // Board -> Boolean
        // makes sure there are no repeating numbers for each row
        for (var i = 0; i < 9; i++){
            var cur = []
            for (var j = 0; j < 9; j++){
                if (cur.includes(board[i][j])){
                    return false
                }
                else if (board[i][j] != null){
                    cur.push(board[i][j])
                }
            }
        }
        return true
    }
    
    function columnsGood(board){
        // THIS FUNCTION WORKS.
        // Board -> Boolean
        // makes sure there are no repeating numbers for each column
        for (var i = 0; i < 9; i++){
            var cur = []
            for (var j = 0; j < 9; j++){
                if (cur.includes(board[j][i])){
                    return false
                }
                else if (board[j][i] != null){
                    cur.push(board[j][i])
                }
            }
        }
        return true
    }
    
    
    function boxesGood(board){
        // transform this everywhere to update res
        const boxCoordinates = [[0, 0], [0, 1], [0, 2],
                                [1, 0], [1, 1], [1, 2],
                                [2, 0], [2, 1], [2, 2]]
        // THIS FUNCTION WORKS.
        // Board -> Boolean
        // makes sure there are no repeating numbers for each box
        for (var y = 0; y < 9; y += 3){
            for (var x = 0; x < 9; x += 3){
                // each traversal should examine each box
                var cur = []
                for (var i = 0; i < 9; i++){
                    var coordinates = [...boxCoordinates[i]]
                    coordinates[0] += y
                    coordinates[1] += x
                    if (cur.includes(board[coordinates[0]][coordinates[1]])){
                        return false
                    }
                    else if (board[coordinates[0]][coordinates[1]] != null){
                        cur.push(board[coordinates[0]][coordinates[1]])
                    }
                }
            }
        }
        return true
    }

    function updateBoard(board) {
        // THIS FUNCTION WORKS.
        // Board -> null
        // update the DOM with the answer
        if (board == false){
            for (let i = 1; i <= 9; i++){
                document.getElementById("row " + String(i)).innerHTML = "NO SOLUTION EXISTS TO THE GIVEN BOARD"
            }
        }
        else{
            for (var i = 1; i <= 9; i++){
                var row = ""
                for (var j = 0; j < 9; j++){
                    if (row == ""){
                        row = row + String(board[i - 1][j])
                    }
                    else {
                        row = row + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + String(board[i - 1][j])
                    }
                }
                document.getElementById("row " + String(i)).innerHTML = row
            }
        }
    }
    
    function inputIsInvalid(){
        // starting board is invalid or puzzle is insolvable
        for (let i = 1; i <= 9; i++){
            document.getElementById("row " + String(i)).innerHTML = "THE GIVEN BOARD IS INVALID"
        }
    }




  return (
    <div>
      <h2>Sudoku Solver</h2>
      <center>
        <div id='initialBoard'>
            <input id = "1" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "2" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "3" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "4" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "5" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "6" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "7" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "8" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "9" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "10" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "11" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "12" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "13" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "14" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "15" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "16" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "17" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "18" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "19" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "20" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "21" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "22" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "23" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "24" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "25" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "26" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "27" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "28" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "29" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "30" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "31" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "32" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "33" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "34" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "35" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "36" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "37" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "38" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "39" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "40" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "41" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "42" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "43" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "44" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "45" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "46" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "47" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "48" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "49" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "50" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "51" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "52" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "53" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "54" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "55" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "56" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "57" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "58" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "59" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "60" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "61" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "62" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "63" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "64" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "65" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "66" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "67" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "68" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "69" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "70" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "71" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "72" type="number" maxlength="1" max = "9" min = "1" />
            <br />
            <input id = "73" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "74" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "75" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "76" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "77" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "78" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "79" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "80" type="number" maxlength="1" max = "9" min = "1" />
            <input id = "81" type="number" maxlength="1" max = "9" min = "1" />
            <br />
        </div>
      </center>

      <div style = {{paddingTop:20}}></div>

        <button onClick={initiate} className="customButton">SOLVE</button>
    
    <div id={showBorder? 'answerBoard':'noBoard' }>
        <p id = "row 1"></p>
        <p id = "row 2"></p>      
        <p id = "row 3"></p>
        <p id = "row 4"></p>  
        <p id = "row 5"></p>
        <p id = "row 6"></p>  
        <p id = "row 7"></p>
        <p id = "row 8"></p>  
        <p id = "row 9"></p>       
    </div>
    {/* <script>
        // initially populating the answer output area
        const placeHolder = " ? "
        for (var i = 1; i <= 9; i++){
            document.getElementById("row " + String(i)).innerHTML = placeHolder +  "\xa0\xa0\xa0\xa0\xa0\xa0" + placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" + placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" + placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" + placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" + placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" +  placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" +  placeHolder + "\xa0\xa0\xa0\xa0\xa0\xa0" + placeHolder
        }
    </script>  */}
    </div>
  );
};

export default Board;
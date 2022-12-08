# chess-i
## API:
- **/newGame**
    dice al motore di iniziare un nuovo game 
    ritorno: {status: "ok"}
- **/move**
    il motore esegue la mossa ottimale e la ritorna
    ritorno: {move: "a1b2"}
- **/move?move=a1b2**
    il motore aggiunge la mossa dell'avversario a1b1 alla cronologia, esegue la mossa ottimale e la ritorna
    ritorno: {move: "a1b2"}
- **/play?FEN=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1**
    il motore ritorna la mossa ottimale dato lo stato della board
    ritorno: {move: "a1b2"}
const round = document.getElementById('round');
const score = document.getElementById('score');
const simonButtons = document.getElementsByClassName('key');
const startButton = document.getElementById('startButton');
const sendButton = document.getElementById('sendScore');
const table = document.getElementById('dataTable');

class Simon {
    
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.keyCodes;
        this.display = {
            startButton,
            round,
            score,
        }
        this.score = 0;
    }
    

    // Inicia el Simon
    init() {
        this.display.startButton.onclick = () => this.startGame();
        sendButton.style.display = 'none';
        table.style.display = 'none';
        this.display.round.textContent = `Rondas ${this.round}`;
        this.display.score.textContent = `Puntaje ${this.score}`;
    }

    // Comienza el juego
    startGame() {
        this.display.startButton.disabled = true; 
        this.score = 0;
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
        sendButton.style.display = 'none';
        table.style.display = 'none';
    }

    // Actualiza la ronda y el tablero
    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Rondas ${this.round}`;
        this.display.score.textContent = `Puntaje ${this.score}`;
    }

    // Crea el array aleatorio de botones
    createSequence() {
        return Array.from({length: this.totalRounds}, () =>  this.getRandomKey());
    }

    // Devuelve un número al azar entre 0 y 26
    getRandomKey() {
        return Math.floor(Math.random() * 26);
    }

    // Ejecuta una función cuando se hace click en un botón
    buttonClick(value) {
        if(!this.blockedButtons){
            this.validateChosenKey(value);
            const button = this.buttons[value];
            this.toggleButtonStyle(button)
                setTimeout( () => this.toggleButtonStyle(button), this.speed / 2);
        }
    }

    //Convertir de KeyCode al index del Array buttons
    KeyCodeToIndex(value){
        if(!this.blockedButtons){
            let index;
            this.buttons.forEach((element, i) => {
                if(element.dataset.key == value){
                    index = i;
                }
            });
            const button = this.buttons[index];
            this.toggleButtonStyle(button)
                setTimeout( () => this.toggleButtonStyle(button), this.speed / 2);
            this.validateChosenKey(index);
        }
    }

    // Valida si el boton que toca el usuario corresponde al valor de la secuencia
    validateChosenKey(value) {
        const button = this.buttons[value];
        if(this.sequence[this.userPosition] === value) {
            this.toggleButtonCorrect(button)
            setTimeout( () => this.toggleButtonCorrect(button), this.speed / 2);
            if(this.round === this.userPosition) {
                this.score += 100;
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.toggleButtonIncorrect(button)
            setTimeout( () => this.toggleButtonIncorrect(button), this.speed / 2);
            this.gameLost();
        }
    }

    // Verifica que no haya acabado el juego
    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        };
    }

    // Muestra la secuencia de botones que va a tener que tocar el usuario
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    // Pinta los botones para cuando se está mostrando la secuencia
    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

    //Pintar los botones cuando son el color Incorrecto
    toggleButtonIncorrect(button){
        button.classList.toggle('fail');
    }

    //Pintar los botones cuando son el color Incorrecto
    toggleButtonCorrect(button){
        button.classList.toggle('success');
    }

    // Actualiza el simon cuando el jugador pierde
    gameLost() {;
        this.display.round.textContent = `Perdiste pero alcanzaste la ronda ${this.round}`;
        sendButton.style.display = 'inline';
        this.blockedButtons = true;
    }

    // Actualiza el Simon cuando el jugador gana
    gameWon() {
        sendButton.style.display = 'inline';
        this.blockedButtons = true;
        this.score = this.score*2;
        this.updateRound('10');
    }

    //Envía puntaje al servidor
    sendScore(){
        this.display.startButton.disabled = false;
        var name = document.getElementById('name').value;

        var datos = new FormData();

        datos.append('name', name);
        datos.append('score', this.score);
        datos.append('level', this.round);
        fetch('sendscore.php', {
            method: 'POST',
            body: datos
        })
            .then(res => res.json())
            .then( data => {
            console.log(data)
        } )

        alert(`Nombre ${name} Rondas: ${this.round} Puntaje:  ${this.score}`);
        sendButton.style.display = 'none';
        //table.style.display = 'inline';
        this.scores();
    }
    scores(){
        table.style.display = 'inline';
        fetch('scores.php').then(function(response){
            response.json().then(function(data) {
                var test = data;
                console.log(test);
                for (let index = 0; index < test.length; index++) {
                    const row = test[index];
                    const arrElm = document.querySelectorAll('.row_'+index);
                    arrElm[0].textContent = row.id;
                    arrElm[1].textContent = row.name;
                    arrElm[2].textContent = row.level;
                    arrElm[3].textContent = row.score;
                }
            });
        }).catch(function(error) {
            console.log('Fetch Error:', error);
        });
        
    }
}

const simon = new Simon(simonButtons, startButton, round);
simon.init();

window.addEventListener('keyup', e =>{
    simon.KeyCodeToIndex(e.keyCode);
});

function sendScore(){
    simon.sendScore();
}

function scores(){
    simon.scores();
}
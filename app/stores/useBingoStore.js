import { defineStore } from 'pinia';



function createBingoFromSettings(
    id,
    name,
    type,
    maxNumber,
    minNumber = 1
) {
    return {
        id,
        drawnNumbers: [],
        isFinished: false,
        settings: {
            name: name,
            type: type,
            minNumber: minNumber,
            maxNumber: maxNumber,
        }
    }
}


export const useBingoStore = defineStore('bingo', {
    state: () => ({
        bingos: {
            /*
                [id]: {
                    drawnNumbers: [],
                    isFinished: ...,
                    settings: { 
                        name: ...,
                        type: ...,
                        minNumber: ...
                        maxNumber: ...,
                    },
                }
            */
            1: createBingoFromSettings(1, "Test", "Carton plein", 90)
        },
        currentBingoId: 1,
        lastId: null,
    }),
    getters: {
        bingo() {
            if (!this.bingos[this.currentBingoId])
                throw new Error(`Bingo ${id} not found`)

            return this.bingos[this.currentBingoId];
        },
        nextId() {
            if (this.lastId == null) {
                const keys = Object.keys(this.bingos).map(Number);
                this.lastId = keys.length ? Math.max(...keys) + 1 : 1;
            }
            return this.lastId;
        },
        drawnNumbers() {
            return this.bingo.drawnNumbers;
        },
        balls() {
            const { minNumber, maxNumber } = this.bingo.settings;
            return Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber);
        },
        remainingNumbers() {
            const all = this.balls;
            return all.filter(n => !this.drawnNumbers.includes(n))
        },
        isFinished() {
            return this.bingo.isFinished;
        }
    },
    actions: {
        createBingo(bingoSettings) {
            const id = this.nextId;
            this.bingos[id] = createBingoFromSettings(
                id,
                bingoSettings.name,
                bingoSettings.type,
                bingoSettings.ballsNumber
            );
            this.lastId++;
        },
        changeCurrentBingo(id) {
            if (!Object.keys(this.bingos).includes(String(id)))
                throw new Error(`${id} not found in registered bingos`)
            this.currentBingoId = id;
        },
        canDraw(number) {
            if (!this.bingo)
                return false;
            if (this.bingo.isFinished)
                return false;
            return this.remainingNumbers.includes(number);

        },
        drawNumber(number) {
            if (!this.canDraw) {
                throw new Error("Number already drawn");
            }
            this.drawnNumbers.push(number);
        },
        isDrawn(number) {
            return this.drawnNumbers.includes(number);
        },
        cancelDraw(number) {
            if (!this.bingo.drawnNumbers.includes(number))
                throw new Error("The number was not drawn");

            const index = this.bingo.drawnNumbers.indexOf(number);
            if (index !== -1) {
                this.bingo.drawnNumbers.splice(index, 1);
            }
        },
        toggleFinishCurrent() {
            this.bingo.finished = !this.bingo.finished;
        }
    }
});
const PALETTE = [232, 233, 234, 52, 52, 52, 1, 88, 124, 130, 130, 166, 166, 166, 166, 166, 166, 166, 166, 172, 172, 172, 172, 172, 172, 142, 142, 142, 142, 142, 142, 142, 143, 185, 187, 230, 231];

const HEIGHT = process.stdout.rows;
const WIDTH = process.stdout.columns;

const SCREEN = new Array(HEIGHT);
for (let height = 0; height < SCREEN.length; height++) {
    SCREEN[height] = new Array(WIDTH);
    for (let width = 0; width < SCREEN[height].length; width++)
        SCREEN[height][width] = 0;
}

function draw() {
    for (let height = 1; height < SCREEN.length; height++) {
        for (let width = 0; width < SCREEN[height].length; width++) {
            const n = Math.round(Math.random() * 2);
            const w = width - n + 1;
            SCREEN[height][w] = SCREEN[height - 1][width] + (n >>> 1);
        }
    }

    for (let i = 0; i < SCREEN.length; i++) {
        for (let j = 0; j < SCREEN[i].length; j++) {
            const color = PALETTE[SCREEN[i][j]] || 0;
            process.stdout.write('\x1b[' + (HEIGHT - i) + ';' + j + 'H');
            process.stdout.write('\x1b[48;5;' + color + 'm' + ' ');
        }
    }
}

class Fire {

    constructor(interval = 100) {
        this._interval = interval;
        this._id = null;
    }

    start() {
        this._id = setInterval(draw, this._interval);
        return this;
    }

    stop() {
        if (this._id) {
            clearInterval(this._id);
            this._id = null;
        }
        return this;
    }

    inc(n = 1) {
        for (let width = 0; width < SCREEN[0].length; width++) {
            if (SCREEN[0][width] < n) SCREEN[0][width] = 0;
            else SCREEN[0][width] -= n;
        }
        return this;
    }

    dec(n = 1) {
        for (let width = 0; width < SCREEN[0].length; width++) {
            SCREEN[0][width] += n;
            if (SCREEN[0][width] >= PALETTE.length) SCREEN[0][width] = PALETTE.length - 1;
        }
        return this;
    }
}

module.exports = Fire;
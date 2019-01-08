// Yaroslav Gaponov 

const PALETTE = [231, 230, 187, 185, 143, 142, 172, 166, 130, 124, 88, 1, 52, 234, 233, 232];

const HEIGHT = process.stdout.rows;
const WIDTH = process.stdout.columns;

const START = '\x1b[s\x1b[2J';
const STOP = '\x1b[2J\x1b[u';
const GOTOXY = (x, y) => `\x1b[${HEIGHT - x + 1};${y + 1}H`;
const SETCOLOR = (color) => color = `\x1b[48;5;${color}m`;
const PRINT = (x, y, color, s) => GOTOXY(x, y) + SETCOLOR(color) + s;
const CURSOR = flag => flag ? '\x1b[?25h' : '\x1b[?25l';

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
            SCREEN[height][w] = SCREEN[height - 1][width] + (n & 1);
        }
    }

    const buffer = [];
    buffer.push(CURSOR(false));
    for (let i = 0; i < SCREEN.length; i++) {
        for (let j = 0; j < SCREEN[i].length; j++) {
            const color = PALETTE[SCREEN[i][j]] || PALETTE[PALETTE.length - 1];
            buffer.push(PRINT(i, j, color, ' '));
        }
    }
    buffer.push(CURSOR(true));
    process.stdout.write(buffer.join(''));
}

class Fire {
    constructor(interval = 50) {
        this._interval = interval;
        this._id = null;
    }
    start() {
        if (!this._id) {
            process.stdout.write(START);
            this._id = setInterval(draw, this._interval);
        }
        return this;
    }
    stop() {
        if (this._id) {
            clearInterval(this._id);
            this._id = null;
            process.stdout.write(STOP);
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
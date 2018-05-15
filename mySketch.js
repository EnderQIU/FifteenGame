let display_number;  // 显示数字
let display_image;  // 显示图片
let board;  // 游戏版，单例
let difficulty = 200;
let duck_1;
let duck_2;
let duck_3;
let duck_4;
let duck_5;
let duck_6;
let duck_7;
let duck_8;
let duck_9;
let duck_10;
let duck_11;
let duck_12;
let duck_13;
let duck_14;
let duck_15;
let duck_16;

// 主要用于加载图片
function preload() {
    duck_1 = loadImage('assets/duck_01.jpg');
    duck_2 = loadImage('assets/duck_02.jpg');
    duck_3 = loadImage('assets/duck_03.jpg');
    duck_4 = loadImage('assets/duck_04.jpg');
    duck_5 = loadImage('assets/duck_05.jpg');
    duck_6 = loadImage('assets/duck_06.jpg');
    duck_7 = loadImage('assets/duck_07.jpg');
    duck_8 = loadImage('assets/duck_08.jpg');
    duck_9 = loadImage('assets/duck_09.jpg');
    duck_10 = loadImage('assets/duck_10.jpg');
    duck_11 = loadImage('assets/duck_11.jpg');
    duck_12 = loadImage('assets/duck_12.jpg');
    duck_13 = loadImage('assets/duck_13.jpg');
    duck_14 = loadImage('assets/duck_14.jpg');
    duck_15 = loadImage('assets/duck_15.jpg');
    duck_16 = loadImage('assets/duck_16.jpg');
}

function setup() {
	createCanvas(800, 800);  // 创建画布
    background(200);
    imageMode(CENTER);
	rectMode(CENTER);  // 设置图形的原点为中心点
    display_number = true;
    board = new Board();
}

function draw() {
    clear();
    background(200);
    board.draw();
}

function mouseClicked() {
    if (mouseX < 0 || mouseX > 800 || mouseY < 0 || mouseY > 800){
        return;
    }
    let x = board.blank_tile.position.real_x;
    let y = board.blank_tile.position.real_y;
    let dx = x - mouseX;
    let dy = y - mouseY;
    if (abs(dx) > abs(dy)){
        if (dx > 0) board.instruction_queue.add_instruction(new Instruction('left'));
        else board.instruction_queue.add_instruction(new Instruction('right'));
    }
    else{
        if (dy > 0) board.instruction_queue.add_instruction(new Instruction('up'));
        else board.instruction_queue.add_instruction(new Instruction('down'));
    }
}

function keyPressed() {
    if (keyCode === 68) {
        display_number = display_number === false;
    }
    if (keyCode === 73) {
        display_image = display_image === false;
    }
}

class Board {
    constructor() {
        this.temp_pos_array = [];
        this.tiles = [];
        for (let i = 1; i < 17; i++) {
            this.temp_pos_array.push(i);
        }
        this.temp_pos_array = Board._shuffle(this.temp_pos_array);
        for (let i of this.temp_pos_array) {
            // 第16个设为空块
            if (i === 16) {
                this.blank_tile = new Title(Position._get_x(i), Position._get_y(i), i, true);
                this.tiles.push(this.blank_tile);
            }
            else this.tiles.push(new Title(Position._get_x(i), Position._get_y(i), i, false, eval('duck_'+i)));
        }
        this.instruction_queue = new InstructionQueue(0);
    }

    static _shuffle(a) {
        let length = a.length;
        let shuffled = Array(length);

        for (let index = 0, rand; index < length; index++) {
            rand = ~~(Math.random() * (index + 1));
            if (rand !== index)
                shuffled[index] = shuffled[rand];
            shuffled[rand] = a[index];
        }

        return shuffled;
    }

    // 获取当前可执行的指令
    _get_valid_instructions(){
        if (this.blank_tile.position.pos_no === 16){
            return ['up', 'left'];
        }
        else if (this.blank_tile.position.pos_no === 1){
            return ['down', 'right'];
        }
        else if (this.blank_tile.position.pos_no === 4){
            return ['down', 'left'];
        }
        else if (this.blank_tile.position.pos_no === 13){
            return ['up', 'right'];
        }
        else if (this.blank_tile.position.pos_no === 2
            || this.blank_tile.position.pos_no === 3){
            return ['down', 'left', 'right'];
        }
        else if (this.blank_tile.position.pos_no === 5
            || this.blank_tile.position.pos_no === 9){
            return ['down', 'up', 'right'];
        }
        else if (this.blank_tile.position.pos_no === 8
            || this.blank_tile.position.pos_no === 12){
            return ['down', 'left', 'up'];
        }
        else if (this.blank_tile.position.pos_no === 14
            || this.blank_tile.position.pos_no === 15){
            return ['up', 'left', 'right'];
        }
        else return ['up', 'down', 'left', 'right'];
    }
    // 交换空白块与指令快，此前需要保证指令有效
    swap(ins) {
        // 确定目标方块
        let target_tile = null;
        if (ins === 'up') {
            for (let t of this.tiles) {
                if (t.position.y === this.blank_tile.position.y - 1 &&
                    t.position.x === this.blank_tile.position.x) target_tile = t;
            }
        }
        else if(ins === 'down') {
            for (let t of this.tiles) {
                if (t.position.y === this.blank_tile.position.y + 1 &&
                    t.position.x === this.blank_tile.position.x) target_tile = t;
            }
        }
        else if(ins === 'left') {
            for (let t of this.tiles) {
                if (t.position.x === this.blank_tile.position.x - 1 &&
                    t.position.y === this.blank_tile.position.y) target_tile = t;
            }
        }
        else if(ins === 'right') {
            for (let t of this.tiles) {
                if (t.position.x === this.blank_tile.position.x + 1 &&
                    t.position.y === this.blank_tile.position.y) target_tile = t;
            }
        }
        else throw Error('no such instruction');
        // 交换位置
        let temp_position = target_tile.position;
        target_tile.position = this.blank_tile.position;
        this.blank_tile.position = temp_position;
    }

    // 执行一条指令，若成功执行返回值为 true，否则为 false
    execute(ins){
        let valid_instructions = this._get_valid_instructions();
        for (let vi of valid_instructions){
            if (ins.instruction === vi){
                // 有效，执行指令
                this.swap(ins.instruction);
                return true;
            }
        }
        return false;
    }

    draw () {
        // 先执行指令，若指令栈非空，则需要执行
        if ( this.instruction_queue.is_empty() === false) {
            // 尝试执行一条指令，若指令无效，则去除这条指令执行记录
            let result = this.execute(this.instruction_queue.execute_one_instruction());
            if (result === false) this.instruction_queue.remove_one_executed_invalid_instruction();
        }
        // 再渲染图形
        for (let i of this.tiles) {
            i.draw();
        }
    }
}

// 位置，用于坐标变换
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.real_x = 106 + x * 196;
        this.real_y = 106 + y * 196;
        this.pos_no = 4 * y + x + 1;
    }

    static _get_x(pos_no) {
        if (pos_no === 1 || pos_no === 5 || pos_no === 9 || pos_no === 13){
            return 0;
        }
        else if (pos_no === 2 || pos_no === 6 || pos_no === 10 || pos_no === 14){
            return 1;
        }
        else if (pos_no === 3 || pos_no === 7 || pos_no === 11 || pos_no === 15){
            return 2;
        }
        else if (pos_no === 4 || pos_no === 8 || pos_no === 12 || pos_no === 16){
            return 3;
        }
        else throw Error('no such pos no: ' + pos_no);
    }

    static _get_y(pos_no) {
        if (pos_no === 1 || pos_no === 2 || pos_no === 3 || pos_no === 4){
            return 0;
        }
        else if (pos_no === 5 || pos_no === 6 || pos_no === 7 || pos_no === 8){
            return 1;
        }
        else if (pos_no === 9 || pos_no === 10 || pos_no === 11 || pos_no === 12){
            return 2;
        }
        else if (pos_no === 13 || pos_no === 14 || pos_no === 15 || pos_no === 16){
            return 3;
        }
        else throw Error('no such pos no: ' + pos_no);
    }
}

// 每一个方块
class Title {
    constructor(x, y, number, is_blank=false, img=null) {
        this.position = new Position(x, y);
        if (is_blank) { // 空方块只有位置，没有显示
            this.is_blank = true;
            return;
        }
        this.number = number;
        if (img !== null) this.img = img;
    }

    draw() {
        if (this.is_blank) return;  // 空方块不绘图
        fill(color(255, 0, 25));
        if (display_image === false)
            rect(this.position.real_x, this.position.real_y, 180, 180);
        else image(this.img, this.position.real_x, this.position.real_y, 200, 200);

        if (display_number === true)  // 无论是有没有开启显示数字，如果没有加载图片，一律显示数字
            fill(color(0, 0, 0));
            textSize(44);
            text(str(this.number), this.position.real_x, this.position.real_y);
    }
}

// 打乱顺序
function shuffle_tiles(){
    let random_ins_queue = new InstructionQueue(difficulty);
    for (ins of random_ins_queue.unexcuted_queue){
        board.instruction_queue.add_instruction(ins);
    }
    frameRate(60);
    document.getElementById('shuffle_btn').disabled = true;
    document.getElementById('auto_btn').disabled = false;
}

// 自动完成
function auto_complete(){
    board.instruction_queue.reverse_all();
    frameRate(30);
    document.getElementById('shuffle_btn').disabled = false;
    document.getElementById('auto_btn').disabled = true;
}


class Instruction {
    static _random_a_instruction() {
        let available_instructions = ['up', 'down', 'left', 'right'];
        let choices = [0, 1, 2, 3];
        return available_instructions[random(choices)];
    }

    constructor(instruction_name) {
        switch (instruction_name){
            case 'up':
                this.instruction = 'up';
                break;
            case 'down':
                this.instruction = 'down';
                break;
            case 'left':
                this.instruction = 'left';
                break;
            case 'right':
                this.instruction = 'right';
                break;
            default:
                throw Error('no such instruction');
        }
    }

    reverse() {
        switch (this.instruction) {
            case 'up':
                this.instruction = 'down';
                break;
            case 'down':
                this.instruction = 'up';
                break;
            case 'left':
                this.instruction = 'right';
                break;
            case 'right':
                this.instruction = 'left';
                break;
            default:
                throw Error('no such instruction');
        }
    }
}


class InstructionQueue {
    constructor (len) {
        this.unexcuted_queue = [];  // 未执行的指令栈，用户操作前它必须为空
        this.excuted_queue = [];  // 已执行的操作的指令栈
        for (let i = 0; i < len; i++) {
            this.unexcuted_queue.push(new Instruction(Instruction._random_a_instruction()));
        }
    }

    add_instruction(ins){
        this.unexcuted_queue.push(ins)
    }

    is_empty() {
        return this.unexcuted_queue.length === 0;
    }

    reverse_all() {
        for (ins of this.excuted_queue) {
            ins.reverse();
        }
        this.unexcuted_queue = this.excuted_queue;
        this.excuted_queue = [];
    }

    // 获取一个指令，在 Board.draw() 中调用执行
    execute_one_instruction () {
        let ins = this.unexcuted_queue.pop();
        this.excuted_queue.push(ins);
        return ins;
    }
    // 移除一条已执行的无效指令
    remove_one_executed_invalid_instruction() {
        this.excuted_queue.pop();
    }
}

let display_number;  // 显示数字
let display_image;  // 显示图片
let board;  // 游戏版，单例
let difficulty = 200;
let board_size = 400;
let display_shade = true;  // 显示阴影
let enable_play = false;  // 是否允许交互
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
	createCanvas(board_size, board_size);  // 创建画布
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
    if (board.instruction_queue.is_empty()) board.check_win();
}

function mouseClicked() {
    if (!enable_play) return;
    if (mouseX < 0 || mouseX > board_size || mouseY < 0 || mouseY > board_size){
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
    if(!enable_play) return;
    if (keyCode === 68) {
        display_number = display_number === false;
    }
    if (keyCode === 73) {
        display_image = display_image === false;
    }
    if (keyCode === UP_ARROW) board.instruction_queue.add_instruction(new Instruction("down"));
    if (keyCode === DOWN_ARROW) board.instruction_queue.add_instruction(new Instruction("up"));
    if (keyCode === LEFT_ARROW) board.instruction_queue.add_instruction(new Instruction("right"));
    if (keyCode === RIGHT_ARROW) board.instruction_queue.add_instruction(new Instruction("left"));
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

    // 检查是否获胜
    check_win() {
        if (display_shade) return;
        if (!enable_play) return;
        for (let t of this.tiles) {
            if (t.position.pos_no !== t.number) return;
        }
        textAlign(CENTER);
        textSize(16);
        fill(255, 0, 0);
        text('Puzzle', this.blank_tile.position.real_x, this.blank_tile.position.real_y);
        text('Completed!', this.blank_tile.position.real_x, this.blank_tile.position.real_y + 14);
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
        if (this.instruction_queue.is_empty() === false && !display_shade) enable_play = true;
        // 再渲染图形
        for (let i of this.tiles) {
            i.draw();
        }
        if (display_shade) {
            fill('rgba(70,70,70, 0.75)');
            rect(board_size/2, board_size/2, board_size, board_size);
        }
    }
}

// 位置，用于坐标变换
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.real_x = board_size/8 + x*board_size/4;
        this.real_y = board_size/8 + y*board_size/4;
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
            this.number = number;
            return;
        }
        this.number = number;
        if (img !== null) this.img = img;
    }

    draw() {
        if (this.is_blank) return;  // 空方块不绘图
        fill(color(0, 0, 0));
        if (display_image === false)
            rect(this.position.real_x, this.position.real_y, board_size/4 - 20, board_size/4 - 20);
        else image(this.img, this.position.real_x, this.position.real_y, board_size/4, board_size/4);

        if (!display_number) { // 无论是有没有开启显示数字，如果没有加载图片，一律显示数字
            fill(color(255, 0, 0));
            textSize(44);
            textAlign(CENTER);
            text(str(this.number), this.position.real_x, this.position.real_y);
        }
    }
}

// 打乱顺序
function shuffle_tiles(){
    display_shade = false;
    board.instruction_queue.flush_queue();
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
    enable_play = false;
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

    reversed_instruction(){
        switch (this.instruction) {
            case 'up':
                return 'down';
            case 'down':
                return 'up';
            case 'left':
                return 'right';
            case 'right':
                return 'left';
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

    flush_queue() {
        this.excuted_queue = [];
        this.unexcuted_queue = [];
    }

    // 简化指令队列
    simplify_instruction_queue() {
        let temp_queue = [];
        let count = 0;
        for (let i = 0; i < this.excuted_queue.length - 1; i++) {
            if (this.excuted_queue[i].instruction === this.excuted_queue[i+1].reversed_instruction()){
                i++;
                count++;
            }
            else{
                temp_queue.push(this.excuted_queue[i]);
            }
        }
        temp_queue.push(this.excuted_queue.pop());
        this.excuted_queue = temp_queue;
        if (count !== 0) this.simplify_instruction_queue();
    }

    reverse_all() {
        this.simplify_instruction_queue();
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

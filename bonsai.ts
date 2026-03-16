import * as os from 'os';

const VERSION = "1.2.2";
const DESC = "PyBonsai procedurally generates ASCII art trees in your terminal.";

const END_COLOUR = "\x1b[00m";
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";
const CHAR_THRESHOLD = 0.3;

let seed = 1;

function seedRandom(newSeed: number): void {
  seed = newSeed;
}

function randomBetween(min: number, max: number): number {
  const a = 1103515245;
  const c = 12345;
  const m = 2147483647;
  
  seed = (a * seed + c) % m;
  return min + (seed / m) * (max - min);
}

function gaussRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

function parseString(str: string): string {
  if (str.length < 2) return str;
  if ((str[0] === "'" && str[str.length - 1] === "'") || 
      (str[0] === '"' && str[str.length - 1] === '"')) {
    return str.slice(1, -1);
  }
  return str;
}

class Line {
  start: [number, number] | null = null;
  end: [number, number] | null = null;
  m: number | null = null;
  c: number | null = null;
  is_vertical = false;

  getY(x: number): number | null {
    if (!this.is_vertical) return this.m! * x + this.c!;
    return null;
  }

  getX(y: number): number | null {
    if (this.is_vertical) return this.c;
    if (this.m !== 0) return (y - this.c!) / this.m!;
    return null;
  }

  setEndPoints(start: [number, number], end: [number, number]): void {
    this.start = start;
    this.end = end;

    if (start[0] === end[0]) {
      this.is_vertical = true;
      this.m = null;
      this.c = start[0];
    } else {
      this.m = (start[1] - end[1]) / (start[0] - end[0]);
      this.c = start[1] - this.m! * start[0];
    }
  }

  setGradient(m: number, point: [number, number]): void {
    this.m = m;
    this.c = point[1] - m * point[0];
  }

  getTheta(): number {
    return this.is_vertical ? Math.PI / 2 : Math.atan(this.m!);
  }
}

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  normalise(): void {
    const m = this.mag();
    this.x /= m;
    this.y /= m;
  }
}

class Options {
  static NUM_LAYERS = 8;
  static INITIAL_LEN = 15;
  static ANGLE_MEAN = 40;
  static LEAF_LEN = 4;
  static INSTANT = false;
  static WAIT_TIME = 0;
  static BRANCH_CHARS = "~;:=";
  static LEAF_CHARS = "&%#@";
  static WINDOW_WIDTH = 80;
  static WINDOW_HEIGHT = 25;
  static FIXED = false;

  static SHORT_OPTIONS: { [key: string]: string } = {
    "-h": "--help", "-i": "--instant", "-c": "--branch-chars",
    "-C": "--leaf-chars", "-w": "--wait", "-x": "--width",
    "-y": "--height", "-t": "--type", "-s": "--seed",
    "-S": "--start-len", "-L": "--leaf-len", "-l": "--layers",
    "-a": "--angle", "-f": "--fixed-window", "-I": "--infinite",
    "-d": "--delay"
  };

  numLayers: number;
  initialLen: number;
  angleMean: number;
  leafLen: number;
  instant: boolean;
  waitTime: number;
  branchChars: string;
  leafChars: string;
  userSetType: boolean;
  type: number;
  fixedWindow: boolean;
  windowWidth: number;
  windowHeight: number;
  infinite: boolean;
  animationDelay: number;

  constructor() {
    this.numLayers = Options.NUM_LAYERS;
    this.initialLen = Options.INITIAL_LEN;
    this.angleMean = (Options.ANGLE_MEAN * Math.PI) / 180;
    this.leafLen = Options.LEAF_LEN;
    this.instant = Options.INSTANT;
    this.waitTime = Options.WAIT_TIME;
    this.branchChars = Options.BRANCH_CHARS;
    this.leafChars = Options.LEAF_CHARS;
    this.userSetType = false;
    this.type = Math.floor(Math.random() * 4);
    this.fixedWindow = Options.FIXED;
    this.infinite = false;
    this.animationDelay = 1000;

    const [width, height] = this.getDefaultWindow();
    this.windowWidth = width;
    this.windowHeight = height;
  }

  getDefaultWindow(): [number, number] {
    const columns = (process.stdout as any).columns || Options.WINDOW_WIDTH;
    const rows = (process.stdout as any).rows || Options.WINDOW_HEIGHT;
    return [Math.min(columns, Options.WINDOW_WIDTH), Math.min(rows, Options.WINDOW_HEIGHT)];
  }

  setOption(optionName: string, value: string | boolean): void {
    if (optionName[1] !== "-") {
      if (!(optionName in Options.SHORT_OPTIONS)) {
        this.showInvalid(optionName);
      }
      optionName = Options.SHORT_OPTIONS[optionName];
    }

    switch (optionName) {
      case "--layers": this.numLayers = parseInt(value as string); break;
      case "--start-len": this.initialLen = parseInt(value as string); break;
      case "--angle": this.angleMean = (parseInt(value as string) * Math.PI) / 180; break;
      case "--leaf-len": this.leafLen = parseInt(value as string); break;
      case "--instant": this.instant = value === true || value === "true"; break;
      case "--wait": this.waitTime = parseFloat(value as string); break;
      case "--branch-chars": this.branchChars = parseString(value as string); break;
      case "--leaf-chars": this.leafChars = parseString(value as string); break;
      case "--type": this.type = parseInt(value as string); this.userSetType = true; break;
      case "--width": this.windowWidth = parseInt(value as string); break;
      case "--height": this.windowHeight = parseInt(value as string); break;
      case "--help": this.showHelp(); break;
      case "--version": this.showVersion(); break;
      case "--seed": this.setSeed(parseInt(value as string)); break;
      case "--fixed-window": this.fixedWindow = true; break;
      case "--infinite": this.infinite = true; break;
      case "--delay": this.animationDelay = parseInt(value as string); break;
      default: this.showInvalid(optionName);
    }
  }

  showHelp(): void {
    console.log("USEAGE pybonsai [OPTION]...\n");
    console.log(DESC);
    console.log(`
OPTIONS:
    -h, --help            display help
        --version         display version
    -s, --seed            seed for the random number generator
    -i, --instant         instant mode
    -w, --wait            time delay between drawing characters [default 0]
    -c, --branch-chars    string of chars for branches [default "~;:="]
    -C, --leaf-chars      string of chars for leaves [default "&%#@"]
    -x, --width           maximum width [default 80]
    -y, --height          maximum height [default 25]
    -t, --type            tree type: 0-3 [default random]
    -S, --start-len       length of root branch [default 15]
    -L, --leaf-len        length of each leaf [default 4]
    -l, --layers          number of branch layers [default 8]
    -a, --angle           mean angle in degrees [default 40]
    -f, --fixed-window    do not allow window height increase
        --infinite       generate trees infinitely in a loop
        --delay          delay between trees in infinite mode [default 1000ms]
`);
    process.exit(0);
  }

  showVersion(): void {
    console.log(`PyBonsai version ${VERSION}`);
    process.exit(0);
  }

  showInvalid(optionName: string): void {
    throw new Error(`Invalid option: ${optionName}. Use pybonsai --help for usage.`);
  }

  setSeed(s: number): void {
    seedRandom(s);
    if (!this.userSetType) this.type = Math.floor(randomBetween(0, 4));
  }
}

class TerminalWindow {
  width: number;
  height: number;
  chars: string[][];
  options: Options;

  static CHAR_WIDTH = 1;
  static CHAR_HEIGHT = 2;
  static BACKGROUND_CHAR = " ";

  constructor(width: number, height: number, options: Options) {
    this.width = width;
    this.height = height;
    this.options = options;
    this.chars = Array.from({ length: height }, () => 
      Array.from({ length: width }, () => TerminalWindow.BACKGROUND_CHAR)
    );
  }

  colourChar(char: string, r: number, g: number, b: number): string {
    return `\x1b[38;2;${r};${g};${b}m${char}${END_COLOUR}`;
  }

  clearChars(): void {
    this.chars = Array.from({ length: this.height }, () => 
      Array.from({ length: this.width }, () => TerminalWindow.BACKGROUND_CHAR)
    );
  }

  draw(): void {
    process.stdout.write(HIDE_CURSOR);
    for (const row of this.chars) console.log(row.join(""));
    process.stdout.write(`\x1b[${this.height}A`);
    process.stdout.write(SHOW_CURSOR);
  }

  resetCursor(): void {
    process.stdout.write(`\x1b[${this.height}B`);
  }

  planeToScreen(x: number, y: number): [number, number] {
    const scaledX = x / TerminalWindow.CHAR_WIDTH;
    const scaledY = y / TerminalWindow.CHAR_HEIGHT;
    return [Math.round(this.height - scaledY), Math.round(scaledX)];
  }

  screenToPlane(x: number, y: number): [number, number] {
    const swappedY = this.height - x;
    return [y * TerminalWindow.CHAR_WIDTH, swappedY * TerminalWindow.CHAR_HEIGHT];
  }

  increaseHeight(deltaHeight: number): boolean {
    if (this.options.fixedWindow) return false;
    this.height += deltaHeight;
    for (let i = 0; i < deltaHeight; i++) {
      this.chars.unshift(Array.from({ length: this.width }, () => TerminalWindow.BACKGROUND_CHAR));
    }
    return true;
  }

  setCharInstant(x: number, y: number, char: string, colour: [number, number, number], isScreenCoords: boolean): void {
    if (!isScreenCoords) [x, y] = this.planeToScreen(x, y);
    if (x < 0) {
      if (this.increaseHeight(Math.abs(x))) x = 0;
    }
    if (x < 0 || x >= this.height || y < 0 || y >= this.width) return;
    this.chars[x][y] = this.colourChar(char, colour[0], colour[1], colour[2]);
  }

  async setCharWait(x: number, y: number, char: string, colour: [number, number, number], isScreenCoords: boolean, waitTime: number): Promise<void> {
    this.setCharInstant(x, y, char, colour, isScreenCoords);
    this.draw();
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  getLineChar(line: Line): string {
    const theta = line.getTheta();
    const upper = Math.PI / 2 * (2 / 3);
    const lower = Math.PI / 2 * (1 / 3);
    if (Math.abs(theta) > upper) return "|";
    if (Math.abs(theta) < lower) return "_";
    return theta > 0 ? "/" : "\\";
  }

  chooseColour(colour: [number, number, number] | [[number, number], [number, number], [number, number]]): [number, number, number] {
    if (typeof colour[0] === 'number') return colour as [number, number, number];
    const randColour: number[] = [];
    for (const [lower, upper] of colour as [[number, number], [number, number], [number, number]]) {
      randColour.push(Math.floor(randomBetween(lower, upper)));
    }
    return randColour as [number, number, number];
  }

  async drawSteepLine(start: [number, number], end: [number, number], colour: [number, number, number] | [[number, number], [number, number], [number, number]], width: number, char: string, midLine: Line): Promise<void> {
    const [startInx] = this.planeToScreen(start[0], start[1]);
    const [endInx] = this.planeToScreen(end[0], end[1]);
    const step = endInx > startInx ? 1 : -1;

    for (let inx1 = startInx; endInx > startInx ? inx1 <= endInx : inx1 >= endInx; inx1 += step) {
      const dists: [number, number][] = [];
      for (let inx2 = 0; inx2 < this.width; inx2++) {
        const [x, y] = this.screenToPlane(inx1, inx2);
        const desiredX = midLine.getX(y);
        dists.push([Math.abs(desiredX! - x), inx2]);
      }
      dists.sort((a, b) => a[0] - b[0]);
      for (let i = 0; i < width; i++) {
        if (i >= dists.length) break;
        const chosenChar = Math.random() < CHAR_THRESHOLD ? 
          this.options.branchChars[Math.floor(Math.random() * this.options.branchChars.length)] : char;
        const chosenCol = this.chooseColour(colour);
        if (this.options.instant) this.setCharInstant(inx1, dists[i][1], chosenChar, chosenCol, true);
        else await this.setCharWait(inx1, dists[i][1], chosenChar, chosenCol, true, this.options.waitTime);
      }
    }
  }

  async drawShallowLine(start: [number, number], end: [number, number], colour: [number, number, number] | [[number, number], [number, number], [number, number]], width: number, char: string, midLine: Line): Promise<void> {
    const [, startInx] = this.planeToScreen(start[0], start[1]);
    const [, endInx] = this.planeToScreen(end[0], end[1]);
    const step = endInx > startInx ? 1 : -1;

    for (let inx2 = startInx; endInx > startInx ? inx2 <= endInx : inx2 >= endInx; inx2 += step) {
      const dists: [number, number][] = [];
      for (let inx1 = 0; inx1 < this.height; inx1++) {
        const [x, y] = this.screenToPlane(inx1, inx2);
        const desiredY = midLine.getY(x);
        dists.push([Math.abs(desiredY! - y), inx1]);
      }
      dists.sort((a, b) => a[0] - b[0]);
      for (let i = 0; i < width; i++) {
        if (i >= dists.length) break;
        const chosenChar = Math.random() < CHAR_THRESHOLD ?
          this.options.branchChars[Math.floor(Math.random() * this.options.branchChars.length)] : char;
        const chosenCol = this.chooseColour(colour);
        if (this.options.instant) this.setCharInstant(dists[i][1], inx2, chosenChar, chosenCol, true);
        else await this.setCharWait(dists[i][1], inx2, chosenChar, chosenCol, true, this.options.waitTime);
      }
    }
  }

  checkLineBounds(start: [number, number], end: [number, number]): void {
    const [h1] = this.planeToScreen(start[0], start[1]);
    const [h2] = this.planeToScreen(end[0], end[1]);
    const roomFromTop = Math.min(h1, h2);
    if (roomFromTop < 0) this.increaseHeight(Math.abs(roomFromTop));
  }

  async drawLine(start: [number, number], end: [number, number], colour: [number, number, number] | [[number, number], [number, number], [number, number]], width: number): Promise<void> {
    const midLine = new Line();
    midLine.setEndPoints(start, end);
    const char = this.getLineChar(midLine);
    this.checkLineBounds(start, end);
    if (midLine.is_vertical || Math.abs(midLine.m!) >= 1) {
      await this.drawSteepLine(start, end, colour, width, char, midLine);
    } else {
      await this.drawShallowLine(start, end, colour, width, char, midLine);
    }
  }
}

class Tree {
  static BOX_HEIGHT = 3;
  static MAX_TOP_WIDTH = 35;
  static MOUND_THRESHOLD = 0.1;
  static SOIL_CHAR_THRESHOLD = 0.1;
  static SOIL_CHARS = [".", "~", "*"];
  static MOUND_WIDTH_MEAN = 2;
  static MOUND_WIDTH_STD_DEV = 1;
  static SOIL_COLOUR: [number, number, number] = [0, 150, 0];
  static BOX_COLOUR: [number, number, number] = [200, 200, 200];
  static BRANCH_COLOUR: [[number, number], [number, number], [number, number]] = [[200, 255], [150, 255], [0, 0]];

  window: TerminalWindow;
  rootX: number;
  rootY: number;
  options: Options;
  boxTopWidth: number;

  constructor(window: TerminalWindow, rootPos: [number, number], options: Options) {
    this.window = window;
    [this.rootX, this.rootY] = rootPos;
    this.options = options;
    this.boxTopWidth = this.getBoxWidth();
  }

  async draw(): Promise<void> {
    // Base implementation - to be overridden
  }

  getBoxWidth(): number {
    let width = Math.min(Math.floor(this.window.width / 3), Tree.MAX_TOP_WIDTH);
    if (width % 2 === 0) width += 1;
    return width;
  }

  drawBox(): void {
    const [rootInx1, rootInx2] = this.window.planeToScreen(this.rootX, this.rootY);

    for (let i = 0; i < Tree.BOX_HEIGHT; i++) {
      const inx1 = rootInx1 + i;
      const width = this.boxTopWidth - i * 2;

      for (let x = 0; x < width; x++) {
        const inx2 = rootInx2 - Math.floor(width / 2) + x;
        let char: string;
        let colour: [number, number, number];

        if (x === 0) { char = "\\"; colour = Tree.BOX_COLOUR; }
        else if (x === width - 1) { char = "/"; colour = Tree.BOX_COLOUR; }
        else if (i === 0) { char = "_"; colour = Tree.SOIL_COLOUR; }
        else if (i === Tree.BOX_HEIGHT - 1) { char = "_"; colour = Tree.BOX_COLOUR; }
        else {
          char = Math.random() < Tree.SOIL_CHAR_THRESHOLD ? 
            Tree.SOIL_CHARS[Math.floor(Math.random() * Tree.SOIL_CHARS.length)] : " ";
          colour = Tree.SOIL_COLOUR;
        }

        this.window.setCharInstant(inx1, inx2, char, colour, true);
      }
    }

    this.drawBoxFeet(rootInx1, rootInx2);
    this.drawAllMounds(rootInx1, rootInx2);
  }

  drawBoxFeet(rootInx1: number, rootInx2: number): void {
    const inx1 = rootInx1 + Tree.BOX_HEIGHT;
    const offset = Math.floor(this.boxTopWidth / 2) - Tree.BOX_HEIGHT - 1;
    for (const sign of [-1, 1]) {
      this.window.setCharInstant(inx1, rootInx2 + sign * offset, "‾", Tree.BOX_COLOUR, true);
    }
  }

  drawAllMounds(rootInx1: number, rootInx2: number): void {
    let numDrawn = 0;
    for (let i = 1; i < this.boxTopWidth; i++) {
      const inx2 = rootInx2 - Math.floor(this.boxTopWidth / 2) + i;
      if (Math.random() < Tree.MOUND_THRESHOLD / (numDrawn + 1)) {
        numDrawn += 1;
        this.drawMound(rootInx1, inx2, this.boxTopWidth - i - 1);
      }
    }
  }

  drawMound(inx1: number, startInx2: number, maxWidth: number): void {
    let topWidth = Math.round(gaussRandom(Tree.MOUND_WIDTH_MEAN, Tree.MOUND_WIDTH_STD_DEV));
    topWidth = Math.min(topWidth, maxWidth - 2);
    if (topWidth <= 0) return;

    for (let i = 0; i < topWidth + 2; i++) {
      const char = (i === 0 || i === topWidth + 1) ? "." : "-";
      this.window.setCharInstant(inx1, startInx2 + i, char, Tree.SOIL_COLOUR, true);
    }
  }

  drawTreeBase(trunkWidth: number): void {
    const [inx1, inx2] = this.window.planeToScreen(this.rootX, this.rootY);
    let leftX = inx2 - Math.floor(trunkWidth / 2);
    let rightX = inx2 + Math.floor(trunkWidth / 2);
    if (trunkWidth % 2 === 0) rightX -= 1;

    this.window.setCharInstant(inx1, leftX - 2, ".", [255, 255, 0], true);
    this.window.setCharInstant(inx1, leftX - 1, "/", [255, 255, 0], true);
    this.window.setCharInstant(inx1, rightX + 1, "\\", [255, 255, 0], true);
    this.window.setCharInstant(inx1, rightX + 2, ".", [255, 255, 0], true);
  }
}

class RecursiveTree extends Tree {
  static ANGLE_STD_DEV = Math.PI / 180 * 8;
  static LEN_SCALE = 0.75;
  static MAX_INITIAL_WIDTH = 6;

  constructor(window: TerminalWindow, rootPos: [number, number], options: Options) {
    super(window, rootPos, options);
  }

  getEndCoords(startX: number, startY: number, length: number, theta: number): [number, number] {
    return [startX + length * Math.sin(theta), startY + length * Math.cos(theta)];
  }

  getInitialParams(): [number, number] {
    let initialWidth = Math.floor(this.options.initialLen / 5);
    const initialAngle = gaussRandom(0, RecursiveTree.ANGLE_STD_DEV);
    initialWidth = Math.max(0, Math.min(RecursiveTree.MAX_INITIAL_WIDTH, initialWidth));
    return [initialWidth, initialAngle];
  }
}

class ClassicTree extends RecursiveTree {
  static MEAN_BRANCHES = 2;
  static BRANCHES_STD_DEV = 0.5;

  constructor(window: TerminalWindow, rootPos: [number, number], options: Options) {
    super(window, rootPos, options);
  }

  async drawBranch(x: number, y: number, layer: number, length: number, width: number, theta: number): Promise<void> {
    if (layer >= this.options.numLayers) {
      new Leaves(this.window, [x, y], this.options).draw();
      return;
    }

    const [endX, endY] = this.getEndCoords(x, y, length, theta);
    await this.window.drawLine([x, y], [endX, endY], ClassicTree.BRANCH_COLOUR, Math.round(width));
    await this.drawEndBranches(x, y, layer, length, width, theta);
  }

  async drawEndBranches(startX: number, startY: number, layer: number, length: number, width: number, theta: number): Promise<void> {
    let sign = 1;
    const numBranches = Math.max(0, Math.round(gaussRandom(ClassicTree.MEAN_BRANCHES, ClassicTree.BRANCHES_STD_DEV)));
    const step = numBranches !== 0 ? length / numBranches : 0;
    const newWidth = Math.max(1, width - 1);
    const newLength = length * ClassicTree.LEN_SCALE;

    for (let i = 0; i < numBranches; i++) {
      const distUpBranch = (i + 1) * step;
      const newTheta = theta + sign * gaussRandom(this.options.angleMean, ClassicTree.ANGLE_STD_DEV);
      const [bx, by] = this.getEndCoords(startX, startY, distUpBranch, theta);
      await this.drawBranch(bx, by, layer + 1, newLength, newWidth, newTheta);
      sign *= -1;
    }
  }

  async draw(): Promise<void> {
    const [initialWidth, initialAngle] = this.getInitialParams();
    this.drawBox();
    this.drawTreeBase(initialWidth);
    await this.drawBranch(this.rootX, this.rootY, 1, this.options.initialLen, initialWidth, initialAngle);
  }
}

class FibonacciTree extends RecursiveTree {
  fib: number[] = [];
  branchNums: number[][] = [];

  constructor(window: TerminalWindow, rootPos: [number, number], options: Options) {
    super(window, rootPos, options);
    this.fib = this.fibNums();
    this.branchNums = this.generateBranchNums();
  }

  fibNums(): number[] {
    const fib = [1, 1];
    for (let i = 0; i < this.options.numLayers; i++) {
      fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib;
  }

  generateBranchNums(): number[][] {
    const branchNums: number[][] = [[1]];
    for (let i = 0; i < this.options.numLayers; i++) {
      const numBranches = this.fib[i + 2];
      const numParents = branchNums[branchNums.length - 1].reduce((a, b) => a + b, 0);
      const base = Math.floor(numBranches / numParents);
      const diff = numBranches - base * numParents;
      const currentNums = Array.from({ length: numParents }, (_, x) => x < diff ? base + 1 : base);
      for (let j = currentNums.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [currentNums[j], currentNums[k]] = [currentNums[k], currentNums[j]];
      }
      branchNums.push(currentNums);
    }
    return branchNums;
  }

  async drawBranch(x: number, y: number, layerInx: number, branchInx: number, length: number, width: number, theta: number): Promise<void> {
    if (layerInx > this.options.numLayers) {
      new Leaves(this.window, [x, y], this.options).draw();
      return;
    }

    const [endX, endY] = this.getEndCoords(x, y, length, theta);
    await this.window.drawLine([x, y], [endX, endY], FibonacciTree.BRANCH_COLOUR, Math.round(width));
    await this.drawEndBranches(x, y, layerInx, branchInx, length, width, theta);
  }

  async drawEndBranches(startX: number, startY: number, layerInx: number, branchInx: number, length: number, width: number, theta: number): Promise<void> {
    let sign = 1;
    const numBranches = this.branchNums[layerInx][branchInx];
    const newWidth = Math.max(1, width - 1);
    const [x, y] = this.getEndCoords(startX, startY, length, theta);

    for (let i = 0; i < numBranches; i++) {
      const angle = gaussRandom(this.options.angleMean, FibonacciTree.ANGLE_STD_DEV);
      const newTheta = theta + sign * angle;
      const newLen = length * FibonacciTree.LEN_SCALE;
      await this.drawBranch(x, y, layerInx + 1, branchInx + i, newLen, newWidth, newTheta);
      sign *= -1;
    }
  }

  async draw(): Promise<void> {
    const [initialWidth, initialAngle] = this.getInitialParams();
    this.drawBox();
    this.drawTreeBase(initialWidth);
    await this.drawBranch(this.rootX, this.rootY, 1, 0, this.options.initialLen, initialWidth, initialAngle);
  }
}

class OffsetFibTree extends FibonacciTree {
  constructor(window: TerminalWindow, rootPos: [number, number], options: Options) {
    super(window, rootPos, options);
  }

  async drawEndBranches(startX: number, startY: number, layerInx: number, branchInx: number, length: number, width: number, theta: number): Promise<void> {
    let sign = 1;
    const numBranches = this.branchNums[layerInx][branchInx];
    const step = numBranches !== 0 ? length / numBranches : 0;
    const newWidth = Math.max(1, width - 1);
    const newLength = length * ClassicTree.LEN_SCALE;

    for (let i = 0; i < numBranches; i++) {
      const distUpBranch = (i + 1) * step;
      const newTheta = theta + sign * gaussRandom(this.options.angleMean, OffsetFibTree.ANGLE_STD_DEV);
      const [x, y] = this.getEndCoords(startX, startY, distUpBranch, theta);
      await this.drawBranch(x, y, layerInx + 1, branchInx + i, newLength, newWidth, newTheta);
      sign *= -1;
    }
  }
}

class RandomOffsetFibTree extends FibonacciTree {
  static GROW_END_THRESHOLD = 0.5;
  static NON_END_MIN = 0.3;
  static NON_END_MAX = 0.9;

  constructor(window: TerminalWindow, rootPos: [number, number], options: Options) {
    super(window, rootPos, options);
  }

  async drawEndBranches(startX: number, startY: number, layerInx: number, branchInx: number, length: number, width: number, theta: number): Promise<void> {
    let sign = 1;
    const numBranches = this.branchNums[layerInx][branchInx];
    const newWidth = Math.max(1, width - 1);
    const newLength = length * ClassicTree.LEN_SCALE;
    let needLeaves = true;

    for (let i = 0; i < numBranches; i++) {
      const growAtEnd = Math.random() < RandomOffsetFibTree.GROW_END_THRESHOLD;
      let distUpBranch: number;

      if (growAtEnd) {
        needLeaves = false;
        distUpBranch = length;
      } else {
        distUpBranch = length * randomBetween(RandomOffsetFibTree.NON_END_MIN, RandomOffsetFibTree.NON_END_MAX);
      }

      const newTheta = theta + sign * gaussRandom(this.options.angleMean, OffsetFibTree.ANGLE_STD_DEV);
      const [x, y] = this.getEndCoords(startX, startY, distUpBranch, theta);
      await this.drawBranch(x, y, layerInx + 1, branchInx + i, newLength, newWidth, newTheta);
      sign *= -1;
    }

    if (needLeaves) {
      const endPos = this.getEndCoords(startX, startY, length, theta);
      new Leaves(this.window, endPos, this.options).draw();
    }
  }
}

class Leaves {
  static NUM_LEAVES = 4;

  window: TerminalWindow;
  branchX: number;
  branchY: number;
  options: Options;

  constructor(window: TerminalWindow, branchEnd: [number, number], options: Options) {
    this.window = window;
    [this.branchX, this.branchY] = branchEnd;
    this.options = options;
  }

  draw(): void {
    const g = new Vector(0, -1);

    for (let _ = 0; _ < Leaves.NUM_LEAVES; _++) {
      let vel = new Vector(randomBetween(-1, 1), randomBetween(-1, 1));
      vel.normalise();
      let pos = new Vector(this.branchX, this.branchY);

      for (let i = 0; i < this.options.leafLen; i++) {
        pos = pos.add(vel);
        const colour: [number, number, number] = [0, Math.floor(randomBetween(75, 255)), 0];
        const char = this.options.leafChars[Math.floor(Math.random() * this.options.leafChars.length)];

        if (this.options.instant) {
          this.window.setCharInstant(Math.round(pos.x), Math.round(pos.y), char, colour, false);
        } else {
          this.window.setCharInstant(Math.round(pos.x), Math.round(pos.y), char, colour, false);
        }

        const weight = i / this.options.leafLen;
        vel = vel.add(g.multiply(weight));
      }
    }
  }
}

function parseArgs(): { [key: string]: string | boolean } {
  const args = process.argv.slice(2);
  const argValues: { [key: string]: string | boolean } = {};

  for (let i = 0; i < args.length; i++) {
    const x = args[i];
    if (x[0] === "-") {
      const value = getArgValue(args, i);
      const isShort = x[1] !== "-";

      if (isShort && x.length > 2) {
        for (let j = 1; j < x.length; j++) {
          argValues[`-${x[j]}`] = value;
        }
      } else {
        argValues[x] = value;
      }
    }
  }

  return argValues;
}

function getArgValue(args: string[], inx: number): string | boolean {
  const valueInx = inx + 1;
  if (valueInx >= args.length) return true;
  const value = args[valueInx];
  return value[0] === "-" ? true : value;
}

function getOptions(args: { [key: string]: string | boolean }): Options {
  const options = new Options();
  for (const [optionName, value] of Object.entries(args)) {
    options.setOption(optionName, value);
  }
  return options;
}

function getTree(window: TerminalWindow, options: Options): Tree {
  const rootX = Math.floor(window.width / 2);
  let rootY = Tree.BOX_HEIGHT + 4;
  rootY += rootY % 2;
  const rootPos: [number, number] = [rootX, rootY];

  switch (options.type) {
    case 0: return new ClassicTree(window, rootPos, options);
    case 1: return new FibonacciTree(window, rootPos, options);
    case 2: return new OffsetFibTree(window, rootPos, options);
    default: return new RandomOffsetFibTree(window, rootPos, options);
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  const options = getOptions(args);

  if (options.infinite) {
    await infiniteLoop(options);
  } else {
    const window = new TerminalWindow(options.windowWidth, options.windowHeight, options);
    const t = getTree(window, options);
    await t.draw();
    window.draw();
    window.resetCursor();
  }
}

async function infiniteLoop(options: Options): Promise<void> {
  while (true) {
    const window = new TerminalWindow(options.windowWidth, options.windowHeight, options);
    clearScreen();
    const t = getTree(window, options);
    await t.draw();
    window.draw();
    window.resetCursor();
    await new Promise(resolve => setTimeout(resolve, options.animationDelay));
  }
}

function clearScreen(): void {
  process.stdout.write("\x1b[2J\x1b[H");
}

main().catch(console.error);

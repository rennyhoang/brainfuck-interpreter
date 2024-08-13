class Tape {
  constructor(program) {
    this.tape = new Uint8Array(1000);
    this.good_chars = new Set([">", "<", "+", "-", ".", ",", "[", "]"]);
    this.pos = 0;
    this.pc = 0;
    this.program = this.clean(program);
    [this.ltor, this.rtol] = this.matchBrackets();
    this.final_output = "";
  }

  clean(program) {
    let cleaned_program = "";
    for (let i = 0; i < program.length; i++) {
      const ch = program[i];
      if (this.good_chars.has(ch)) {
        cleaned_program += ch;
      }
    }
    return cleaned_program;
  }

  matchBrackets() {
    const stack = [];
    const ltor = new Map();
    const rtol = new Map();

    for (let i = 0; i < this.program.length; i++) {
      const ch = this.program[i];
      if (ch != "[" && ch != "]") {
        continue;
      }
      if (ch == "[") {
        stack.push(i);
      } else {
        ltor.set(stack.at(-1), i);
        rtol.set(i, stack.pop());
      }
    }

    return [ltor, rtol];
  }

  renderTape() {
    const container = document.querySelector("#container");
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      // change text while keeping children
      child.childNodes[0].textContent = this.tape[i].toString();
      // remove past pointers if they're still around
      if (child.childNodes.length > 2) {
        child.removeChild(child.lastChild);
      }
    }
    const n = this.pos + 1;
    const currentCell = document.querySelector(
      "#container div:nth-child(" + n.toString() + ")",
    );
    const pointer = document.createElement("div");
    pointer.classList.add("pointer");
    pointer.textContent = this.program[this.pc];
    currentCell.appendChild(pointer);
    pointer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  tapeLoop() {
    if (this.pc >= 0 && this.pc < this.program.length) {
      const curr_instruction = this.program[this.pc];
      if (curr_instruction == ">") {
        this.pointerRight();
      } else if (curr_instruction == "<") {
        this.pointerLeft();
      } else if (curr_instruction == "+") {
        this.increment();
      } else if (curr_instruction == "-") {
        this.decrement();
      } else if (curr_instruction == ".") {
        this.output();
      } else if (curr_instruction == ",") {
        this.input();
      } else if (curr_instruction == "[") {
        this.jumpForward();
      } else {
        this.jumpBackward();
      }
      this.renderTape();
    } else {
      document.querySelector("#output").style.color = "#a6e3a1";
      this.stopLoop();
    }
  }

  stopLoop() {
    clearInterval(intervalID);
  }

  pointerRight() {
    this.pos++;
    this.pc++;
  }

  pointerLeft() {
    this.pos--;
    this.pc++;
  }

  increment() {
    if (this.tape[this.pos] == 255) {
      this.tape[this.pos] = 0;
    } else {
      this.tape[this.pos]++;
    }
    this.pc++;
  }

  decrement() {
    if (this.tape[this.pos] == 0) {
      this.tape[this.pos] = 255;
    } else {
      this.tape[this.pos]--;
    }
    this.pc++;
  }

  output() {
    document.querySelector("#output").textContent += String.fromCharCode(
      this.tape[this.pos],
    );
    this.pc++;
  }

  input() {
    const user_input = prompt()[0];
    this.tape[this.pos] = user_input.charCodeAt(0);
    this.pc++;
  }

  jumpForward() {
    if (this.tape[this.pos] == 0) {
      this.pc = this.ltor.get(this.pc) + 1;
    } else {
      this.pc++;
    }
  }

  jumpBackward() {
    if (this.tape[this.pos] != 0) {
      this.pc = this.rtol.get(this.pc) + 1;
    } else {
      this.pc++;
    }
  }
}

const container = document.querySelector("#container");
container.innerHTML = "";
for (let i = 0; i < 1000; i++) {
  const newCell = document.createElement("div");
  const newCellIndex = document.createElement("div");
  newCell.textContent = "0";
  newCellIndex.textContent = i.toString();
  newCell.classList.add("cell");
  newCellIndex.classList.add("index");
  newCell.appendChild(newCellIndex);
  container.appendChild(newCell);
}

const form = document.querySelector("form");
let my_tape = new Tape("");

form.onsubmit = (e) => {
  e.preventDefault();
  document.querySelector("#output").textContent = "Output: ";
  document.querySelector("#output").style.color = "#cdd6f4";
  const code = document.querySelector("#code").value;
  const delay = 100000 / Number(document.querySelector("#speed").value);
  my_tape = new Tape(code);
  intervalID = setInterval(() => {
    my_tape.tapeLoop();
  }, delay);
  console.log("inside submit " + intervalID);
};

const stop = document.querySelector("#stop");
stop.onclick = (e) => {
  console.log("inside stop" + intervalID);
  my_tape.stopLoop();
};

//const program = ">>>+>>>+>>>>>+>>>>>>>>>>>>>>+>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<";
//const my_tape = new Tape(program);
//intervalID = setInterval(() => {
//  my_tape.tapeLoop();
//}, 300);

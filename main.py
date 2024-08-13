class Tape:
    def __init__(self, program):
        self.tape = [0] * 20
        self.pos = 0
        self.pc = 0
        self.program = self.clean(program)
        self.ltor, self.rtol = self.matchBrackets()

    def clean(self, program):
        cleaned_program = ""
        good_chars = (">", "<", "+", "-", ".", ",", "[", "]")
        for ch in program:
            if ch in good_chars:
                cleaned_program += ch
        return cleaned_program

    def matchBrackets(self):
        stack = []
        matches = {}
        rev_matches = {}
        for idx, ch in enumerate(self.program):
            if ch != "[" and ch != "]":
                continue
            if ch == "[":
                stack.append(idx)
            else:
                matches[stack[-1]] = idx
                rev_matches[idx] = stack[-1]
                stack.pop()
        return [matches, rev_matches]

    def runProgram(self):
        print(self.ltor)
        while self.pc >= 0 and self.pc < len(self.program):
            print(str(self.tape) + " " + self.program[self.pc] + str(self.pos))
            curr_instruction = self.program[self.pc]
            if curr_instruction == ">":
                self.pointerRight()
            elif curr_instruction == "<":
                self.pointerLeft()
            elif curr_instruction == "+":
                self.increment()
            elif curr_instruction == "-":
                self.decrement()
            elif curr_instruction == ".":
                self.output()
            elif curr_instruction == ",":
                self.input()
            elif curr_instruction == "[":
                self.jumpForward()
            else:
                self.jumpBackward()

    def pointerRight(self):
        assert self.pos < 30000
        self.pos += 1
        self.pc += 1

    def pointerLeft(self):
        assert self.pos > 0
        self.pos -= 1
        self.pc += 1

    def increment(self):
        self.tape[self.pos] += 1
        if self.tape[self.pos] == 256:
            self.tape[self.pos] = 0
        self.pc += 1

    def decrement(self):
        self.tape[self.pos] -= 1
        if self.tape[self.pos] == -1:
            self.tape[self.pos] = 255
        self.pc += 1

    def output(self):
        print(chr(self.tape[self.pos]), end="")
        self.pc += 1

    def input(self):
        user_input = input()
        self.tape[self.pos] = ord(user_input)
        self.pc += 1

    def jumpForward(self):
        if self.tape[self.pos] == 0:
            self.pc = self.ltor[self.pc] + 1
        else:
            self.pc += 1

    def jumpBackward(self):
        if self.tape[self.pos] != 0:
            self.pc = self.rtol[self.pc] + 1
        else:
            self.pc += 1


def main():
    # program = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
    # program = "++>+++++[<+>-]++++++++[<++++++>-]<."
    program = "+++++++++++>+>>>>++++++++++++++++++++++++++++++++++++++++++++>++++++++++++++++++++++++++++++++<<<<<<[>[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]<[>++++++++++[-<-[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<[>>>+<<<-]>>[-]]<<]>>>[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<+>>[-]]<<<<<<<]>>>>>[++++++++++++++++++++++++++++++++++++++++++++++++.[-]]++++++++++<[->-<]>++++++++++++++++++++++++++++++++++++++++++++++++.[-]<<<<<<<<<<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<-[>>.>.<<<[-]]<<[>>+>+<<<-]>>>[<<<+>>>-]<<[<+>-]>[<+>-]<<<-]"
    my_tape = Tape(program)
    my_tape.runProgram()
    print(my_tape.tape)


if __name__ == "__main__":
    main()

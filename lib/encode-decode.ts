const SHIFT = 8;
const TYPE_MASK        = 0b0000000011111111;
const OPERAND_LEN_MASK = 0b0000111100000000;
const LO_BIT_MASK      = 0b00000000000000001111111111111111;
const HI_BIT_MASK      = 0b11111111111111110000000000000000;
const MAX = 0b1111111111111111;
export class Encoder {
  static encode(program: number[], format = 'hex'): string | number[] {
    let encoder = new this(program);
    return encoder.encode(format);
  }

  constructor(private program: number[]) {}

  encode(format: string): string | number[] {
    let { program } = this;
    let encoded = [];
    for (let i = 0; i < program.length; i += 4) {
      let type = program[i];
      if (type > 0b11111111) {
        throw new Error(`Opcode type over 8-bits. Got ${type}.`);
      }
      let op1 = program[i + 1];
      let op2 = program[i + 2];
      let op3 = program[i + 3];

      if (op1 > MAX || op2 > MAX || op3 > MAX) {
        throw new Error(`Operand is over 16-bits.`);
      }

      let argsLength = this.getOperationLength(op1, op2, op3);
      encoded.push((type | (argsLength << SHIFT)));
      this.encodeOperands(encoded, argsLength, op1, op2, op3);
    }

    if (format === 'hex') {
      return this.toHex(encoded);
    }

    return encoded;
  }

  toHex(encoded) {
    return String.fromCharCode.apply(null, new Uint16Array(encoded));
  }

  encodeOperands(encoded, argsLength, op1, op2, op3) {
    switch(argsLength) {
      case 1:
        encoded.push(op1);
        break;
      case 2:
        encoded.push(op1);
        encoded.push(op2);
        break;
      case 3:
        encoded.push(op1);
        encoded.push(op2);
        encoded.push(op3);
        break;
    }
  }

  getOperationLength(op1, op2, op3) {
    let length = 0;

    if (op1 !== 0) {
      length++;
    }

    if (op2 !== 0) {
      length++;
    }

    if (op3 !== 0) {
      length++;
    }

    return length;
  }
}

export class Decoder {
  static decode(hexString: string): Uint16Array {
    return new this().decode(hexString);
  }

  str2ab(str) {
    let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    let bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }

  decode(hexString: string): Uint16Array {
    let program = this.str2ab(hexString);

    let pc = 0;
    while (pc !== program.length - 1) {
      let instruction = program[pc];
      let type = (instruction & TYPE_MASK);
      program[pc] = type;
      let argsLength = (instruction & OPERAND_LEN_MASK) >> SHIFT;

      if (argsLength === 0) {
        pc++;
      }

      if (argsLength === 1) {
        program[pc + 1] = program[pc + 1];
        pc += 2;
      }

      if (argsLength === 2) {
        program[pc + 1] = program[pc + 1];
        program[pc + 2] = (program[pc + 1] & HI_BIT_MASK) >> SHIFT;
        pc += 2;
      }

      if (argsLength === 3) {
        program[pc + 1] = program[pc + 1];
        program[pc + 2] = (program[pc + 1] & HI_BIT_MASK) >> SHIFT;
        program[pc + 3] = program[pc + 2];
        pc += 3;
      }
    }

    return program;
  }
}

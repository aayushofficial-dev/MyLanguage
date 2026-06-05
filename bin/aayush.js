#!/usr/bin/env node

const fs = require('fs');

function readLineSync(promptText = '') {
  if (promptText) process.stdout.write(String(promptText));

  let line = '';
  const buffer = Buffer.alloc(1);

  while (true) {
    const bytesRead = fs.readSync(0, buffer, 0, 1, null);
    if (bytesRead === 0) break;

    const char = buffer.toString('utf8', 0, bytesRead);
    if (char === '\n') break;
    if (char !== '\r') line += char;
  }

  return line;
}

const tokenSpecs = [
  ['NUMBER', /^\d+(?:\.\d+)?/],
  ['STRING', /^"(?:\\.|[^"\\])*"/],
  ['LET', /^(?:let|maan|maan_ki|maana_ki|rakha)\b/],
  ['PRINT', /^(?:print|lekha|lekh|bol)\b/],
  ['IF', /^(?:if|yedi)\b/],
  ['ELIF', /^(?:elif|else_if|natra_yedi)\b/],
  ['THEN', /^(?:then|bhane|chabhane)\b/],
  ['ELSE', /^(?:else|natra)\b/],
  ['END', /^(?:end|sakiyo)\b/],
  ['WHILE', /^(?:while|jaba_samma)\b/],
  ['FOR', /^(?:for|pratek)\b/],
  ['IN', /^(?:in|bhitra)\b/],
  ['DO', /^(?:do|gara)\b/],
  ['BREAK', /^(?:break|rok)\b/],
  ['CONTINUE', /^(?:continue|arko)\b/],
  ['DEF', /^(?:def|kaam)\b/],
  ['RETURN', /^(?:return|firta)\b/],
  ['TRUE', /^(?:true|sahi)\b/],
  ['FALSE', /^(?:false|galat)\b/],
  ['NONE', /^(?:None|none|null|kehi_chaina)\b/],
  ['AND', /^(?:and|ra)\b/],
  ['OR', /^(?:or|wa)\b/],
  ['NOT', /^(?:not|haina)\b/],
  ['CMP', /^(?:==|!=|<=|>=|[><]|\bbarabar\b)/],
  ['OP', /^(?:\*\*|[+\-*/%])/],
  ['ASSIGN', /^(?:=|\bchai\b)/],
  ['IDENT', /^[a-zA-Z_]\w*/],
  ['LBRACKET', /^\[/],
  ['RBRACKET', /^\]/],
  ['LBRACE', /^\{/],
  ['RBRACE', /^\}/],
  ['LPAREN', /^\(/],
  ['RPAREN', /^\)/],
  ['COLON', /^:/],
  ['COMMA', /^,/],
  ['NEWLINE', /^\n/],
  ['SKIP', /^[ \t\r]+/],
  ['COMMENT', /^#.*/],
];

const tokenAliases = new Map([
  ['CMP:barabar', '=='],
  ['ASSIGN:chai', '='],
]);

function tokenize(code) {
  const tokens = [];
  let rest = code;
  let line = 1;
  let column = 1;

  while (rest.length > 0) {
    let matched = false;

    for (const [kind, regex] of tokenSpecs) {
      const match = rest.match(regex);
      if (!match) continue;

      const text = match[0];
      if (kind !== 'SKIP' && kind !== 'COMMENT') {
        tokens.push([kind, tokenAliases.get(`${kind}:${text}`) || text, line, column]);
      }
      for (const char of text) {
        if (char === '\n') {
          line += 1;
          column = 1;
        } else {
          column += 1;
        }
      }
      rest = rest.slice(text.length);
      matched = true;
      break;
    }

    if (!matched) {
      throw new SyntaxError(`Unknown character ${JSON.stringify(rest[0])} at ${line}:${column}`);
    }
  }

  tokens.push(['EOF', '', line, column]);
  return tokens;
}

function tokenLocation(token) {
  return `${token[2] || '?'}:${token[3] || '?'}`;
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos];
  }

  consume(kind) {
    const token = this.peek();
    if (kind && token[0] !== kind) {
      throw new SyntaxError(`Expected ${kind}, got ${token[0]} ${JSON.stringify(token[1])} at ${tokenLocation(token)}`);
    }
    this.pos += 1;
    return token;
  }

  parse() {
    const statements = [];
    while (this.peek()[0] !== 'EOF') {
      if (this.peek()[0] === 'NEWLINE') {
        this.consume('NEWLINE');
      } else {
        statements.push(this.parseStatement());
      }
    }
    return statements;
  }

  parseStatement() {
    const kind = this.peek()[0];
    if (kind === 'LET') return this.parseLet();
    if (kind === 'PRINT') return this.parsePrint();
    if (kind === 'IF') return this.parseIf();
    if (kind === 'WHILE') return this.parseWhile();
    if (kind === 'FOR') return this.parseFor();
    if (kind === 'BREAK') return this.parseBreak();
    if (kind === 'CONTINUE') return this.parseContinue();
    if (kind === 'DEF') return this.parseDef();
    if (kind === 'RETURN') return this.parseReturn();
    if (kind === 'IDENT' && this.isAssignmentStart()) return this.parseAssignment();
    return ['EXPR', this.parseExpression()];
  }

  parseLet() {
    this.consume('LET');
    const name = this.consume('IDENT')[1];
    this.consume('ASSIGN');
    return ['LET', name, this.parseExpression()];
  }

  isAssignmentStart() {
    let offset = 1;
    if (this.tokens[this.pos + offset]?.[0] === 'ASSIGN') return true;
    if (this.tokens[this.pos + offset]?.[0] !== 'LBRACKET') return false;

    let depth = 0;
    while (this.tokens[this.pos + offset]) {
      const kind = this.tokens[this.pos + offset][0];
      if (kind === 'LBRACKET') depth += 1;
      if (kind === 'RBRACKET') {
        depth -= 1;
        if (depth === 0) return this.tokens[this.pos + offset + 1]?.[0] === 'ASSIGN';
      }
      offset += 1;
    }
    return false;
  }

  parseAssignment() {
    const name = this.consume('IDENT')[1];
    let target = ['VAR', name];

    if (this.peek()[0] === 'LBRACKET') {
      this.consume('LBRACKET');
      target = ['INDEX', target, this.parseExpression()];
      this.consume('RBRACKET');
    }

    this.consume('ASSIGN');
    return ['SET', target, this.parseExpression()];
  }

  parsePrint() {
    this.consume('PRINT');
    return ['PRINT', this.parseExpression()];
  }

  parseIf() {
    this.consume('IF');
    const condition = this.parseExpression();
    this.consume('THEN');
    this.consumeNewlines();
    const body = this.parseBlock(new Set(['ELIF', 'ELSE', 'END']));
    let elseBody = [];

    if (this.peek()[0] === 'ELIF') {
      this.consume('ELIF');
      const elifCondition = this.parseExpression();
      this.consume('THEN');
      this.consumeNewlines();
      const elifBody = this.parseBlock(new Set(['ELIF', 'ELSE', 'END']));
      let elifElseBody = [];
      if (this.peek()[0] === 'ELIF') {
        elifElseBody = [this.parseElif()];
      } else if (this.peek()[0] === 'ELSE') {
        this.consume('ELSE');
        this.consumeNewlines();
        elifElseBody = this.parseBlock(new Set(['END']));
      }
      elseBody = [['IF', elifCondition, elifBody, elifElseBody]];
    } else if (this.peek()[0] === 'ELSE') {
      this.consume('ELSE');
      this.consumeNewlines();
      elseBody = this.parseBlock(new Set(['END']));
    }

    this.consume('END');
    return ['IF', condition, body, elseBody];
  }

  parseElif() {
    this.consume('ELIF');
    const condition = this.parseExpression();
    this.consume('THEN');
    this.consumeNewlines();
    const body = this.parseBlock(new Set(['ELIF', 'ELSE', 'END']));
    let elseBody = [];

    if (this.peek()[0] === 'ELIF') {
      elseBody = [this.parseElif()];
    } else if (this.peek()[0] === 'ELSE') {
      this.consume('ELSE');
      this.consumeNewlines();
      elseBody = this.parseBlock(new Set(['END']));
    }

    return ['IF', condition, body, elseBody];
  }

  parseWhile() {
    this.consume('WHILE');
    const condition = this.parseExpression();
    this.consume('DO');
    this.consumeNewlines();
    const body = this.parseBlock(new Set(['END']));
    this.consume('END');
    return ['WHILE', condition, body];
  }

  parseFor() {
    this.consume('FOR');
    const name = this.consume('IDENT')[1];
    this.consume('IN');
    const iterable = this.parseExpression();
    this.consume('DO');
    this.consumeNewlines();
    const body = this.parseBlock(new Set(['END']));
    this.consume('END');
    return ['FOR', name, iterable, body];
  }

  parseBreak() {
    this.consume('BREAK');
    return ['BREAK'];
  }

  parseContinue() {
    this.consume('CONTINUE');
    return ['CONTINUE'];
  }

  parseDef() {
    this.consume('DEF');
    const name = this.consume('IDENT')[1];
    this.consume('LPAREN');
    const params = [];

    if (this.peek()[0] !== 'RPAREN') {
      while (true) {
        params.push(this.consume('IDENT')[1]);
        if (this.peek()[0] !== 'COMMA') break;
        this.consume('COMMA');
      }
    }

    this.consume('RPAREN');
    this.consumeNewlines();
    const body = this.parseBlock(new Set(['END']));
    this.consume('END');
    return ['DEF', name, params, body];
  }

  parseReturn() {
    this.consume('RETURN');
    return ['RETURN', this.parseExpression()];
  }

  parseBlock(stopAt) {
    const statements = [];
    while (!stopAt.has(this.peek()[0]) && this.peek()[0] !== 'EOF') {
      if (this.peek()[0] === 'NEWLINE') {
        this.consume('NEWLINE');
      } else {
        statements.push(this.parseStatement());
      }
    }
    return statements;
  }

  consumeNewlines() {
    while (this.peek()[0] === 'NEWLINE') {
      this.consume('NEWLINE');
    }
  }

  parseExpression() {
    return this.parseOr();
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.peek()[0] === 'OR') {
      this.consume('OR');
      left = ['OR', left, this.parseAnd()];
    }
    return left;
  }

  parseAnd() {
    let left = this.parseEquality();
    while (this.peek()[0] === 'AND') {
      this.consume('AND');
      left = ['AND', left, this.parseEquality()];
    }
    return left;
  }

  parseEquality() {
    let left = this.parseComparison();
    while (this.peek()[0] === 'CMP' && ['==', '!='].includes(this.peek()[1])) {
      const op = this.consume('CMP')[1];
      left = ['CMP', op, left, this.parseComparison()];
    }
    return left;
  }

  parseComparison() {
    let left = this.parseTerm();
    while (this.peek()[0] === 'CMP' || this.peek()[0] === 'IN') {
      const op = this.peek()[0] === 'IN' ? 'in' : this.consume('CMP')[1];
      if (this.peek()[0] === 'IN') this.consume('IN');
      left = ['CMP', op, left, this.parseTerm()];
    }
    return left;
  }

  parseTerm() {
    let left = this.parseFactor();
    while (this.peek()[0] === 'OP' && ['+', '-'].includes(this.peek()[1])) {
      const op = this.consume('OP')[1];
      left = ['BINOP', op, left, this.parseFactor()];
    }
    return left;
  }

  parseFactor() {
    let left = this.parsePower();
    while (this.peek()[0] === 'OP' && ['*', '/', '%'].includes(this.peek()[1])) {
      const op = this.consume('OP')[1];
      left = ['BINOP', op, left, this.parsePower()];
    }
    return left;
  }

  parsePower() {
    const left = this.parseUnary();
    if (this.peek()[0] === 'OP' && this.peek()[1] === '**') {
      const op = this.consume('OP')[1];
      return ['BINOP', op, left, this.parsePower()];
    }
    return left;
  }

  parseUnary() {
    if (this.peek()[0] === 'NOT') {
      this.consume('NOT');
      return ['NOT', this.parseUnary()];
    }
    if (this.peek()[0] === 'OP' && this.peek()[1] === '-') {
      this.consume('OP');
      return ['NEG', this.parseUnary()];
    }
    return this.parsePostfix();
  }

  parsePostfix() {
    let expression = this.parsePrimary();
    while (this.peek()[0] === 'LBRACKET') {
      this.consume('LBRACKET');
      if (this.peek()[0] === 'COLON') {
        this.consume('COLON');
        const end = this.peek()[0] === 'RBRACKET' ? null : this.parseExpression();
        expression = ['SLICE', expression, null, end];
        this.consume('RBRACKET');
        continue;
      }

      const start = this.parseExpression();
      if (this.peek()[0] === 'COLON') {
        this.consume('COLON');
        const end = this.peek()[0] === 'RBRACKET' ? null : this.parseExpression();
        expression = ['SLICE', expression, start, end];
        this.consume('RBRACKET');
        continue;
      }

      expression = ['INDEX', expression, start];
      this.consume('RBRACKET');
    }
    return expression;
  }

  parsePrimary() {
    const [kind, value] = this.peek();

    if (kind === 'NUMBER') {
      this.consume('NUMBER');
      return ['NUM', Number(value)];
    }
    if (kind === 'STRING') {
      this.consume('STRING');
      return ['STR', JSON.parse(value)];
    }
    if (kind === 'TRUE') {
      this.consume('TRUE');
      return ['BOOL', true];
    }
    if (kind === 'FALSE') {
      this.consume('FALSE');
      return ['BOOL', false];
    }
    if (kind === 'NONE') {
      this.consume('NONE');
      return ['NONE', null];
    }
    if (kind === 'LBRACKET') {
      this.consume('LBRACKET');
      const items = [];
      if (this.peek()[0] !== 'RBRACKET') {
        while (true) {
          items.push(this.parseExpression());
          if (this.peek()[0] !== 'COMMA') break;
          this.consume('COMMA');
        }
      }
      this.consume('RBRACKET');
      return ['LIST', items];
    }
    if (kind === 'LBRACE') {
      this.consume('LBRACE');
      const entries = [];
      if (this.peek()[0] !== 'RBRACE') {
        while (true) {
          const key = this.parseExpression();
          this.consume('COLON');
          const entryValue = this.parseExpression();
          entries.push([key, entryValue]);
          if (this.peek()[0] !== 'COMMA') break;
          this.consume('COMMA');
        }
      }
      this.consume('RBRACE');
      return ['DICT', entries];
    }
    if (kind === 'IDENT') {
      this.consume('IDENT');
      if (this.peek()[0] === 'LPAREN') {
        return ['CALL', value, this.parseCallArgs()];
      }
      return ['VAR', value];
    }
    if (kind === 'LPAREN') {
      this.consume('LPAREN');
      const expression = this.parseExpression();
      this.consume('RPAREN');
      return expression;
    }

    throw new SyntaxError(`Unexpected token ${JSON.stringify(value)} at ${tokenLocation(this.peek())}`);
  }

  parseCallArgs() {
    this.consume('LPAREN');
    const args = [];

    if (this.peek()[0] !== 'RPAREN') {
      while (true) {
        args.push(this.parseExpression());
        if (this.peek()[0] !== 'COMMA') break;
        this.consume('COMMA');
      }
    }

    this.consume('RPAREN');
    return args;
  }
}

class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}

class BreakSignal {}

class ContinueSignal {}

function formatValue(value) {
  if (value === null) return 'None';
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;
  if (value instanceof Map) {
    return `{${[...value.entries()].map(([key, item]) => `${formatValue(key)}: ${formatValue(item)}`).join(', ')}}`;
  }
  return String(value);
}

function normalizeIndex(index, length, label = 'index') {
  if (!Number.isInteger(index)) {
    throw new TypeError(`${label} must be an integer`);
  }
  const normalized = index < 0 ? length + index : index;
  if (normalized < 0 || normalized >= length) {
    throw new RangeError(`${label} out of range`);
  }
  return normalized;
}

function normalizeSlicePart(value, length, fallback) {
  if (value === null || value === undefined) return fallback;
  if (!Number.isInteger(value)) throw new TypeError('slice index must be an integer');
  return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
}

function toNumber(value, name) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    throw new TypeError(`${name} could not convert value to number`);
  }
  return number;
}

function valueEquals(left, right) {
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => valueEquals(item, right[index]));
  }
  if (left instanceof Map && right instanceof Map) {
    if (left.size !== right.size) return false;
    for (const [key, value] of left.entries()) {
      if (!right.has(key) || !valueEquals(value, right.get(key))) return false;
    }
    return true;
  }
  return left === right;
}

function contains(container, item) {
  if (typeof container === 'string') return container.includes(String(item));
  if (Array.isArray(container)) return container.some((value) => valueEquals(value, item));
  if (container instanceof Map) return container.has(item);
  throw new TypeError('in / bhitra expected a string, list, or dictionary');
}

class Interpreter {
  constructor() {
    this.envStack = [{}];
    this.functions = {};
  }

  run(statements) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof ReturnValue) {
        throw new SyntaxError('firta / return can only be used inside a function');
      }
      if (error instanceof BreakSignal) {
        throw new SyntaxError('rok / break can only be used inside a loop');
      }
      if (error instanceof ContinueSignal) {
        throw new SyntaxError('arko / continue can only be used inside a loop');
      }
      throw error;
    }
  }

  execute(node) {
    const kind = node[0];

    if (kind === 'LET') {
      this.envStack[this.envStack.length - 1][node[1]] = this.evaluate(node[2]);
      return;
    }
    if (kind === 'SET') {
      this.assign(node[1], this.evaluate(node[2]));
      return;
    }
    if (kind === 'PRINT') {
      console.log(formatValue(this.evaluate(node[1])));
      return;
    }
    if (kind === 'IF') {
      const [, condition, body, elseBody] = node;
      this.executeBlock(this.evaluate(condition) ? body : elseBody);
      return;
    }
    if (kind === 'WHILE') {
      const [, condition, body] = node;
      while (this.evaluate(condition)) {
        try {
          this.executeBlock(body);
        } catch (error) {
          if (error instanceof BreakSignal) break;
          if (error instanceof ContinueSignal) continue;
          throw error;
        }
      }
      return;
    }
    if (kind === 'FOR') {
      const [, name, iterableExpression, body] = node;
      const iterable = this.evaluate(iterableExpression);
      if (!Array.isArray(iterable) && typeof iterable !== 'string') {
        throw new TypeError('for loop expected a list or string');
      }
      for (const item of iterable) {
        this.envStack[this.envStack.length - 1][name] = item;
        try {
          this.executeBlock(body);
        } catch (error) {
          if (error instanceof BreakSignal) break;
          if (error instanceof ContinueSignal) continue;
          throw error;
        }
      }
      return;
    }
    if (kind === 'BREAK') {
      throw new BreakSignal();
    }
    if (kind === 'CONTINUE') {
      throw new ContinueSignal();
    }
    if (kind === 'DEF') {
      const [, name, params, body] = node;
      this.functions[name] = [params, body];
      return;
    }
    if (kind === 'RETURN') {
      throw new ReturnValue(this.evaluate(node[1]));
    }
    if (kind === 'EXPR') {
      this.evaluate(node[1]);
      return;
    }

    throw new Error(`Unknown statement type: ${kind}`);
  }

  executeBlock(body) {
    for (const statement of body) {
      this.execute(statement);
    }
  }

  evaluate(node) {
    const kind = node[0];

    if (kind === 'NUM' || kind === 'STR' || kind === 'BOOL' || kind === 'NONE') return node[1];
    if (kind === 'VAR') return this.lookup(node[1]);
    if (kind === 'LIST') return node[1].map((item) => this.evaluate(item));
    if (kind === 'DICT') {
      return new Map(node[1].map(([key, value]) => [this.evaluate(key), this.evaluate(value)]));
    }
    if (kind === 'INDEX') {
      const target = this.evaluate(node[1]);
      const index = this.evaluate(node[2]);
      if (target instanceof Map) {
        if (!target.has(index)) throw new ReferenceError(`Dictionary key not found: ${formatValue(index)}`);
        return target.get(index);
      }
      if (typeof target !== 'string' && !Array.isArray(target)) {
        throw new TypeError('Indexing expected a list, string, or dictionary');
      }
      const normalizedIndex = normalizeIndex(index, target.length);
      return target[normalizedIndex];
    }
    if (kind === 'SLICE') {
      const target = this.evaluate(node[1]);
      if (typeof target !== 'string' && !Array.isArray(target)) {
        throw new TypeError('Slicing expected a list or string');
      }
      const start = normalizeSlicePart(node[2] === null ? null : this.evaluate(node[2]), target.length, 0);
      const end = normalizeSlicePart(node[3] === null ? null : this.evaluate(node[3]), target.length, target.length);
      return target.slice(start, end);
    }
    if (kind === 'NEG') return -this.evaluate(node[1]);
    if (kind === 'NOT') return !this.evaluate(node[1]);
    if (kind === 'AND') return this.evaluate(node[1]) && this.evaluate(node[2]);
    if (kind === 'OR') return this.evaluate(node[1]) || this.evaluate(node[2]);

    if (kind === 'BINOP') {
      const [, op, left, right] = node;
      const l = this.evaluate(left);
      const r = this.evaluate(right);

      if (op === '+') return typeof l === 'string' || typeof r === 'string' ? `${formatValue(l)}${formatValue(r)}` : l + r;
      if (op === '-') return l - r;
      if (op === '*') return l * r;
      if (op === '/') {
        if (r === 0) throw new RangeError('Cannot divide by zero');
        return l / r;
      }
      if (op === '%') {
        if (r === 0) throw new RangeError('Cannot divide by zero');
        return l % r;
      }
      if (op === '**') return l ** r;
    }

    if (kind === 'CMP') {
      const [, op, left, right] = node;
      const l = this.evaluate(left);
      const r = this.evaluate(right);

      if (op === '==') return valueEquals(l, r);
      if (op === '!=') return !valueEquals(l, r);
      if (op === 'in') return contains(r, l);
      if (op === '>') return l > r;
      if (op === '<') return l < r;
      if (op === '>=') return l >= r;
      if (op === '<=') return l <= r;
    }

    if (kind === 'CALL') {
      const [, name, args] = node;
      if (['print', 'lekha', 'lekh', 'bol'].includes(name)) {
        console.log(...args.map((arg) => formatValue(this.evaluate(arg))));
        return null;
      }
      if (['input', 'sodha'].includes(name)) {
        if (args.length > 1) {
          throw new TypeError(`${name} expected 0 or 1 arguments, got ${args.length}`);
        }
        const promptText = args.length === 1 ? this.evaluate(args[0]) : '';
        return readLineSync(promptText);
      }
      if (['number', 'ank'].includes(name)) {
        if (args.length !== 1) {
          throw new TypeError(`${name} expected 1 argument, got ${args.length}`);
        }
        return toNumber(this.evaluate(args[0]), name);
      }
      if (['int', 'purna'].includes(name)) {
        this.expectArgCount(name, args, 1);
        return Math.trunc(toNumber(this.evaluate(args[0]), name));
      }
      if (['float', 'dashamlab'].includes(name)) {
        this.expectArgCount(name, args, 1);
        return toNumber(this.evaluate(args[0]), name);
      }
      if (['str', 'sabda'].includes(name)) {
        this.expectArgCount(name, args, 1);
        return formatValue(this.evaluate(args[0]));
      }
      if (['bool', 'satya'].includes(name)) {
        this.expectArgCount(name, args, 1);
        return Boolean(this.evaluate(args[0]));
      }
      if (['len', 'lambai'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const value = this.evaluate(args[0]);
        if (typeof value !== 'string' && !Array.isArray(value) && !(value instanceof Map)) {
          throw new TypeError(`${name} expected a string, list, or dictionary`);
        }
        return value instanceof Map ? value.size : value.length;
      }
      if (['range', 'sima'].includes(name)) {
        if (args.length < 1 || args.length > 3) {
          throw new TypeError(`${name} expected 1 to 3 arguments, got ${args.length}`);
        }
        const values = args.map((arg) => toNumber(this.evaluate(arg), name));
        const [start, stop, step] = values.length === 1 ? [0, values[0], 1] : [values[0], values[1], values[2] ?? 1];
        if (step === 0) throw new TypeError(`${name} step cannot be 0`);
        const output = [];
        if (step > 0) {
          for (let value = start; value < stop; value += step) output.push(value);
        } else {
          for (let value = start; value > stop; value += step) output.push(value);
        }
        return output;
      }
      if (['append', 'thap'].includes(name)) {
        this.expectArgCount(name, args, 2);
        const list = this.evaluate(args[0]);
        if (!Array.isArray(list)) throw new TypeError(`${name} expected a list`);
        list.push(this.evaluate(args[1]));
        return list;
      }
      if (['pop', 'nikal'].includes(name)) {
        if (args.length < 1 || args.length > 2) {
          throw new TypeError(`${name} expected 1 or 2 arguments, got ${args.length}`);
        }
        const list = this.evaluate(args[0]);
        if (!Array.isArray(list)) throw new TypeError(`${name} expected a list`);
        if (args.length === 1) return list.pop();
        return list.splice(Number(this.evaluate(args[1])), 1)[0];
      }
      if (['type', 'prakaar'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const value = this.evaluate(args[0]);
        if (Array.isArray(value)) return 'list';
        if (value instanceof Map) return 'dict';
        if (value === null) return 'none';
        return typeof value;
      }
      if (['sum', 'jamma'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const list = this.expectNumberList(name, this.evaluate(args[0]));
        return list.reduce((total, value) => total + value, 0);
      }
      if (['min', 'sano'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const list = this.expectNonEmptyList(name, this.evaluate(args[0]));
        return Math.min(...list);
      }
      if (['max', 'thulo'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const list = this.expectNonEmptyList(name, this.evaluate(args[0]));
        return Math.max(...list);
      }
      if (['abs', 'nirapekshya'].includes(name)) {
        this.expectArgCount(name, args, 1);
        return Math.abs(toNumber(this.evaluate(args[0]), name));
      }
      if (['round', 'gol'].includes(name)) {
        if (args.length < 1 || args.length > 2) {
          throw new TypeError(`${name} expected 1 or 2 arguments, got ${args.length}`);
        }
        const value = toNumber(this.evaluate(args[0]), name);
        const places = args.length === 2 ? toNumber(this.evaluate(args[1]), name) : 0;
        const factor = 10 ** places;
        return Math.round(value * factor) / factor;
      }
      if (['sorted', 'milau'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const value = this.expectList(name, this.evaluate(args[0]));
        return [...value].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
      }
      if (['reverse', 'ulta'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const value = this.evaluate(args[0]);
        if (typeof value === 'string') return [...value].reverse().join('');
        return [...this.expectList(name, value)].reverse();
      }
      if (['keys', 'sachabi'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const dict = this.expectDict(name, this.evaluate(args[0]));
        return [...dict.keys()];
      }
      if (['values', 'manharu'].includes(name)) {
        this.expectArgCount(name, args, 1);
        const dict = this.expectDict(name, this.evaluate(args[0]));
        return [...dict.values()];
      }
      if (['has', 'cha'].includes(name)) {
        this.expectArgCount(name, args, 2);
        const dict = this.expectDict(name, this.evaluate(args[0]));
        return dict.has(this.evaluate(args[1]));
      }
      return this.callFunction(name, args);
    }

    throw new Error(`Unknown expression type: ${kind}`);
  }

  lookup(name) {
    for (let i = this.envStack.length - 1; i >= 0; i -= 1) {
      if (Object.prototype.hasOwnProperty.call(this.envStack[i], name)) {
        return this.envStack[i][name];
      }
    }
    throw new ReferenceError(`Undefined variable: ${name}`);
  }

  assign(target, value) {
    if (target[0] === 'VAR') {
      const name = target[1];
      for (let i = this.envStack.length - 1; i >= 0; i -= 1) {
        if (Object.prototype.hasOwnProperty.call(this.envStack[i], name)) {
          this.envStack[i][name] = value;
          return;
        }
      }
      this.envStack[this.envStack.length - 1][name] = value;
      return;
    }

    if (target[0] === 'INDEX') {
      const collection = this.evaluate(target[1]);
      const index = this.evaluate(target[2]);
      if (collection instanceof Map) {
        collection.set(index, value);
        return;
      }
      if (typeof collection === 'string') {
        throw new TypeError('String values cannot be changed by index');
      }
      if (!Array.isArray(collection)) {
        throw new TypeError('Index assignment expected a list');
      }
      collection[normalizeIndex(index, collection.length)] = value;
      return;
    }

    throw new Error('Invalid assignment target');
  }

  expectArgCount(name, args, expected) {
    if (args.length !== expected) {
      throw new TypeError(`${name} expected ${expected} argument${expected === 1 ? '' : 's'}, got ${args.length}`);
    }
  }

  expectList(name, value) {
    if (!Array.isArray(value)) throw new TypeError(`${name} expected a list`);
    return value;
  }

  expectNonEmptyList(name, value) {
    const list = this.expectList(name, value);
    if (list.length === 0) throw new TypeError(`${name} expected a non-empty list`);
    return list;
  }

  expectNumberList(name, value) {
    const list = this.expectList(name, value);
    if (!list.every((item) => typeof item === 'number')) {
      throw new TypeError(`${name} expected a list of numbers`);
    }
    return list;
  }

  expectDict(name, value) {
    if (!(value instanceof Map)) throw new TypeError(`${name} expected a dictionary`);
    return value;
  }

  callFunction(name, args) {
    if (!this.functions[name]) {
      throw new ReferenceError(`Undefined function: ${name}`);
    }

    const [params, body] = this.functions[name];
    if (args.length !== params.length) {
      throw new TypeError(`${name} expected ${params.length} arguments, got ${args.length}`);
    }

    const frame = {};
    params.forEach((param, index) => {
      frame[param] = this.evaluate(args[index]);
    });

    this.envStack.push(frame);
    try {
      this.executeBlock(body);
    } catch (error) {
      this.envStack.pop();
      if (error instanceof ReturnValue) return error.value;
      throw error;
    }
    this.envStack.pop();
    return null;
  }
}

function runFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const tokens = tokenize(code);
  const ast = new Parser(tokens).parse();
  new Interpreter().run(ast);
}

if (require.main === module) {
  const [, , commandOrFile, maybeFile] = process.argv;
  const filePath = commandOrFile === 'run' ? maybeFile : commandOrFile;

  if (!filePath) {
    console.error('Usage: aayush run path/to/file.aayush');
    process.exit(1);
  }

  try {
    runFile(filePath);
  } catch (error) {
    console.error(`Aayush error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { tokenize, Parser, Interpreter, runFile };

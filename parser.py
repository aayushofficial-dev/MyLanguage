class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def peek(self):
        return self.tokens[self.pos]

    def consume(self, kind=None):
        tok = self.peek()
        if kind and tok[0] != kind:
            raise SyntaxError(f"Expected {kind}, got {tok}")
        self.pos += 1
        return tok

    def parse(self):
        stmts = []
        while self.peek()[0] != 'EOF':
            if self.peek()[0] == 'NEWLINE':
                self.consume('NEWLINE')
                continue
            stmts.append(self.parse_stmt())
        return stmts

    def parse_stmt(self):
        kind, _ = self.peek()
        if kind == 'LET':
            return self.parse_let()
        if kind == 'PRINT':
            return self.parse_print()
        if kind == 'IF':
            return self.parse_if()
        if kind == 'WHILE':
            return self.parse_while()
        if kind == 'DEF':
            return self.parse_def()
        if kind == 'RETURN':
            return self.parse_return()
        return self.parse_expr_stmt()

    def parse_let(self):
        self.consume('LET')
        name = self.consume('IDENT')[1]
        self.consume('ASSIGN')
        expr = self.parse_expr()
        return ('LET', name, expr)

    def parse_print(self):
        self.consume('PRINT')
        expr = self.parse_expr()
        return ('PRINT', expr)

    def parse_if(self):
        self.consume('IF')
        condition = self.parse_expr()
        self.consume('THEN')
        self.consume_newlines()
        body = self.parse_block(stop_at={'ELSE', 'END'})
        else_body = []
        if self.peek()[0] == 'ELSE':
            self.consume('ELSE')
            self.consume_newlines()
            else_body = self.parse_block(stop_at={'END'})
        self.consume('END')
        return ('IF', condition, body, else_body)

    def parse_while(self):
        self.consume('WHILE')
        condition = self.parse_expr()
        self.consume('DO')
        self.consume_newlines()
        body = self.parse_block(stop_at={'END'})
        self.consume('END')
        return ('WHILE', condition, body)

    def parse_def(self):
        self.consume('DEF')
        name = self.consume('IDENT')[1]
        self.consume('LPAREN')
        params = []
        if self.peek()[0] != 'RPAREN':
            while True:
                params.append(self.consume('IDENT')[1])
                if self.peek()[0] == 'COMMA':
                    self.consume('COMMA')
                    continue
                break
        self.consume('RPAREN')
        self.consume_newlines()
        body = self.parse_block(stop_at={'END'})
        self.consume('END')
        return ('DEF', name, params, body)

    def parse_return(self):
        self.consume('RETURN')
        expr = self.parse_expr()
        return ('RETURN', expr)

    def parse_expr_stmt(self):
        expr = self.parse_expr()
        return ('EXPR', expr)

    def parse_block(self, stop_at):
        stmts = []
        while self.peek()[0] not in stop_at and self.peek()[0] != 'EOF':
            if self.peek()[0] == 'NEWLINE':
                self.consume('NEWLINE')
                continue
            stmts.append(self.parse_stmt())
        return stmts

    def consume_newlines(self):
        while self.peek()[0] == 'NEWLINE':
            self.consume('NEWLINE')

    def parse_expr(self):
        return self.parse_or()

    def parse_or(self):
        left = self.parse_and()
        while self.peek()[0] == 'OR':
            self.consume('OR')
            right = self.parse_and()
            left = ('OR', left, right)
        return left

    def parse_and(self):
        left = self.parse_equality()
        while self.peek()[0] == 'AND':
            self.consume('AND')
            right = self.parse_equality()
            left = ('AND', left, right)
        return left

    def parse_equality(self):
        left = self.parse_comparison()
        while self.peek()[0] == 'CMP' and self.peek()[1] in ('==', '!='):
            op = self.consume('CMP')[1]
            right = self.parse_comparison()
            left = ('CMP', op, left, right)
        return left

    def parse_comparison(self):
        left = self.parse_term()
        while self.peek()[0] == 'CMP':
            op = self.consume('CMP')[1]
            right = self.parse_term()
            left = ('CMP', op, left, right)
        return left

    def parse_term(self):
        left = self.parse_factor()
        while self.peek()[0] == 'OP' and self.peek()[1] in ('+', '-'):
            op = self.consume('OP')[1]
            right = self.parse_factor()
            left = ('BINOP', op, left, right)
        return left

    def parse_factor(self):
        left = self.parse_unary()
        while self.peek()[0] == 'OP' and self.peek()[1] in ('*', '/'):
            op = self.consume('OP')[1]
            right = self.parse_unary()
            left = ('BINOP', op, left, right)
        return left

    def parse_unary(self):
        if self.peek()[0] == 'NOT':
            self.consume('NOT')
            return ('NOT', self.parse_unary())
        if self.peek()[0] == 'OP' and self.peek()[1] == '-':
            self.consume('OP')
            return ('NEG', self.parse_unary())
        return self.parse_primary()

    def parse_primary(self):
        kind, val = self.peek()
        if kind == 'NUMBER':
            self.consume('NUMBER')
            return ('NUM', int(val))
        if kind == 'STRING':
            self.consume('STRING')
            return ('STR', val[1:-1])
        if kind == 'TRUE':
            self.consume('TRUE')
            return ('BOOL', True)
        if kind == 'FALSE':
            self.consume('FALSE')
            return ('BOOL', False)
        if kind == 'IDENT':
            self.consume('IDENT')
            if self.peek()[0] == 'LPAREN':
                args = self.parse_call_args()
                return ('CALL', val, args)
            return ('VAR', val)
        if kind == 'LPAREN':
            self.consume('LPAREN')
            expr = self.parse_expr()
            self.consume('RPAREN')
            return expr
        raise SyntaxError(f"Unexpected: {val}")

    def parse_call_args(self):
        self.consume('LPAREN')
        args = []
        if self.peek()[0] != 'RPAREN':
            while True:
                args.append(self.parse_expr())
                if self.peek()[0] == 'COMMA':
                    self.consume('COMMA')
                    continue
                break
        self.consume('RPAREN')
        return args

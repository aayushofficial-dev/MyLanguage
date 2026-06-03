class ReturnException(Exception):
    def __init__(self, value):
        self.value = value


class Interpreter:
    def __init__(self):
        self.env_stack = [{}]
        self.functions = {}

    def run(self, stmts):
        for stmt in stmts:
            self.exec(stmt)

    def exec(self, node):
        kind = node[0]
        if kind == 'LET':
            _, name, expr = node
            self.env_stack[-1][name] = self.eval(expr)
        elif kind == 'PRINT':
            print(self.eval(node[1]))
        elif kind == 'IF':
            _, condition, body, else_body = node
            if self.eval(condition):
                self.exec_block(body)
            elif else_body:
                self.exec_block(else_body)
        elif kind == 'WHILE':
            _, condition, body = node
            while self.eval(condition):
                self.exec_block(body)
        elif kind == 'DEF':
            _, name, params, body = node
            self.functions[name] = (params, body)
        elif kind == 'RETURN':
            _, expr = node
            raise ReturnException(self.eval(expr))
        elif kind == 'EXPR':
            self.eval(node[1])
        else:
            raise RuntimeError(f"Unknown statement type: {kind}")

    def exec_block(self, body):
        for stmt in body:
            self.exec(stmt)

    def eval(self, node):
        kind = node[0]
        if kind == 'NUM':
            return node[1]
        if kind == 'STR':
            return node[1]
        if kind == 'BOOL':
            return node[1]
        if kind == 'VAR':
            return self.lookup(node[1])
        if kind == 'BINOP':
            _, op, left, right = node
            l = self.eval(left)
            r = self.eval(right)
            if op == '+':
                if isinstance(l, str) or isinstance(r, str):
                    return str(l) + str(r)
                return l + r
            if op == '-':
                return l - r
            if op == '*':
                return l * r
            if op == '/':
                return l / r
        if kind == 'CMP':
            _, op, left, right = node
            l = self.eval(left)
            r = self.eval(right)
            if op == '==':
                return l == r
            if op == '!=':
                return l != r
            if op == '>':
                return l > r
            if op == '<':
                return l < r
            if op == '>=':
                return l >= r
            if op == '<=':
                return l <= r
        if kind == 'AND':
            _, left, right = node
            return self.eval(left) and self.eval(right)
        if kind == 'OR':
            _, left, right = node
            return self.eval(left) or self.eval(right)
        if kind == 'NOT':
            return not self.eval(node[1])
        if kind == 'NEG':
            return -self.eval(node[1])
        if kind == 'CALL':
            _, name, args = node
            if name in ('print', 'lekha', 'lekh', 'bol'):
                values = [self.eval(arg) for arg in args]
                print(*values)
                return None
            return self.call_function(name, args)
        raise RuntimeError(f"Unknown expression type: {kind}")

    def lookup(self, name):
        for env in reversed(self.env_stack):
            if name in env:
                return env[name]
        raise NameError(f"Undefined variable: {name}")

    def call_function(self, name, args):
        if name not in self.functions:
            raise NameError(f"Undefined function: {name}")
        params, body = self.functions[name]
        if len(args) != len(params):
            raise TypeError(f"{name} expected {len(params)} arguments, got {len(args)}")
        values = [self.eval(arg) for arg in args]
        frame = dict(zip(params, values))
        self.env_stack.append(frame)
        try:
            self.exec_block(body)
        except ReturnException as ret:
            self.env_stack.pop()
            return ret.value
        self.env_stack.pop()
        return None

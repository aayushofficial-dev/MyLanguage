import re

TOKENS = [
    ('NUMBER',   r'\d+'),
    ('STRING',   r'"[^"]*"'),
    ('LET',      r'\b(?:let|maan|maana_ki|rakha)\b'),
    ('PRINT',    r'\b(?:print|lekha|lekh|bol)\b'),
    ('IF',       r'\b(?:if|yedi)\b'),
    ('THEN',     r'\b(?:then|bhane|chabhane)\b'),
    ('ELSE',     r'\b(?:else|natra)\b'),
    ('END',      r'\b(?:end|sakiyo)\b'),
    ('WHILE',    r'\b(?:while|jaba_samma)\b'),
    ('DO',       r'\b(?:do|gara)\b'),
    ('DEF',      r'\b(?:def|kaam)\b'),
    ('RETURN',   r'\b(?:return|firta)\b'),
    ('TRUE',     r'\b(?:true|sahi)\b'),
    ('FALSE',    r'\b(?:false|galat)\b'),
    ('AND',      r'\b(?:and|ra)\b'),
    ('OR',       r'\b(?:or|wa)\b'),
    ('NOT',      r'\b(?:not|haina)\b'),
    ('CMP',      r'==|!=|<=|>=|[><]|\bbarabar\b'),
    ('OP',       r'[+\-*/]'),
    ('ASSIGN',   r'=|\bchai\b'),
    ('IDENT',    r'[a-zA-Z_]\w*'),
    ('LPAREN',   r'\('),
    ('RPAREN',   r'\)'),
    ('COMMA',    r','),
    ('NEWLINE',  r'\n'),
    ('SKIP',     r'[ \t]+'),
    ('COMMENT',  r'#.*'),
]

COMPILED = [(kind, re.compile(pattern)) for kind, pattern in TOKENS]

TOKEN_ALIASES = {
    ('CMP', 'barabar'): '==',
    ('ASSIGN', 'chai'): '=',
}


def tokenize(code):
    tokens = []
    pos = 0
    while pos < len(code):
        match = None
        for kind, regex in COMPILED:
            match = regex.match(code, pos)
            if match:
                text = match.group(0)
                if kind not in ('SKIP', 'COMMENT'):
                    text = TOKEN_ALIASES.get((kind, text), text)
                    tokens.append((kind, text))
                pos = match.end()
                break
        if not match:
            raise SyntaxError(f"Unknown character: {code[pos]!r}")
    tokens.append(('EOF', ''))
    return tokens

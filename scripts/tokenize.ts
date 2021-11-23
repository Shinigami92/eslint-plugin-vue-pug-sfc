import lex from 'pug-lexer';

const tokens: lex.Token[] = lex('| {{a b c}}');

tokens.forEach((token) => console.log(JSON.stringify(token)));

export interface Operation {
    value: string;
    action?: Action;
    bracket?: Bracket;
}
  
export const enum Action {
    ADD = '+',
    MINUS = '-',
    MULTIPLY = 'x',
    DIVIDE = '/',
    DOT = '.',
}
  
export const enum Bracket {
    OPEN = '(',
    CLOSE = ')',
}



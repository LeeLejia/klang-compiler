export enum TokenType {
  Brace = 'Brace',
  Number = 'Number',
  String = 'String',
  Boolean = 'Boolean',
  Symbol = 'Symbol',
  Keyword = 'Keyword',
  Annotation = 'Annotation'
}
export type Token = { type: TokenType, val: string }
class CharTool {
  static isDigit(c: string): boolean {
    return c.length === 1 && '0987654321'.indexOf(c) !== - 1
  }
  static isLetter(c: string): boolean {
    const letter = c.toLowerCase()
    return c.length === 1 && 'qwertyuiopasdfghjklzxcvbnm'.indexOf(letter) !== - 1
  }
  static isQuotation(c: string): boolean {
    return c === '"'
  }
  static isDot(c: string): boolean {
    return c === '.'
  }
  static Brace(c: string): boolean {
    return c === '{' || c === '}'
  }
  static isSpace(c: string): boolean {
    return /^\s+$/.test(c)
  }
  static isLeftRail(c: string): boolean {
    return c === '/'
  }
  static isRightRail(c: string): boolean {
    return c === '\\'
  }
  static isMidLine(c: string): boolean {
    return c === '-'
  }
  static isBottomLine(c: string): boolean {
    return c === '_'
  }
  static isStarChar(c: string): boolean {
    return c === '*'
  }
  static isSymbol(c: string): boolean {
    return c.length === 1 && '.:'.indexOf(c) !== -1
  }
  static isNewLine(c: string): boolean {
    return c === '\n'
  }
}

export class TokenStream {
  tokens: Token[] = []
  str: string
  offset: number = 0
  constructor(str: string) {
    this.str = str
  }
  // 是否数字
  isNumber(): boolean {
    let start = this.offset
    let chr: string
    let check: boolean
    do {
      chr = this.str[this.offset]
      check = CharTool.isDigit(chr) || CharTool.isDot(chr)
      if (check) {
        this.offset++
      }
    } while (check && this.offset < this.str.length)
    const slc = this.str.slice(start, this.offset)
    const result = /^[1-9]\d*(\.\d+)?$/.test(slc)
    if (result) {
      this.tokens.push({
        type: TokenType.Number,
        val: slc
      })
    } else {
      this.offset = start
    }
    return result
  }

  // 是否字符串
  isString(): boolean {
    let start = this.offset
    const chr = this.str[start]
    const isquotation = CharTool.isQuotation(chr)
    if (!isquotation) {
      return false
    }
    let flag = false
    for (this.offset++; this.offset < this.str.length; this.offset++) {
      let chr = this.str[this.offset]
      if (CharTool.isQuotation(chr) && !flag) {
        this.offset++
        const slc = this.str.slice(start + 1, this.offset - 1)
        this.tokens.push({
          type: TokenType.String,
          val: slc.replace('\"', '"')
        })
        return true
      }
      if (CharTool.isRightRail(chr)) {
        flag = !flag
      } else {
        flag = false
      }
    }
    return false
  }

  // 左花括号
  isBrace(): boolean {
    const chr = this.str[this.offset]
    const check = CharTool.Brace(chr)
    if (check) {
      this.offset++
      this.tokens.push({
        type: TokenType.Brace,
        val: chr
      })
    }
    return check
  }

  // 点
  isSymbol(): boolean {
    const chr = this.str[this.offset]
    if (CharTool.isSymbol(chr)) {
      this.tokens.push({
        type: TokenType.Symbol,
        val: chr
      })
      this.offset++
      return true
    }
    return false
  }

  // 关键字
  isKeyword(): boolean {
    const start = this.offset
    let chr = this.str[this.offset]
    let check = CharTool.isLetter(chr)
    if (!check)
      return false
    for (this.offset++; this.offset < this.str.length; this.offset++) {
      chr = this.str[this.offset]
      check = CharTool.isDigit(chr) || CharTool.isLetter(chr) || CharTool.isMidLine(chr) || CharTool.isBottomLine(chr)
      if (!check) {
        const slc = this.str.slice(start, this.offset)
        this.tokens.push({
          type: TokenType.Keyword,
          val: slc
        })
        return true
      }
    }
    return true
  }

  // 擦除空格
  erasureSpace(): boolean {
    for (let flag = false; this.offset < this.str.length; this.offset++) {
      let chr: string = this.str[this.offset]
      const check = CharTool.isSpace(chr)
      if (!check) {
        return flag
      } else if (!flag) {
        flag = true
      }
    }
    return true
  }

  // 布尔型
  isBool(): boolean {
    const slc = this.str.slice(this.offset, 5)
    if (slc.startsWith('true')) {
      this.tokens.push({
        type: TokenType.Boolean,
        val: 'true'
      })
      this.offset += 4
      return true
    } else if (slc.startsWith('false')) {
      this.tokens.push({
        type: TokenType.Boolean,
        val: 'false'
      })
      this.offset += 5
      return true
    }
    return false
  }

  // 注释
  isAnnotation(): boolean {
    let chr: string = this.str[this.offset]
    if (!CharTool.isLeftRail(chr)) {
      return false
    }
    const start = this.offset
    this.offset++
    chr = this.str[this.offset]
    // 单行注释
    if (CharTool.isLeftRail(chr)) {
      do {
        this.offset++
        chr = this.str[this.offset]
        if (CharTool.isNewLine(chr)) {
          const slc = this.str.slice(start, this.offset++)
          this.tokens.push({
            type: TokenType.Annotation,
            val: slc
          })
          return true
        }
      } while (this.offset < this.str.length)
      this.offset = start
      return false
    }
    // 多行注释
    if (CharTool.isStarChar(chr)) {
      do {
        this.offset++
        chr = this.str[this.offset]
        if (CharTool.isStarChar(chr)) {
          this.offset++
          chr = this.str[this.offset]
          if (CharTool.isLeftRail(chr)) {
            const slc = this.str.slice(start, ++this.offset)
            this.tokens.push({
              type: TokenType.Annotation,
              val: slc
            })
            return true
          }
        }
      } while (this.offset < this.str.length)
      this.offset = start
      return false
    }
    this.offset = start
    return false
  }

  parse(): Token[] {
    this.offset = 0
    while (this.offset < this.str.length) {
      const check = this.erasureSpace()
        || this.isNumber()
        || this.isString()
        || this.isBrace()
        || this.isSymbol()
        || this.isAnnotation()
        || this.isBool()
        || this.isKeyword()
      if (!check) {
        this.offset++
        // throw new Error('complie error')
      }
    }
    return this.tokens
  }
}
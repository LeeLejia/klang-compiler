import { SyntaxParser } from './syntax'
let testStr = `
section.class1.class2 {

  attr1: "字符串属性"
  
  attr2: 123.456
  
  text .top.colours {
  content: "居上彩色字体"
  
  }
  img.fitwidth.autoplay {
  url: "www.baidu.com"
  
  }
  }
`
const syntaxParser = new SyntaxParser(testStr)

const sections = syntaxParser.parse()
console.log(JSON.stringify(sections))
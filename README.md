# klang-compiler
keynoteLang compiler.

## klang定义

klang定义一个树结构，包括节点名，属性，类型列表，子树序列


<p style="color:green">// klang 节点例子</p>
<b style="color:yellow">section</b><span style="color:gray;font-size: 12px">.class1.class2</span> <span style="gray">\{
  <p style="color: green">attr1: "字符串属性"</p>
  <p style="color: green">attr2: 123.456</p>
  <div style="margin-left: 10px;">
    <b style="color:yellow">text</b>
    <span style="color:gray;font-size: 12px">.top.colours</span>     <span style="gray">{
  <p style="color: green"> content: "居上彩色字体"</p>
  }</span>
  </div>
  <div style="margin-left: 10px;">
    <b style="color:yellow">img</b><span style="color:gray;font-size: 12px">.fitwidth.autoplay</span>     <span style="gray">{
  <p style="color: green"> url: "www.baidu.com"</p>
  }</span>
  </div>
}</span>

## 编译结果为

```json
[
    {
        "name": "section",
        "classList": [
            "class1",
            "class2"
        ],
        "attributes": [
            {
                "key": "attr1",
                "type": "String",
                "val": "字符串属性"
            },
            {
                "key": "attr2",
                "type": "Number",
                "val": "123.456"
            }
        ],
        "childNodes": [
            {
                "name": "text",
                "classList": [
                    "top",
                    "colours"
                ],
                "attributes": [
                    {
                        "key": "content",
                        "type": "String",
                        "val": "居上彩色字体"
                    }
                ],
                "childNodes": []
            },
            {
                "name": "img",
                "classList": [
                    "fitwidth",
                    "autoplay"
                ],
                "attributes": [
                    {
                        "key": "url",
                        "type": "String",
                        "val": "www.baidu.com"
                    }
                ],
                "childNodes": []
            }
        ]
    }
]
```
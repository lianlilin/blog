# 基础知识
## token
pieces of words

## prompt
一段文本或者语句，用于指导机器学习模型生成特定类型、主题或格式的输出

## context
是模型可以用来生成更准确和相关文本的附加信息

## temperature 和 top_p
top_p决定产生的文本的丰富度，概率累加形成候选集，temperature解决随机性的问题，

## simple prompt
模型的基础支持足够或者任务足够简单

## prompt with context
虽然需要补充信息，但是可以依赖模型的能力完成特定的任务

## instrution turning

需要准备做ft，并且部署新的模型

# prompt模式

## prompt要素
- 目标：目标决定了提问框架
  - 
- 上下文
- 输入
## 技巧
- 界定符"""，占位符<{{test1}}>
- 围栏
  - 不要干什么
  - 要干什么
- 角色
  - 擅长领域 + 做事原则 + 行为规范
- 示例
- COT
  - 一般用于复杂的问题
  - 思维链
# 产品
## 交互方式
- 能否抽象成结构化的输入输出
- 根据媒体类型抽象交互方式
- 对齐直觉，同时也对齐便捷
## 上下文管理
- session是一棵树
- context是里面的一个path
- 压缩
## system setting
角色、围栏、风格，放在prompt和system setting中是不一样的，放在prompt中可能会忘掉自己是谁。

产品设计上外显system setting

## 评价
- 质量
- 稳定性
- token数
- 性能
- prompt following
# 修行
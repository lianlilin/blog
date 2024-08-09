# 背景


# 方法1：修改hosts文件

- 打开[dns查询工具](https://tool.chinaz.com/dns/github.com)
    - dns查询tab
    - 高级选项->记录类型选择A
- 底部DNS查询详情选择按照TTL排序
- 找到TTL较小且解析延迟也很小的的IP配置在hosts文件内，将github.com解析到该ip

```
20.205.243.166  github.com
```

# 方法2：github520

GitHub520 就是一个帮助大家访问 GitHub 的项目，本质也是通过修改 hosts 来实现的。

该项目的作者为大家提供了一份完整的 hosts 列表，无需大家自己查询可用 IP，非常地贴心，而且每天都会更新！

[项目地址>>](https://github.com/521xueweihan/GitHub520?tab=readme-ov-file)
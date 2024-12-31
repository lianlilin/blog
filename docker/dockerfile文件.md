# dockerfile 是干什么的

有点像编译脚本文件，把要执行的命令按照一定的格式写在 dockerfile 文件中，去完成定制版 docker 镜像的操作。

# 一个 dockerfile 文件示例

```
FROM nginx:latest
RUN apt-get update && \
    apt-get install -y vim
```

- FROM 表示从 dockerhub 上拉取的镜像名称和 Tag 标识
- RUN 执行的命令
- \表示换行，防止命令太长

创建的镜像的命令

```
docker image build -t 镜像名称:镜像tag标识 .
```

- -t 表示镜像名称及 Tag 标识，如果不设置，默认是 latest
- 最后的`.`也是命令的一部分

## 命令最后的`.`

1. 构建镜像时打包上传到 dockery 引擎中的文件目录
2. xxx
3. 一般会创建一个干净的目录来构建镜像

# ADD 与 COPY 指令

用于将宿主机的文件复制到镜像中

```
ADD 宿主机目录或者文件路径 镜像中的路径
COPY 宿主机目录或者文件路径 镜像中的路径
```

这是一个例子

```sh
# 将宿主机“dockerfile文件所在目录下的default.conf文件”复制到镜像的/etc/nginx/conf.d/目录中
COPY default.conf /etc/nginx/conf.d/
```

## ADD 和 COPY 的区别

1. ADD 支持从远程 URL 复制内容
2. ADD 支持自动解压缩到镜像中，COPY 只是单纯的复制到镜像中

虽然如此，一般还是使用 COPY，避免意外的解压缩行为。

# WORKDIR

进入目录，类似于 cd 命令，目录不存在会自动创建该目录

```shell
WORKDIR 路径
```

以下是个例子

```shell
# 进入/test目录，如果/test目录不存在，则创建这个目录。
WORKDIR /test
```

# ARG 与 ENV

这两都是用来设置变量的，可以通过`${变量名}`来引用。

```shell
ARG 变量名=变量值
ENV 变量名=变量值
```

等号前后不能有空格！！！，下面是个例子

```shell
ARG NEW_DIR=/test_arg
ENV NEW_DIR=/test_env
```

然后在 dockerfile 中可以这样使用

```shell
ARG NEW_DIR=/test_argWORKDIR $NEW_DIR
```

## ARG 和 ENV 的区别

1. ENV 适合与项目程序代码互动，会作为系统环境变量保存到镜像中
2. ARG 适合与 docker 命令互动，ARG 的值可以接受来自 docker 命令中传递的参数值

假设 dockerfile 如下

```shell
FROM ubuntu:latestARG
NEW_DIR=/test_arg
WORKDIR $NEW_DIR
```

执行命令

```shell
docker image build -t hello --build-arg NEW_DIR=/test_cli .
```

命令行传递的参数会覆盖 dockerfile 中 ARG 的定义。三种参数传递方法优先级为：

ENV > --build-arg > ARG

# CMD 命令

cmd 命令也是让容器执行命令。

## CMD 与 RUN 的区别

1. RUN 是针对镜像的操作，造成的改变会生效于镜像，适合安装、更新系统软件等场景
2. CMD 是容器启动后对容器的操作，适合执行具体的业务脚本
3. dockerfile 中可以有多个 RUN 命令
4. dockerfile 中如果有多个 cmd 命令，只有最后一个会起作用
5. 如果在 docker container run 命令中指定了要运行的命令，则 dockerfile 中的命令被忽略

# ENTRYPOINT

ENTRYPOINT 同样可以设置容器启动时要执行的命令

## ENTRYPOINT 与 CMD 的区别

1. ENTRYPOINT 可以设置的命令一定会被执行，不会被覆盖。如果在 docker container run 命令中添加了要执行的命令，则会在 ENTRYPOINT 设置的命令执行后再追加执行
2. ENTRYPOINT 可以接收来自 docker container run 命令传递的参数

# HEALTHCHECK 健康检查

```sh
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \    CMD curl -f http://localhost || exit 1
```

以上的效果是：每隔 30 秒（--interval=30s）访问一次 http://localhost，如果连续三次（--retries=3）3 秒访问超时（--timeout=3s ），则退出并返回 1。请确保镜像中已经安装了 curl。如果没有安装 curl，需要在 Dockerfile 的 RUN 命令中安装 curl。

# EXPOSE

用于声明了容器的哪些端口是将要开放的。实际上，EXPOSE 并没有开放端口的作用，它只是文档性质的说明，方便 dockerfile 的使用者阅读。真正用于建立宿主机和容器端口映射关系的，还是`docker container run`命令的-p 参数。

# VOLUME

设置容器的持久化数据卷。

```sh
VOLUME ["容器中的路径"]
```

在 dockerfile 中无法实现通过 docker container run 命令的-v D:/docker-www:/usr/share/nginx/html，实现了将容器/usr/share/nginx/html 目录挂载到宿主机 D:/docker-www 目录上。

# 镜像操作

本质上还是增删改查，按照这个思路去记。

## 拉取镜像——增

```
docker image pull 镜像名称:Tag标识
```

Tag 标识用来指定版本，默认为 latest。执行时会先检查本地镜像是否存在，不存在就从 dockerHub 上拉取。

执行`docker container run`的时候，docker 其实已经默默先执行`docker image pull`。

## 列出镜像——查

```
docker image ls
```

列出已经拉取的镜像

## 删除镜像——删

```
docker image rm 镜像ID
```

如果有容器正在使用这个镜像，则无法删除。

[docker image rm](https://docs.docker.com/reference/cli/docker/image/rm/)

## 导出与加载镜像

```
docker image save 镜像ID -o 导出的文件名
```

会在`执行命令的目录`生成对应的文件，把这个文件拷贝到要安装这个镜像的机器上执行

```
docker image load -i 镜像文件名
```

[docker image load](https://docs.docker.com/reference/cli/docker/image/load/)

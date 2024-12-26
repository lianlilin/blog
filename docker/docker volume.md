# 挂载数据持久化

```
docker container run -d --name docker-demo-www-dev -p 81:80 -v D:/docker-www:/usr/share/nginx/html nginx
```

这种方式是挂载到明确的宿主机路径，适用于各种操作系统，比较常用。

还有一种`只设定volume名称，但是不指定具体的宿主机路径`。

```
docker container run -d --name 容器名称 -v volume名称:容器目录 容器名称
```

这种不指定具体的宿主机路径的方式所挂载的 volume 到底在哪里？执行

```
docker volume ls
```

列出所有 volume。

```
DRIVER    VOLUME NAME
local     volume-nginx-www
```

然后执行

```
docker volume inspect volume名称
```

就可以看到这样的信息

```
[
    {
        "CreatedAt": "2024-12-26T02:59:06Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/volume-nginx-www/_data",
        "Name": "volume-nginx-www",
        "Options": null,
        "Scope": "local"
    }
]
```

这里需要注意的是，在 mac 上这个`Mountpoint`并不是一个实际宿主机存在的地址，需要通过 Docker Desktop 去查看。

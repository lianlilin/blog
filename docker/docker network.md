# Docker Network

[官方文档](https://docs.docker.com/network/)

docker 容器每次重启后 ip 是会发生变化的，如果容器之间使用 ip 地址进行通信，一旦容器被重启，这个容器可能就访问不到了。docker network 就是用来解决这个问题的。具体来说

1. 容器之间的互联和通信以及端口映射
2. 自带 DNS 解析，容器间可以通过容器名称直接通信，不使用 ip

在同一个 docker 网络下的容器，就像在同一个局域网里。

## docker network 的驱动模式

- bridge: 默认模式，最常用
- host: 直接使用宿主机的网络，共用宿主机的端口
- none: 没有网络的容器

除此之外，还有 overlay、ipvlan、macvlan 驱动模式，一般很少用到。

## 查看容器的网络配置

```sh
docker container inspect docker-myweb
```

执行这个命令打印出的 NetworkSettings 部分

## 常用的 docker network 命令

增

```sh
docker network create -d 驱动模式 自定义网络名称
```

删

```sh
docker network rm 网络ID或网络名称
```

查

```sh
docker network inspect 网络ID或网络名称
```

## 容器接入网络

设置网络链接

```sh
docker network connect 网络ID或网络名称 容器ID或容器名称
```

断开网络链接

```sh
docker network disconnect 网络ID或网络名称 容器ID或容器名称
```

创建并运行容器的时候也是可以通过--network 参数直接设定容器接入的网络。

```sh
docker container run -d --network 网络ID或网络名称 镜像名称
```

## 最好不要使用默认名称为 bridge 的网络

默认名称为 bridge 的网络有个特性，容器间不能通过容器名称联通，只能使用 IP。Docker 官方文档也提到了，不推荐用于生产环境。

## host 驱动模式网络

如果想让容器与宿主机共享同一个网络（平级），而不是通过宿主机的衍生网络。可以执行：

```sh
docker container run --network host 镜像名称
```

使用 host 网络可以减少网络资源损耗，缺点是，如果多个容器都同时使用 host 网络，可能会造成冲突，导致某些容器停止运行。例如两个 Nginx 容器都是 80 端口，同时使用 host 网络，则会因 80 端口被占用导致后来的容器运行失败。

# 是什么

Docker Compose 同样是通过特定的语法，将各种命令，甚至包括 Dockerfile 整理在一起，最终直接生成多个镜像并且启动对应的容器，相当于从零一键部署的懒人包。

# 谁会用到

Docker Compose 更适用于最终的项目部署人员，他无需了解项目的业务逻辑，直接使用 compose 文件部署项目即可，最多也就是修改 compose 文件中关于端口号、容器挂载路径、环境变量、数据库账号密码等配置信息而已。因为这些信息在不同的环境中肯定不能完全一样。

# 长什么样子

```sh
# 【选填】Docker Compose语法版本version: "3.8"
# 【必填】服务配置services:    # 服务名称（冒号前面就是服务名称，冒号后面不填写）    serviceName1:        # 【必填】使用的镜像名称        image: xxxx        # 【选填】容器名称        container_name: xxxx        # 【选填】Dockerfile build配置        build:             # Dockerfile所在目录            context: D:/docker-demo-nodejs-image            # Dockerfile文件名            dockerfile: dockerfile        # 【选填】执行的CMD命令，会覆盖镜像里的CMD        command: xxxx        # 【选填】 环境变量，相当于docker container run的-e        environment: xxxx        # 【选填】 volumes，相当于docker container run的-v        volumes: xxxx        # 【选填】 networks，相当于docker container run的--network        networks: xxxx        # 【选填】 ports，相当于docker container run的-p        ports: xxxx        # 【选填】 依赖于xxx服务（在xxx服务启动后启动）        depends_on: serviceName2（表示在serviceName2启动后再启动serviceName1）        # 如果依赖于serviceName2服务启动并处于健康状态后再启动，这改成如下方式：        # depends_on:        #    serviceName2：        #        condition: service_healthy        # 【选填】 健康检查        healthcheck:            # 检查测试的命令            test: ["CMD", "curl", "-f", "http://localhost:80"]            # 检查间隔时间            interval: 30s            # 超时时间            timeout: 10s            # 重试次数            retries: 3            # 启动等待时间            start_period: 40s    # 第二个服务的名称    serviceName2:        ...（同略）        # 【选填】创建volume，相当于docker volume createvolumes: xxxx 【选填】创建network，相当于docker network createnetworks: xxxx
```

# 如何使用

在compose文件所在目录中执行：

```sh
docker compose up -d
```

如果要加载非默认命名的compose文件，可以通过-f参数，运行指定的compose文件，命令如下：

```sh
docker compose -f ./xxxx.yaml up -d
```

如果在compose文件中涉及了dockerfile build，有可能再次修改dockerfile时，compose因为缓存未识别出新的变化导致最终结果未发生改变。可以添加--build参数强制重新build镜像，命令如下：

```sh
docker compose up -d --build
```

查看日志

```sh
docker compose logs
```

```sh
docker compose stop
```

```sh
docker compose start
```

```sh
docker compose restart
```

清理已停止运行的compose的所有服务（容器）：

```sh
docker compose rm
```
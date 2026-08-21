# dsh-mobile-remote-control

类似 ZCode 的 DSH Desktop 移动端远程控制插件。

## 功能

- 桌面侧栏手机入口与二维码配对；
- 一次性配对令牌、设备 Cookie、在线状态和设备撤销；
- 独立 `/m/` 移动端页面；
- 查看工作区、任务/会话及运行状态；
- 创建会话、进入会话、发送消息、停止任务；
- 明暗主题与移动端回车发送设置；
- 默认仅允许已配对设备访问移动 API。

## 安装

### 在普通系统终端中安装

普通终端需要显式指定 DSH Desktop 使用的 `desktop` profile：

```sh
dsh plugin --profile desktop github:lwt-sadais/dsh-mobile-remote-control
```

### 在 DSH Desktop 的终端中安装

DSH Desktop 内置终端已自动使用 `desktop` profile，因此不需要添加 `--profile desktop`：

```sh
dsh plugin github:lwt-sadais/dsh-mobile-remote-control
```

安装完成后，重启 DSH Desktop 或重新启动对应的 DSH Web Host，使插件生效。

## 网络

默认关闭自动 Cloudflare 公网隧道，优先使用局域网。要让手机访问，DSH Web Host 必须监听局域网地址（通常为 `0.0.0.0`），且 Windows 防火墙允许对应端口。也可以手动配置 HTTPS 公网地址。

## 来源

本地 fork 基于 Apache-2.0 许可的 `@linxin666/dsh-remote-web-ui@0.2.5`，详见 `NOTICE.md` 和 `LICENSE`。

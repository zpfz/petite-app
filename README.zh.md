<!-- <div align=center><img src="" height = "100" div align=center /></div> -->
<h1 align="center">Petite App for Desktop</h1>
<div align="center">

一款为桌面开发定制的应用引擎

![Platform](https://img.shields.io/badge/platform-windows-lightgrey) ![GitHub](https://img.shields.io/github/license/zpfz/petite-app) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/zpfz/petite-app?color=orange) 

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>


# 项目介绍

Petite App 是一款极小的桌面应用引擎。它可以使用 HTML/CSS/DIV + JavaScript/TIScript 来开发它的子应用（或者称为轻应用）。

# 文档导航

* [命令行参数](#命令行参数)
* [如何安装轻应用？](#如何安装轻应用)
* [如何开发轻应用？](#如何开发轻应用)

## 命令行参数
### app-name
从程序安装目录里的 apps 文件夹中加载轻应用。

```sh
petite-app.exe app-name 轻应用名称
```

举个栗子：
```sh
petite-app.exe app-name petite-app-1
```

### load-path
从指定的路径加载轻应用。

```sh
petite-app.exe load-path 轻应用路径
```

举个栗子：
```sh
petite-app.exe load-path "D:\my-petite-apps\petite-app-1"
```

### -v
显示 petite-app 版本。
```sh
petite-app.exe -v
```

### -h
显示 petite-app 可用参数。
```sh
petite-app.exe -h
```

## 如何安装轻应用？

把轻应用（比如名为 `demo` ）放入程序安装目录里的 apps 文件夹中，然后使用命令行 `petite-app.exe app-name demo` 启动它即可。
或者你的轻应用可以是任何位置（比如名为 `demo` 的轻应用放在 `D:\my-petite-apps\demo`），然后使用 `petite-app.exe load-path "D:\my-petite-apps\demo"` 命令去启动它。


## 如何开发轻应用？

本项目使用 Sciter.JS 作为渲染引擎，所以你可以使用 sciter 应用开发的方式去开发它。你可以直接从 [https://github.com/c-smile/sciter-js-sdk/tree/main/docs/md#readme](https://github.com/c-smile/sciter-js-sdk/tree/main/docs/md#readme) 查看相关文档或者从 [https://sciter.com/](https://sciter.com/) 获取更多的教程。你也可以通过项目的 `debug` 文件夹下的 `gsciter.exe` 程序从 `sciter-samples` 文件夹中打开案例。

## 更新日志
每个发布版本都有详细更新日志或者从 [CHANGELOG](https://github.com/zpfz/petite-app/blob/main/CHANGELOG.md) 查看相关日志。


## 开源许可

Petite App 采用 [Apache License 2.0](http://www.apache.org/licenses/) 许可。Sciter 引擎许可请看 [own license terms](https://sciter.com/prices/) 和 [end used license agreement](https://github.com/c-smile/sciter-sdk/blob/master/license.htm) 。
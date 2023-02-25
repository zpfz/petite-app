<!-- <div align=center><img src="" height = "100" div align=center /></div> -->
<h1 align="center">Petite App for Desktop</h1>
<div align="center">

A minimal app engine for desktop.

![Platform](https://img.shields.io/badge/platform-windows-lightgrey) ![GitHub](https://img.shields.io/github/license/zpfz/petite-app) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/zpfz/petite-app?color=orange) 

</div>

<div align="center">

English | [简体中文](./README.zh.md)

</div>


# Introduction

Petite App is a minimal application engine for desktop. It can use HTML/CSS/DIV + JavaScript/TIScript to develop lite application .

# Navigation

* [Args](#args)
* [How to install lite app?](#how-to-install-lite-app)
* [How to develop lite app?](#how-to-develop-lite-app)

## Args
### app-name
Load app from apps path.

```sh
petite-app.exe app-name <app-name>
```

e.g.
```sh
petite-app.exe app-name petite-app-1
```

### load-path
Load app from specific path.

```sh
petite-app.exe load-path <load-path>
```

e.g.
```sh
petite-app.exe load-path "D:\my-petite-apps\petite-app-1"
```

### -v
Show the petite-app version.
```sh
petite-app.exe -v
```

### -h
Show the petite-app help.
```sh
petite-app.exe -h
```

## How to install lite app?
Put the lite app ( such named as `demo` ) into `apps` dir, then use `app-name` arg to start it (e.g. `petite-app.exe app-name demo`) . Or Put the lite app ( such named as `demo` ) anywhere , then use `load-path` arg to start it  ( e.g. `petite-app.exe load-path "D:\my-petite-apps\demo"` ) .


## How to develop lite app?

Sciter.JS used by Petite App as render engine , so you can develop it as sciter app . See the docs from [https://github.com/c-smile/sciter-js-sdk/tree/main/docs/md#readme](https://github.com/c-smile/sciter-js-sdk/tree/main/docs/md#readme) and get more tutorials from [https://sciter.com/](https://sciter.com/) .  

## Changelog
Detailed changes for each release are documented in the [CHANGELOG](https://github.com/zpfz/petite-app/blob/main/CHANGELOG.md) . 


## License

Petite App licensed under [Apache License 2.0](http://www.apache.org/licenses/) . Sciter Engine has the [own license terms](https://sciter.com/prices/) and [end used license agreement](https://github.com/c-smile/sciter-sdk/blob/master/license.htm) for SDK usage.
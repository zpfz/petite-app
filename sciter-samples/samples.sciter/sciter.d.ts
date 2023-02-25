declare module "@sciter" {
    export const VERSION: string;
    export const REVISION: string;
    export const QUICKJS_VERSION: string;
//    export function import(path: string): object;
    export function loadLibrary(name: string): any;
    export function parseValue(val:string): any;
    export function devicePixels(length: number | string)
    export function uuid(): string;
    export function encode(text: string, encoding ?: string): ArrayBuffer;
    export function decode(bytes: ArrayBuffer, encoding ?: string): ArrayBuffer;
    export function compress(input: ArrayBuffer, method?: "gz" | "gzip" | "lzf"): ArrayBuffer;
    export function decompress(input: ArrayBuffer, method?: "gz" | "gzip" | "lzf"): ArrayBuffer;
    export function toBase64(input:ArrayBuffer): string;
    export function fromBase64(input:string): ArrayBuffer;
    export function md5(input:ArrayBuffer): string;
    export function crc32(input:ArrayBuffer): string;
}

declare module "@env" {
    export const OS: string;
    export const PLATFORM: string;
    export const DEVICE: string;
    export function language(): string;
    export function country(): string;
    export function userName(): string;
    export function machineName(): string;
    export function domainName(): string;
    export function launch(path:string): void;
    export function home(relpath ?: string): string;
    export function homeURL(relpath ?: string): string;
    export function path(name: string): string;
    export function pathURL(name: string): string;
    export function exec(...args: []): void;
    
}

declare module "@sys" {
    declare interface spawnOptions {stdout?: string, stdin?: string, stderr?: string}
    export function spawn(args: array<string>, options?: spawnOptions ): Process;
    export function hrtime();
    export function gettimeofday();
    export function uname();
    export function isatty();
    export function environ();
    export function getenv();
    export function setenv();
    export function unsetenv();
    export function cwd(): string;
    export function homedir(): string;
    export function tmpdir();
    export function exepath();
    export function random();

    namespace fs {
        function watch(path:string, cb: (path:string, events: 0x01 | 0x02) => WatchFS);
        function open(path:string, flags: keyof typeof OpenFlagOptions, mode ?: number): Promise<File>;
        function $open(path:string, flags: keyof typeof OpenFlagOptions, mode ?: number): File;
        function stat(path:string): Promise<StatStruct>;
        function $stat(path:string): StatStruct;
        function lstat(): Promise<StatStruct>;
        function $lstat(): StatStruct;
        function unlink(path:string): Promise;
        function rename(oldpath:string, newpath: string) : Promise;
        function mkdtemp(template:string) : Promise<string>;
        function mkstemp(template:string) : Promise<string>;
        function rmdir(path:string) : Promise;
        function $rmdir(path:string);
        function mkdir(path:string, mode ?: 0o777): Promise;
        function $mkdir(path:string, mode ?: 0o777);
        function copyfile(): Promise;
        function readdir(): Promise;
        function $readdir(): Promise<FileList>;
        function readfile(): Promise;
        
    }
    
    interface Dir {
        close();
        path: string;
        next();
        [async iterator];
    }

    declare interface File {
        read(length?:number, fileposition?:number):Promise<Uint8Array>;
        $read(length?:number, fileposition?:number):Uint8Array;
        write(data:string|string[]|ArrayBuffer, filePosition ?:number) : Promise<number>;
        $write(data:string|string[]|ArrayBuffer, filePosition ?:number) : number;
        close(): Promise<undefined>;
        $close(): undefined;
        fileno(): number;
        stat(): Promise<Object>;
        path: string;
    }

    declare interface WatchFS {
        readonly path: string;
        close(): void;
    }

    declare interface StatStruct {
        isFile ?: boolean;
        isDirectory ?: boolean;
        isSymbolicLink ?: boolean;
        st_dev: number;
        st_ino: number;
        st_mode: number;
        st_nlink: number;
        st_uid: number;
        st_gid: number;
        st_rdev: number;
        st_size: number;
        st_blksize: number;
        st_blocks: number;
        st_atime: number;
        st_mtime: number;
        st_ctime: number;
        st_birthtime: number;
    }
}

declare enum OpenFlagOptions { 'a', 'ax', 'a+', 'ax+', 'as', 'as+', 'r', 'r+', 'rs+', 'w', 'wx', 'w+', 'wx+' }

declare interface Process {
    kill();
    wait(): Promise<ProcessStats>;
    pid: number;
    stdin: Pipe;
    stdout: Pipe;
    stderr: Pipe;
}

declare interface ProcessStats {
    exit_status: number;
    term_signal: number;
}

declare interface Socket {
    close();
    read();
    write();
    fileno();
}
declare interface Pipe extends Socket {
    listen();
    accept();
    getsockname();
    getpeername();
    connect();
    bind();
}

declare interface TTY extends Socket {
    setMode();
    getWinSize();
}

declare interface UDPSocket extends Socket {
    close();
    recv();
    send();
    getsockname();
    getpeername();
    connect();
    bind();
}

declare interface TCPSocket {
    shutdown();
    fileno();
    listen();
    accept();
    getsockname();
    getpeername();
    connect();
    bind();
}

export function setTimeout(func: Function, milliseconds: Number ): any;
export function clearTimeout(timeoutId: any );
export function setInterval(func: Function, milliseconds: Number ): any;
export function clearInterval(timeoutId: any );

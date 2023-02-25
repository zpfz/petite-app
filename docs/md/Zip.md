# class Zip

The Zip class allows to access content of zip files and blobs.

## Static methods

### `Zip.openFile(path:string): Zip`

Opens zip file for reading. Returns instance of Zip class.

### `Zip.openData(data:ArrayBuffer): Zip`

Opens zip blob for reading. Returns instance of Zip class.

## Properties:

* `zip.length` - reports total number of items in the zip;

## Methods:

### `zip.item(index:int) ZipItem`

Fetches zip item by index. Index must be in range [0 .. zip.length).

### `zip.item(path:string) ZipItem`

Fetches zip item by its path (local to the zip).

## (iterator)

The Zip supports iterator to walk over content of the zip:

```JS
  const zip = Zip.openFile(...);
  for(const item of zip) 
     console.log(item.path);
```

# class ZipItem

ZipItem is a structure that represents single entry inside the zip.

## Properties:

* `item.isDir:bool` - _true_ if the item represents directory inside the zip;
* `item.isFile:bool` - _true_ if the item represents file;
* `item.path:string` - local path of the item inside the zip;
* `item.data:ArrayBuffer` - data of the item as ArrayBuffer. Use [`srt.decode(arrayBuffer,"utf-8")`](module-sciter.md) to convert the data to string if needed.



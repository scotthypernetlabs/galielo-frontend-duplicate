import {PackagedFile} from "../../business/objects/packagedFile"

const DEFAULT_FILES_TO_IGNORE:string[] = [
  // '.DS_Store', // OSX indexing file
  // 'Thumbs.db'  // Windows indexing file
];

function shouldIgnoreFile(file:PackagedFile) {
  return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0;
}

function traverseDirectory(entry:IFileSystemDirectoryEntry): IFileSystemFileEntry[] {
  const reader = entry.createReader();
  // Resolved when the entire directory is traversed
  const entries:IFileSystemFileEntry[] = [];
  const errorHandler = () => {};
  
  function readEntries() {
    // According to the FileSystem API spec, readEntries() must be called until
    // it calls the callback with an empty array.
    reader.readEntries((batchEntries: IFileSystemEntry[]) => {
      if (!batchEntries.length) {
        // Done iterating this particular directory
        return;
      } 

      // Add a list of promises for each directory entry.  If the entry is itself
      // a directory, then that promise won't resolve until it is fully traversed.
      for (let batchEntry of batchEntries) {
        if (batchEntry.isDirectory) {
          entries.concat(traverseDirectory(batchEntry as IFileSystemDirectoryEntry));
        }
        else {
          entries.push(batchEntry as IFileSystemFileEntry)
        }
      }

      // Try calling readEntries() again for the same dir, according to spec
      readEntries();
    }, errorHandler);
  }
  // initial call to recursive entry reader function
  readEntries();

  return entries;
}

function getFile(entry:IFileSystemFileEntry): Promise<PackagedFile> {
  return new Promise((resolve) => {
    entry.file((file:any) => {
      resolve(new PackagedFile(file, entry));
    });
  });
}

function handleFilePromises(promises:Promise<PackagedFile>[], fileList:PackagedFile[]): Promise<PackagedFile[]> {
  return Promise.all(promises).then((files) => {
    files.forEach((file) => {
      if (!shouldIgnoreFile(file)) {
        fileList.push(file);
      }
    });
    return fileList;
  });
}

function getDataTransferFiles(dataTransfer:DataTransfer): Promise<PackagedFile[]> {
  const dataTransferFiles:PackagedFile[] = [];
  const entries:IFileSystemFileEntry[] = [];
  const filePromises:Promise<PackagedFile>[] = [];

  [].slice.call(dataTransfer.items).forEach((listItem: DataTransferItem) => {
    if (typeof listItem.webkitGetAsEntry === 'function') {
      const entry: IFileSystemEntry = listItem.webkitGetAsEntry();

      if (entry) {
        if (entry.isDirectory) {
          entries.concat(traverseDirectory(entry as IFileSystemDirectoryEntry));
        } else {
          filePromises.push(getFile(entry as IFileSystemFileEntry));
        }
      }
    } else {
      dataTransferFiles.push(new PackagedFile(listItem.getAsFile()));
    }
  });
  if (entries.length) {
    
    const flattenedEntries = flatten(entries);
    // collect async promises to convert each fileEntry into a File object
    flattenedEntries.forEach((fileEntry) => {
      filePromises.push(getFile(fileEntry));
    });
    return handleFilePromises(filePromises, dataTransferFiles);

  } else if (filePromises.length) {
    return handleFilePromises(filePromises, dataTransferFiles);
  }
  return Promise.resolve(dataTransferFiles);
}

function flatten<T>(array: T[]): T[] {
  return array.reduce((prev:T[], current:T|T[]) => prev.concat(Array.isArray(current) ? flatten(current) : current), []);
}
    

/**
 * This function should be called from both the onDrop event from your drag/drop
 * dropzone as well as from the HTML5 file selector input field onChange event
 * handler.  Pass the event object from the triggered event into this function.
 * Supports mix of files and folders dropped via drag/drop.
 *
 * Returns: an array of File objects, that includes all files within folders
 *   and subfolders of the dropped/selected items.
 */
export function getDroppedOrSelectedFiles(event:any) {
  const dataTransfer = event.dataTransfer;
  if (dataTransfer && dataTransfer.items) {
    return getDataTransferFiles(dataTransfer);
  }
  const files = [];
  const dragDropFileList = dataTransfer && dataTransfer.files;
  const inputFieldFileList = event.target && event.target.files;
  const fileList = dragDropFileList || inputFieldFileList || [];
  // convert the FileList to a simple array of File objects
  for (let i = 0; i < fileList.length; i++) {
    files.push(new PackagedFile(fileList[i]));
  }
  return Promise.resolve(files);
}


interface IFileSystemEntry {
  filesystem: IFileSystem;
  fullPath: string;
  isDirectory: boolean;
  isFile: boolean;
  name: string;
}

interface IFileSystem {

}

interface IFileSystemDirectoryEntry extends IFileSystemEntry {
  createReader(): IFileSystemDirectoryReader;
  getDirectory(): IFileSystemDirectoryEntry;
  getFile(): IFileSystemFileEntry;
}

interface IFileSystemFileEntry extends IFileSystemEntry {
  file(successCallback: (file: File)=>void, errorCallback?: (error: IFileError) => void): void;
}

interface IFileSystemDirectoryReader {
  readEntries(successCallback: (entries: IFileSystemEntry[])=>void, errorCallback?: () => void): IFileSystemEntry[];
}

interface IFileError {

}
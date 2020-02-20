import { PackagedFile } from "../../business/objects/packagedFile";

const DEFAULT_FILES_TO_IGNORE: string[] = [
  // '.DS_Store', // OSX indexing file
  // 'Thumbs.db'  // Windows indexing file
];

function shouldIgnoreFile(file: PackagedFile) {
  return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0;
}

/**
 * This is the most horrible function I have ever, ever come across.
 */
function traverseDirectory(
  entry: IFileSystemDirectoryEntry
): Promise<IFileSystemFileEntry[]> {
  const reader = entry.createReader();
  // Resolved when the entire directory is traversed
  return new Promise(resolveDirectory => {
    const iterationAttempts: Promise<IFileSystemFileEntry[]>[] = [];
    const errorHandler = () => {};

    function readEntries() {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.
      reader.readEntries((batchEntries: IFileSystemEntry[]) => {
        if (!batchEntries.length) {
          // Done iterating this particular directory
          // Condense the results into a single array
          resolveDirectory(
            Promise.all(iterationAttempts).then(
              (fileSystemFileEntries: IFileSystemFileEntry[][]) => {
                return condense(fileSystemFileEntries);
              }
            )
          );
        } else {
          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          const iterationAttemptPromises = new Array<
            Promise<IFileSystemFileEntry[]>
          >();
          for (const batchEntry of batchEntries) {
            if (batchEntry.isDirectory) {
              iterationAttemptPromises.push(
                traverseDirectory(batchEntry as IFileSystemDirectoryEntry)
              );
            } else {
              iterationAttemptPromises.push(
                Promise.resolve([batchEntry as IFileSystemFileEntry])
              );
            }
          }

          // Promise.all() resolves to an array of each result of each promise.
          // We want to just condense them into a single array
          iterationAttempts.push(
            Promise.all(iterationAttemptPromises).then(
              (iterationEntries: IFileSystemFileEntry[][]) => {
                return condense(iterationEntries);
              }
            )
          );

          // Try calling readEntries() again for the same dir, according to spec
          readEntries();
        }
      }, errorHandler);
    }
    // initial call to recursive entry reader function
    readEntries();
  });
}

function condense<T>(arrayOfArrays: T[][]): T[] {
  let retArray = new Array<T>();
  for (const arr of arrayOfArrays) {
    retArray = retArray.concat(arr);
  }
  return retArray;
}

function getFile(entry: IFileSystemFileEntry): Promise<PackagedFile> {
  return new Promise(resolve => {
    entry.file((file: File) => {
      resolve(new PackagedFile(file, entry));
    });
  });
}

function handleFilePromises(
  promises: Promise<PackagedFile>[],
  fileList: PackagedFile[]
): Promise<PackagedFile[]> {
  return Promise.all(promises).then((files: PackagedFile[]) => {
    for (const file of files) {
      if (!shouldIgnoreFile(file)) {
        fileList.push(file);
      }
    }
    return fileList;
  });
}

function getDataTransferFiles(
  dataTransfer: DataTransfer
): Promise<PackagedFile[]> {
  const dataTransferFiles: PackagedFile[] = [];
  const folderPromises: Promise<IFileSystemFileEntry[]>[] = [];
  const filePromises: Promise<PackagedFile>[] = [];

  [].slice.call(dataTransfer.items).forEach((listItem: DataTransferItem) => {
    if (typeof listItem.webkitGetAsEntry === "function") {
      const entry: IFileSystemEntry = listItem.webkitGetAsEntry();

      if (entry) {
        if (entry.isDirectory) {
          folderPromises.push(
            traverseDirectory(entry as IFileSystemDirectoryEntry)
          );
        } else {
          filePromises.push(getFile(entry as IFileSystemFileEntry));
        }
      }
    } else {
      dataTransferFiles.push(new PackagedFile(listItem.getAsFile()));
    }
  });
  if (folderPromises.length) {
    return Promise.all(folderPromises).then(fileEntries => {
      const flattenedEntries = flatten(fileEntries);
      // collect async promises to convert each fileEntry into a File object
      flattenedEntries.forEach((fileEntry: any) => {
        filePromises.push(getFile(fileEntry));
      });
      return handleFilePromises(filePromises, dataTransferFiles);
    });
  } else if (filePromises.length) {
    return handleFilePromises(filePromises, dataTransferFiles);
  }
  return Promise.resolve(dataTransferFiles);
}

function flatten<T>(array: T[]): T[] {
  return array.reduce(
    (prev: T[], current: T | T[]) =>
      prev.concat(Array.isArray(current) ? flatten(current) : current),
    []
  );
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
export function getDroppedOrSelectedFiles(
  event: React.DragEvent<HTMLDivElement>
): Promise<PackagedFile[]> {
  const dataTransfer = event.dataTransfer;

  // If the event is a data transfer, handle it this way
  if (dataTransfer && dataTransfer.items) {
    return getDataTransferFiles(dataTransfer);
  }

  // The event does not have a DataTransfer, we need to handle it
  // in a more basic way
  const files = [];
  const dragDropFileList = dataTransfer && dataTransfer.files;
  const inputFieldFileList = event.target && (event.target as any).files;
  const fileList = dragDropFileList || inputFieldFileList || [];

  for (const file of fileList) {
    files.push(new PackagedFile(file));
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

interface IFileSystem {}

interface IFileSystemDirectoryEntry extends IFileSystemEntry {
  createReader(): IFileSystemDirectoryReader;
  getDirectory(): IFileSystemDirectoryEntry;
  getFile(): IFileSystemFileEntry;
}

interface IFileSystemFileEntry extends IFileSystemEntry {
  file(
    successCallback: (file: File) => void,
    errorCallback?: (error: IFileError) => void
  ): void;
}

interface IFileSystemDirectoryReader {
  readEntries(
    successCallback: (entries: IFileSystemEntry[]) => void,
    errorCallback?: () => void
  ): IFileSystemEntry[];
}

interface IFileError {}

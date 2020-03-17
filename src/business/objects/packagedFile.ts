const EXTENSION_TO_MIME_TYPE_MAP: any = {
  avi: "video/avi",
  gif: "image/gif",
  ico: "image/x-icon",
  jpe: "image/jpeg",
  jpg: "image/jpeg",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  mp4: "video/mp4",
  pdf: "application/pdf",
  png: "image/png",
  zip: "application/zip"
};

export class PackagedFile {
  public fileObject: File; // provide access to the raw File object (required for uploading)
  public fullPath: string;
  public lastModified: number;
  public name: string;
  public size: number;
  public type: string;

  constructor(file: File, entry?: any) {
    let fileTypeOverride = "";
    // handle some browsers sometimes missing mime types for dropped files
    const hasExtension = file.name && file.name.lastIndexOf(".") !== -1;
    if (hasExtension && !file.type) {
      const fileExtension = (file.name || "").split(".").pop();
      fileTypeOverride = EXTENSION_TO_MIME_TYPE_MAP[fileExtension];
    }

    this.fileObject = file;
    this.fullPath = entry ? PackagedFile.copyString(entry.fullPath) : file.name;
    this.lastModified = file.lastModified;
    this.name = file.name;
    this.size = file.size;
    this.type = file.type ? file.type : fileTypeOverride;
  }

  protected static copyString(aString: string) {
    return ` ${aString}`.slice(1);
  }
}

export type XMLString = string;

export type XMLFileInfo = {
  readonly fileName: string;
  readonly contents: XMLString;
};

export type XMLInput = XMLString | XMLFileInfo;

export type XMLLintOptions = {
  /**
   * XML file contents to validate.
   * Note that xmllint only supports UTF-8 encoded files.
  */
  readonly xml: XMLInput | ReadonlyArray<XMLInput>;
  readonly schema: XMLInput | ReadonlyArray<XMLInput>;
  /**
   * Other files that should be added to Emscripten's in-memory
   * file system so that xmllint can access them.
   * Useful if your schema contains imports.
   */
  readonly preload: XMLFileInfo | ReadonlyArray<XMLFileInfo>;
  /**
   * @default 'schema'
  */
  readonly extension?: 'schema' | 'relaxng',
};

export type XMLValidationError = {
  readonly rawMessage: string;
  /**
   * Error message without the file name and line number.
   */
  readonly message: string;
  /**
   * Position of the error.
   * null if we failed to parse the position from the raw message for some reason.
   */
  readonly loc: null | {
    readonly fileName: string;
    readonly lineNumber: number;
  };
};

export type XMLValidationResult = {
  readonly valid: boolean;
  readonly errors: ReadonlyArray<XMLValidationError>;
  readonly rawOutput: string;
}

export function validateXML(options: XMLLintOptions): Promise<XMLValidationResult>;
export type XMLString = string;

export interface XMLFileInfo {
  readonly fileName: string;
  readonly contents: XMLString;
};

export type XMLInput = XMLString | XMLFileInfo;

interface Schema { readonly schema: XMLInput | ReadonlyArray<XMLInput> };
interface Normalization {
  /**
   * Pass either --format or --c14n to xmllint to get a formatted
   * version of the input document to "normalized" property of the result.
   * normalization: 'format' reformats and reindents the output.
   * normalization: 'c14n' performs W3C XML Canonicalisation (C14N).
   */
  readonly normalization: 'format' | 'c14n';
};

interface XMLLintOptionsBase {
  /**
   * XML file contents to validate.
   * Note that xmllint only supports UTF-8 encoded files.
  */
  readonly xml: XMLInput | ReadonlyArray<XMLInput>;
  /**
   * Other files that should be added to Emscripten's in-memory
   * file system so that xmllint can access them.
   * Useful if your schema contains imports.
   */
  readonly preload?: null | undefined | XMLFileInfo | ReadonlyArray<XMLFileInfo>;
  /**
   * @default 'schema'
   */
  readonly extension?: 'schema' | 'relaxng';
	/*
	* Maximum memory capacity, in Web Assembly memory pages. If not
	* set, this will also default to 256 pages. Max is 65536 (4GiB).
	* Use this to raise the memory limit if your XML to validate are large enough to
	* cause out of memory errors.
	* The following example would set the max memory to 2GiB.
	*/
  readonly initialMemoryPages?: number;
	/*
	* Maximum memory capacity, in Web Assembly memory pages. If not
	* set, this will also default to 256 pages. Max is 65536 (4GiB).
	* Use this to raise the memory limit if your XML to validate are large enough to
	* cause out of memory errors.
	* The following example would set the max memory to 2GiB.
	*/
  readonly maxMemoryPages?: number;
}

export type XMLLintOptions = XMLLintOptionsBase & (Schema | Normalization | (Schema & Normalization));

export interface XMLValidationError {
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

export interface XMLValidationResult {
  readonly valid: boolean;
  readonly errors: ReadonlyArray<XMLValidationError>;
  readonly rawOutput: string;
  /**
   * If the "normalization" option was set in the options, this will contain
   * the formatted output. Otherwise, it will be empty string.
   */
  readonly normalized: string;
}

export function validateXML(options: XMLLintOptions): Promise<XMLValidationResult>;

interface MemoryPagesConstant {
	/**
	 * 1MiB as a number of 64KiB Web Assembly pages.
	 */
	readonly MiB: number;
	/**
	 * 1GiB as a number of 64KiB Web Assembly pages.
	 */
	readonly GiB: number;
	/**
	 * The default number of 64KiB Web Assembly pages for both
	 * the initial and maximum memory.
	 */
	readonly default: number;
	/**
	 * The maximum number of 64KiB Web Assembly pages for the
	 * maxMemoryPages option.
	 */
	readonly max: number;
};

export const memoryPages: MemoryPagesConstant;

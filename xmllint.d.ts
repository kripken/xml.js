interface options {
    /**
     * Examples:
     *  @link https://github.com/kripken/xml.js/blob/master/test/test.xsd
     */
	xml: string | string[],

    /**
     * Examples:
     *  @link https://github.com/kripken/xml.js/blob/master/test/test.xml
     */
	schema: string | string[]
}

interface result {
    errors?: string[]
}

export var validateXML : (Options: options) => result;

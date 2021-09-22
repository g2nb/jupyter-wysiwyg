const data = require('../package.json');

/**
 * The html widget manager assumes that this is the same as the npm package
 * version number.
 */
export const MODULE_VERSION = data.version;

/*
 * The current package name.
 */
export const MODULE_NAME = data.name;

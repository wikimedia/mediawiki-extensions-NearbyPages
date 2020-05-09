/**
 * @typedef {Object} CardThumbnail
 * @property {string} source uri for image
 */

/**
 * @typedef {Object} Card
 * @property {string} title
 * @property {CardThumbnail} thumbnail
 * @property {string} description
 */

/**
 * @typedef AppData
 * @property {Card[]} pages
 * @property {boolean} pending
 * @property {boolean} includeRandomButton
 * @property {boolean} error
 */

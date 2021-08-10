// var defaults = require('object.defaults');
import { defaults, map } from "https://unpkg.com/lodash-es@4.17.21/lodash.js";
// var map = require('collection-map');

// var metadata = require('./helpers/metadata');
import metadata from './metadata.js';

function tree(opts) {
  opts = defaults(opts || {}, {
    deep: false,
  });

  var tasks = this._registry.tasks();
  var nodes = map(tasks, function(task) {
    var meta = metadata.get(task);

    if (opts.deep) {
      return meta.tree;
    }

    return meta.tree.label;
  });

  return {
    label: 'Tasks',
    nodes: nodes,
  };
}

// module.exports = tree;
export default tree;

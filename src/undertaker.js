
// var inherits = require('util').inherits;
import { extend as inherits } from "https://unpkg.com/lodash-es@4.17.21/lodash.js";
// var EventEmitter = require('events').EventEmitter;
import { EventEmitter } from "https://deno.land/std@0.103.0/node/events.ts";

// var DefaultRegistry = require('undertaker-registry');
import DefaultRegistry from './undertaker-registry.js';

// var tree = require('./lib/tree');
import tree from './lib/undertaker/tree.js';
// var task = require('./lib/task');
import task from './lib/undertaker/task.js';
// var series = require('./lib/series');
// var lastRun = require('./lib/last-run');
// var parallel = require('./lib/parallel');
// var registry = require('./lib/registry');
// var _getTask = require('./lib/get-task');
// var _setTask = require('./lib/set-task');

function Undertaker(customRegistry) {
  EventEmitter.call(this);

  this._registry = new DefaultRegistry();
  if (customRegistry) {
    this.registry(customRegistry);
  }

  this._settle = (process.env.UNDERTAKER_SETTLE === 'true');
}

inherits(Undertaker, EventEmitter);


Undertaker.prototype.tree = tree;

Undertaker.prototype.task = task;

// Undertaker.prototype.series = series;

// Undertaker.prototype.lastRun = lastRun;

// Undertaker.prototype.parallel = parallel;

// Undertaker.prototype.registry = registry;

// Undertaker.prototype._getTask = _getTask;

// Undertaker.prototype._setTask = _setTask;

// module.exports = Undertaker;
export default Undertaker;

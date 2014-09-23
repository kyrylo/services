/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

var util = require('util');

var firstStacktraceLine = function(stacktrace) {
  var filtered, frame;

  filtered = stacktrace.filter(function(line) {
    var inProject;

    if (line && line.inProject) {
      inProject = line.inProject;
    }

    return inProject;
  });

  if (filtered.length === 0) {
    filtered = filtered.slice(0, 1);
  }

  frame = filtered[0];

  return frame.file + ':' + frame.lineNumber + ' - ' + frame.method;
};

var parse = function(headers, event, settings) {
  // This check does not filter errors without severity.
  if (settings && settings.events && event.error.severity &&
      !settings.events[event.error.severity])
  {
    return;
  }

  var details = {}, // Storage for an exception's details
      error = event.error,
      maxlen = 85, // The maximum length of an error message
      message = '', // The message to be displayed on the channel
      newlineIndent = '<br>&nbsp;&nbsp;&nbsp;',
      errorLevel = 'error';

  details.title = event.trigger.message;

  if (error) {
    details.title += ' in ' + error.releaseStage;
    details.error_string = error.exceptionClass;

    if (error.message) {
      details.error_string += ': ' + error.message.substring(0, maxlen);
    }

    if (error.stacktrace) {
      details.stack_trace_line = firstStacktraceLine(error.stacktrace);
    }
  }

  message += util.format('<b>%s</b> from <a href="%s">%s</a>', details.title,
                         event.project.url, event.project.name);
  if (error) {
    message += util.format(' in <b>%s</b> (<a href="%s">details</a>)',
                           error.context, error.url);
    message += newlineIndent + details.error_string;

    if (details.stack_trace_line) {
      message += newlineIndent + '<code>' + details.stack_trace_line + '</code>';
    }
  }

  if (error && error.severity && error.severity !== 'error') {
    errorLevel = 'normal';
  }

  return {
    message: message,
    icon: 'error',
    errorLevel: errorLevel
  };
};

module.exports = {
  apiVersion: 1,
  name: 'Bugsnag',
  parse: parse
};

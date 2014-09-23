/*jshint globalstrict:true, trailing:false, unused:true, node:true */
/*globals beforeEach, describe, it*/
"use strict";

var assert = require('assert');
var bugsnag = require('../..').bugsnag;
var parse = bugsnag.parse;
var examples = bugsnag.examples;

describe('Bugsnag events', function() {
  var settings;

  beforeEach(function() {
    settings = {
      events: {
        error: true,
        warning: true,
        info: true
      }
    };
  });

  it('should generate an error event', function() {
    var payload = examples.event_error,
        response = parse(payload.headers, payload.body, settings);

    assert.equal(response.message, '<b>New exception in production</b> from <a href="http://bugsnag.com/projects/example">Example.com</a> in <b>home#example</b> (<a href="http://bugsnag.com/errors/example/events/example">details</a>)<br>&nbsp;&nbsp;&nbsp;ExampleException: Something really bad happened<br>&nbsp;&nbsp;&nbsp;<code>app/controllers/home_controller.rb:123 - example</code>');
    assert.equal(response.icon, 'error');
    assert.equal(response.errorLevel, 'error');
  });

  it('should generate a warning event', function() {
    var payload = examples.event_warning,
        response = parse(payload.headers, payload.body, settings);

    assert.equal(response.message, '<b>New exception in production</b> from <a href="http://bugsnag.com/projects/example">Example.com</a> in <b>home#example</b> (<a href="http://bugsnag.com/errors/example/events/example">details</a>)<br>&nbsp;&nbsp;&nbsp;ExampleException: Something really bad happened<br>&nbsp;&nbsp;&nbsp;<code>app/controllers/home_controller.rb:123 - example</code>');
    assert.equal(response.icon, 'error');
    assert.equal(response.errorLevel, 'normal');
  });

  it('should generate an info event', function() {
    var payload = examples.event_info,
        response = parse(payload.headers, payload.body, settings);

    assert.equal(response.message, '<b>New exception in production</b> from <a href="http://bugsnag.com/projects/example">Example.com</a> in <b>home#example</b> (<a href="http://bugsnag.com/errors/example/events/example">details</a>)<br>&nbsp;&nbsp;&nbsp;ExampleException: Something really bad happened<br>&nbsp;&nbsp;&nbsp;<code>app/controllers/home_controller.rb:123 - example</code>');
    assert.equal(response.icon, 'error');
    assert.equal(response.errorLevel, 'normal');
  });

  it('should generate an error if a payload does not have severity', function() {
        var payload = examples.event_without_severity,
        response = parse(payload.headers, payload.body, settings);

    assert.equal(response.message, '<b>New exception in production</b> from <a href="http://bugsnag.com/projects/example">Example.com</a> in <b>home#example</b> (<a href="http://bugsnag.com/errors/example/events/example">details</a>)<br>&nbsp;&nbsp;&nbsp;ExampleException: Something really bad happened<br>&nbsp;&nbsp;&nbsp;<code>app/controllers/home_controller.rb:123 - example</code>');
    assert.equal(response.icon, 'error');
    assert.equal(response.errorLevel, 'error');
  });

  it('should not generate an error event when error is off', function() {
    settings.events.error = false;

    var payload = examples.event_error,
        response = parse(payload.headers, payload.body, settings);

    assert(!response);
  });

  it('should not generate a warning event when warning is off', function() {
    settings.events.warning = false;

    var payload = examples.event_warning,
        response = parse(payload.headers, payload.body, settings);

    assert(!response);
  });

  it('should not generate an info event when info is off', function() {
    settings.events.info = false;

    var payload = examples.event_info,
        response = parse(payload.headers, payload.body, settings);

    assert(!response);
  });
});

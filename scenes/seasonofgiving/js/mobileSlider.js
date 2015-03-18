goog.require('app.GameManager');

goog.provide('app.MobileSlider');

/**
 * Mobile slider - not really a slider...
 * @constructor
 * @param {string} el string target for DOM element
 */
app.MobileSlider = function(el) {
  this.el = $(el);
  this.isExpanded = true;
  this.indicatorContainer = this.el.find('.crayon-size-indicator-container')[0];
  this.sizeContainer = this.el.find('.crayon-size-container')[0];
  this.lastItem = null;
  this.lastIndicator = null;
  this.expandOffset = 0;
  this.animation = null;

  this.init();
  app.GameManager.mobileSlider = this;
};

/**
 * Expand animation
 */
app.MobileSlider.prototype.expand = function() {
  if (this.isExpanded) {
    return;
  }

  this.animation && this.animation.cancel();
  this.animation = this.sizeContainer.animate([
      {transform: 'translate3d(0, 220px, 0)'},
      {transform: 'translate3d(0, ' + (this.expandOffset - 20) + 'px, 0)'},
      {transform: 'translate3d(0, ' + (this.expandOffset + 10) + 'px, 0)'},
      {transform: 'translate3d(0, ' + (this.expandOffset - 5) + 'px, 0)'},
      {transform: 'translate3d(0, ' + this.expandOffset + 'px, 0)'}
    ], {
      fill: 'forwards',
      duration: 550,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    }
  );

  this.isExpanded = true;
};

/**
 * Collapse animation
 * @param {Number} time time for collapse animation
 */
app.MobileSlider.prototype.collapse = function(time) {
  if (!this.isExpanded) {
    return;
  }

  this.animation && this.animation.cancel();
  this.animation = this.sizeContainer.animate([
      {transform: 'translate3d(0, ' + this.expandOffset + 'px, 0)'},
      {transform: 'translate3d(0, ' + (this.expandOffset - 20) + 'px, 0)'},
      {transform: 'translate3d(0, 220px, 0)'}
    ], {
      fill: 'forwards',
      delay: 200,
      duration: time || 300,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    }
  );
  this.isExpanded = false;
};

/**
 * Init
 */
app.MobileSlider.prototype.init = function() {
  var self = this;
  $(this.sizeContainer).children().each(function(id, el) {
    $(this).on('touchstart mousedown', function(event) {
      var customSlider = app.GameManager.sizeSlider;
      customSlider.sizeSlider.setValue(
          customSlider.sizeSlider.getMaximum() - id);
      self.toggle();
    });
  });

  // Collapse by default
  this.collapse(0);

  $(this.indicatorContainer).on('touchstart mousedown', this.handleIndicatorClick.bind(this));
};

/**
 * Toggle state: expand/collapse
 */
app.MobileSlider.prototype.toggle = function() {
  if (this.isExpanded) {
    this.collapse();
  } else {
    this.expand();
  }
};

/**
 * Click handler for opening stroke sizes
 * @param {Event} event Event
 */
app.MobileSlider.prototype.handleIndicatorClick = function(event) {
  this.toggle();
};

/**
 * Change the active crayon size. Does not change the stroke size.
 * @param  {number} size The new size, from 1-4 (smallest to largest)
 * @param  {number} maxSize The largest possible size
 */
app.MobileSlider.prototype.changeActiveSize = function(size, maxSize) {
  if (this.lastItem) {
    this.lastItem.removeClass('active');
  }
  this.lastItem = $(this.sizeContainer).children().eq(maxSize - size)
      .find('.crayon-size');
  this.lastItem.addClass('active');

  if (this.lastIndicator) {
    this.lastIndicator.removeClass('active');
  }
  var indicatorIndex = size - 1;
  this.lastIndicator = $(this.indicatorContainer).children().eq(indicatorIndex);
  this.lastIndicator.addClass('active');
};

/**
 * Offset expand
 * @param {number} toolSize Width/height of button
 * @param {number} cols Current columns
 */
app.MobileSlider.prototype.updateExpandOffset = function(toolSize, cols) {
  this.expandOffset = -15 + (1 - (toolSize - 35) / 40) * 35;

  if (cols < 14) {
    this.expandOffset += 25;
  }
};

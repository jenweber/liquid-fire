import { observer } from '@ember/object';
import Component from '@ember/component';
import { measure } from "./liquid-measured";
import Growable from "liquid-fire/growable";
import layout from "liquid-fire/templates/components/liquid-spacer";
import $ from 'jquery';

export default Component.extend(Growable, {
  layout,
  enabled: true,

  didInsertElement() {
    let elt = $(this.element);
    let child = elt.find('> div');
    let measurements = this.myMeasurements(measure(child));

    this.element.style.overflow = 'hidden';

    if (this.get('growWidth')) {
      elt.outerWidth(measurements.width);
    }
    if (this.get('growHeight')) {
      elt.outerHeight(measurements.height);
    }
  },

  sizeChange: observer('measurements', function() {
    if (!this.get('enabled')) { return; }
    if (!this.element) { return; }
    let want = this.myMeasurements(this.get('measurements'));
    let elt = $(this.element);
    let have = measure(elt);
    this.animateGrowth(elt, have, want);
  }),

  // given our child's outerWidth & outerHeight, figure out what our
  // outerWidth & outerHeight should be.
  myMeasurements(childMeasurements) {
    let elt = $(this.element);
    return {
      width: childMeasurements.width + sumCSS(elt, padding('width')) + sumCSS(elt, border('width')),
      height: childMeasurements.height + sumCSS(elt, padding('height')) + sumCSS(elt, border('height'))
    };
    //if (this.$().css('box-sizing') === 'border-box') {
  }

});

function sides(dimension) {
  return dimension === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
}

function padding(dimension) {
  let s = sides(dimension);
  return ['padding'+s[0], 'padding'+s[1]];
}

function border(dimension) {
  let s = sides(dimension);
  return ['border'+s[0]+'Width', 'border'+s[1]+'Width'];
}

function sumCSS(elt, fields) {
  let accum = 0;
  for (let i=0; i < fields.length; i++) {
    let num = parseFloat(elt.css(fields[i]), 10);
    if (!isNaN(num)) {
      accum += num;
    }
  }
  return accum;
}

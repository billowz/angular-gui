describe('util factory', function() {

  var utils;

  beforeEach(module('ngui.utils'));
  beforeEach(inject(function(_utils_) {
    utils = _utils_;
  }));


  it('isNull', function() {
    expect(utils.isNull(null)).toBe(true);
    expect(utils.isNull(undefined)).toBe(true);
    expect(utils.isNull(0)).toBe(false);
    expect(utils.isNull('')).toBe(false);
    expect(utils.isNull(false)).toBe(false);
  });
  it('isBoolean', function() {
    expect(utils.isBoolean(true)).toBe(true);
    expect(utils.isBoolean(false)).toBe(true);
    expect(utils.isBoolean(null)).toBe(false);
    expect(utils.isBoolean(undefined)).toBe(false);
    expect(utils.isBoolean(0)).toBe(false);
    expect(utils.isBoolean('')).toBe(false);
  });
  it('default value', function() {
    var obj = {
      a: null,
      b: undefined,
      c: 0
    };
    utils.defaultVal(obj, 'a', 1);
    utils.defaultVal(obj, 'b', 1);
    utils.defaultVal(obj, 'c', 1);
    utils.defaultVal(obj, 'd', 1);
    expect(obj.a).toBe(null);
    expect(obj.b).toBe(undefined);
    expect(obj.c).toBe(0);
    expect(obj.d).toBe(1);
  });
  it('extend if', function() {
    var obj = {
      a: null,
      b: undefined,
      c: 0
    };
    utils.extendIf(obj, {
      a: 1,
      b: 1,
      c: 1,
      d: 1
    });
    expect(obj.a).toBe(null);
    expect(obj.b).toBe(undefined);
    expect(obj.c).toBe(0);
    expect(obj.d).toBe(1);
  });
});

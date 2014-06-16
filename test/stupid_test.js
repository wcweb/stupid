(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */
  var player = function(){
  };
  player.seek= function(time){
    console.log(time);
  };
  $(document).ready(function(){

     $('#st_wraper').stupid(
    {
        //x_axise:[0,1,2,3,4,5,6,7,8,10,9,11],
      //y_axise:[0,1,2,3,4,5,6,7,8,9,10,20],
  //dtime:[
    //[0,1,2,3,4,5,6,7,8,9,10,20],
    //[0,1,2,3,4,5,6,7,8,9,10,20],
    //[0,1,2,3,4,5,6,7,8,9,10,20],
    //[0,1,2,3,4,5,6,7,8,9,10,20]
  //],
      //data:[
    //['s','t','t','t','t','t','s'],
    //['s','s','s','s','s','t','t'],
    //['s','s','s','s','s','t','t'],
    //['s','s','s','s','s','t','t']
  //],
        size:{'height':45,'width':45,'margin':15,'border':4},
      changeItemCallback:function(currentInput){
          console.log(currentInput.value);
          //alert("currentTime is"+currentInput);
  }
     },player);

  });

  module('stupid#init', {
    setup: function(){
      this.stupid = $.fn.stupid;
    }
  });

  test('output array length', function(){
    expect(1);
    equal(4, this.stupid.output().length);
  });

  //module('jQuery#awesome', {
    //// This will run before each test in this module.
    //setup: function() {
      ////this.elems = $('#qunit-fixture').children();
    //}
  //});

  //test('is chainable', function() {
    //expect(1);
    //// Not a bad test to run on collection methods.
    //strictEqual(this.elems.awesome(), this.elems, 'should be chainable');
  //});

  //test('is awesome', function() {
    //expect(1);
    //strictEqual(this.elems.awesome().text(), 'awesome0awesome1awesome2', 'should be awesome');
  //});

  //module('jQuery.awesome');

  //test('is awesome', function() {
    //expect(2);
    //strictEqual($.awesome(), 'awesome.', 'should be awesome');
    //strictEqual($.awesome({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  //});

  //module(':awesome selector', {
    //// This will run before each test in this module.
    //setup: function() {
      //this.elems = $('#qunit-fixture').children();
    //}
  //});

  //test('is awesome', function() {
    //expect(1);
    //// Use deepEqual & .get() when comparing jQuery objects.
    //deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  //});

}(jQuery));

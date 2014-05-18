document.addEventListener( 'DOMContentLoaded', function() {
  var canvas = document.getElementsByTagName('canvas')[0];
  var mouseDown = false;

  var reset = function() { window.gol = new GOL( canvas ); };

  var turnOnCell = function( x, y, forceOn ) {
    // offset click x/y for canvas position
    var rect = canvas.getBoundingClientRect();
    x -= rect.left + document.body.scrollLeft;
    y -= rect.top + document.body.scrollTop;

    // convert to cell location
    x = Math.floor( x / GOL.CELL_WIDTH );
    y = Math.floor( y / GOL.CELL_HEIGHT );

    // toggle cell
    var args = [x,y];
    if( forceOn != undefined ) { args.push( forceOn ); }
    window.gol.setCell.apply( window.gol, args );
  };

  canvas.addEventListener( 'mousemove', function( e ) {
    if( !mouseDown ) { return; }
    turnOnCell( e.clientX, e.clientY, true );
  } );
  canvas.addEventListener( 'mousedown', function( e ) {
    mouseDown = true;
    turnOnCell( e.clientX, e.clientY );
  } );
  canvas.addEventListener( 'mouseup', function() {
    mouseDown = false;
  } );

  // controls
  var nextStep = document.getElementById('next-step');
  var autoStep = document.getElementById('auto-step');
  var clear = document.getElementById('clear');
  var presets = document.getElementById('presets');

  clear.addEventListener( 'click', reset );
  nextStep.addEventListener( 'click', function() { window.gol.update(); } );
  autoStep.addEventListener( 'click', function() {
    if( autoStep.className.match(/on/) ) {
      nextStep.disabled = '';
      clear.disabled = '';
      presets.disabled = '';
      autoStep.innerHTML = 'Auto Step';
      autoStep.className = '';
      window.gol.autoUpdate( false );
    }
    else {
      autoStep.innerHTML = 'Stop';
      autoStep.className = 'on';
      nextStep.disabled = 'disabled';
      clear.disabled = 'disabled';
      presets.disabled = 'disabled';
      window.gol.autoUpdate( true );
    }
  } );
  presets.addEventListener( 'change', function() {
    if( presets.value != '-' ) {
      window.gol.loadPreset( presets.value );
    }
    presets.value = '-';
  } );

  window.addEventListener( 'resize', debounce(reset, 750), false );
  reset();
} );

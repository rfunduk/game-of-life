window.GOL = function( canvas ) {
  this.canvas = canvas;

  // decide on a width/height, we want to draw each cell
  // larger than 1px, so round the window dimensions to fit an even
  // number of cells
  var maxHeight = window.innerHeight - 50; // for controls
  var maxWidth = window.innerWidth;
  this.width = Math.floor(maxWidth / GOL.CELL_WIDTH);
  this.height = Math.floor(maxHeight / GOL.CELL_HEIGHT);
  this.canvas.width = this.width * GOL.CELL_WIDTH;
  this.canvas.height = this.height * GOL.CELL_HEIGHT;

  // default data based on calculated size
  this.defaultData = Array(this.height+1).join(
                       Array(this.width+1).join('0') + "\n"
                     ).trim();
  this.data = this.defaultData;
  this.toroidal = true;

  this.clear();
};

GOL.CELL_WIDTH = 30;
GOL.CELL_HEIGHT = 30;

GOL.AUTO_SPEED = 15;

GOL.PRESETS = {
  gliderGun: [[24,2],[22,3],[24,3],[13,4],[21,4],[23,4],[35,4],[36,4],[12,5],[13,5],[20,5],[23,5],[35,5],[36,5],[1,6],[2,6],[11,6],[12,6],[17,6],[18,6],[21,6],[23,6],[1,7],[2,7],[10,7],[11,7],[12,7],[17,7],[18,7],[22,7],[24,7],[11,8],[12,8],[17,8],[18,8],[24,8],[12,9],[13,9],[13,10]],
  infinite1: [[8,13],[6,14],[8,14],[9,14],[6,15],[8,15],[6,16],[4,17],[2,18],[4,18]],
  infinite2: [[7,6],[8,6],[9,6],[11,6],[7,7],[10,8],[11,8],[8,9],[9,9],[11,9],[7,10],[9,10],[11,10]],
  infinite3: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[11,1],[12,1],[13,1],[14,1],[15,1],[19,1],[20,1],[21,1],[28,1],[29,1],[30,1],[31,1],[32,1],[33,1],[34,1],[36,1],[37,1],[38,1],[39,1],[40,1]],
  pulsar: [[4,1],[5,1],[6,1],[10,1],[11,1],[12,1],[2,3],[7,3],[9,3],[14,3],[2,4],[7,4],[9,4],[14,4],[2,5],[7,5],[9,5],[14,5],[4,6],[5,6],[6,6],[10,6],[11,6],[12,6],[4,8],[5,8],[6,8],[10,8],[11,8],[12,8],[2,9],[7,9],[9,9],[14,9],[2,10],[7,10],[9,10],[14,10],[2,11],[7,11],[9,11],[14,11],[4,13],[5,13],[6,13],[10,13],[11,13],[12,13]],
  glider: [[4,1],[2,2],[4,2],[3,3],[4,3]],
  beehive: [[4,3],[5,3],[3,4],[6,4],[4,5],[5,5]],
  spaceship: [[3,2],[6,2],[7,3],[3,4],[7,4],[4,5],[5,5],[6,5],[7,5]]
};

GOL.prototype.setCell = function( x, y, alive ) {
  var index = x + (y * this.width) + y;
  var state;

  // toggle if no state passed in
  if( alive == undefined ) { state = this.data[index] == '1' ? '0' : '1'; }
  else { state = alive ? '1' : '0'; }

  this.data = this.data.substr(0, index) + state + this.data.substr(index+1);
  this.draw();
};

GOL.prototype.loadPreset = function( name ) {
  this.clear();
  var presetData = GOL.PRESETS[name];
  for( var i = 0; i < presetData.length; i++ ) {
    this.setCell.apply( this, presetData[i] );
  }
};

GOL.prototype.autoUpdate = function( onOff ) {
  var self = this;
  if( onOff ) {
    var f = function() {
      self.update( function() {
        if( self._autoUpdate ) {
          delete self._autoUpdate;
          self._autoUpdate = setTimeout( f, GOL.AUTO_SPEED );
        }
      } );
    };
    self._autoUpdate = setTimeout( f, 0 );
  }
  else {
    clearTimeout( self._autoUpdate );
    delete self._autoUpdate;
  }
};

GOL.prototype.update = function( cb ) {
  var self = this;

  var request = new XMLHttpRequest();
  var params = "width=WIDTH&height=HEIGHT&toroidal=TOROIDAL&data=DATA"
                  .replace('WIDTH', this.width)
                  .replace('HEIGHT', this.height)
                  .replace('TOROIDAL', this.toroidal)
                  .replace('DATA', encodeURI(this.data));
  request.open('GET', '/step?'+params, true);

  request.onload = function() {
    if( request.status >= 200 && request.status < 400 ) {
      self.data = request.responseText;
      self.draw();
      if( typeof(cb) == 'function' ) { cb(); }
    }
    else {
      request.onerror();
    }
  };

  request.onerror = function() {
    alert("Oops... error :(");
    self.data = self.defaultData;
  };

  // send along current state
  request.send( this.data );
};

// drawing functions
GOL.prototype.clear = function() {
  var ctx = this.canvas.getContext('2d');
  ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
  this.drawGrid();
};

GOL.prototype.drawGrid = function() {
  var ctx = this.canvas.getContext('2d');
  ctx.strokeStyle = '#EEEEEE';
  ctx.strokeWidth = 1;

  // vertical lines
  for( var i = 0; i <= this.width; i++ ) {
    ctx.moveTo( i * GOL.CELL_WIDTH, 0 );
    ctx.lineTo( i * GOL.CELL_WIDTH, this.canvas.height );
    ctx.stroke();
  }

  // horizontal
  for( var j = 0; j <= this.height; j++ ) {
    ctx.moveTo( 0, j * GOL.CELL_HEIGHT );
    ctx.lineTo( this.canvas.width, j * GOL.CELL_HEIGHT );
    ctx.stroke();
  }
};

GOL.prototype.draw = function() {
  var data = this.data.replace(/\n/g, '');
  // console.log("data\n"+data);

  var ctx = this.canvas.getContext('2d');

  // var presetBuilder = [];
  for( var index = 0; index < data.length; index++ ) {
    ctx.fillStyle = data[index] == '0' ? '#FFFFFF' : '#BBBBBB';

    // determine x/y of cell for this index
    var y = Math.floor( index / this.width );
    var x = Math.max( (index % this.width), 0 );

    // if( data[index] == '1' ) {
    //   presetBuilder.push([x,y]);
    // }

    ctx.fillRect(
      x * GOL.CELL_WIDTH + 1,
      y * GOL.CELL_HEIGHT + 1,
      GOL.CELL_WIDTH - 2,
      GOL.CELL_HEIGHT - 2
    );
  }
  // console.log(JSON.stringify(presetBuilder));
};

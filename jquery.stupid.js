/*
 * Stupidv1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG:
 */

;(function($){

  $.fn.stupid = function(settings,iplayer){
      if(settings){
        $.extend($.fn.stupid.defaults, settings);
      }
      return this.each(function(){
        $.fn.stupid.init($(this),$.fn.stupid.defaults);
        if(iplayer){
          $.fn.stupid.player=iplayer;
        }
      });
  };
  var st = $.fn.stupid,
      unique = false;

  st.grid = [];
  st.defaults = {
    x_axise:[1,2,3,4,5,6,7,8],
    y_axise:[1,2,3,4,5,6,7,8],
    //todo data.row,data.colum
    data:[],
    duration:2000,
    'size':{'height':20,'width':20,'margin':10,'border':2}
  };
    var _width = st.defaults.size.width,
        _height = st.defaults.size.height,
        _border = st.defaults.size.border,
        _margin = st.defaults.size.margin;
/*
 * input with  x-axise y-axise (Array),gird (double array)
 * default 10x15 grid
 *
 * */
  //private function
  var randST = function(){
    return (Math.random()*10) > 5 ? 's' :'t';
  },
  defaultGridData = function(){
    var dataObject = new Array(st.defaults.x_axise.length);
    for(var i=0;i<dataObject.length;i+=1){
      dataObject[i] = new Array(st.defaults.y_axise.length);
      var gj = dataObject[i];
      for(var j=0;j<gj.length;j+=1){
        gj[j] = randST();
      }
    }
    return {data:dataObject,rows:st.defaults.x_axise.length,colums:st.defaults.y_axise.length};
  },
  tidyGridData = function(conf){
    if(conf.data.length !== conf.colums){
      conf.colums = conf.data.length;
      conf.rows = conf.data[0].length;
      conf.x_axise = conf.x_axise.slice(0,conf.rows);
      conf.y_axise = conf.y_axise.slice(0,conf.colums);
      console.log('correct wrong rows :'+
        conf.rows+' colums :'+conf.colums);
    }
    return conf;
  },
  keyInValue = function(currentInput,value){
    var idname = $(currentInput).attr('id');
    var id= idname.split('-');
    st.data=st.dataObject.data;
    st.data[id[1]][id[2]] = value;
  };
  // public function
  st.init = function(wrapper,conf){
    if(!unique){
      st.wrapper = wrapper;
      wrapper.addClass('little_boy_family');
      if(conf.data.length === 0) {
        st.dataObject= defaultGridData();
      }else{
        st.dataObject = tidyGridData(conf);
      }
      st.gennerGrid(st.dataObject);
      unique = true;
    }
  };

  st.gennerGrid=function(dataObject){
    var rows = dataObject.rows,
        colums = dataObject.colums,
        data = dataObject.data;
    st.grid = new Array(colums);
    st.house = $('<div></div>').addClass('little_boy_house');
    for(var ii=0;ii<colums;ii+=1){
      st.grid[ii]=new Array(rows);
    }
    for(var i=0;i<colums;i+=1){
      for(var j=0;j<rows;j+=1){
        // st.grid[i][j] = document.createElement('input');
        // $(st.grid[i][j]).css('id','boy-'+i+'-'+j);
        // console.log(i+'  '+j);
        // st.grid[i][j].value = data[i][j];
        st.grid[i][j] = $('<input id='+'boy-'+i+'-'+j+' />');
        st.grid[i][j].val(data[i][j]);
        st.placeGrids(st.grid[i][j],j,i);
        st.setGridsEvent(st.grid[i][j],j,i);
        st.house.append(st.grid[i][j]);
      }
    }
    // st.house.offset({top:_height/2+_border,left:_width/2+_border});
    st.house.css('margin',_height);
    st.house.appendTo(st.wrapper);
    var sl=st.house.offset();
    st.placeAxise(rows,colums);
  };

  st.placeGrids = function(item,x,y){
    $(item).addClass('little_boy').width(_width).height(_height).offset({top:(_width+_border+_margin)*y,left:(_height+_border+_margin)*x});
  };
  st.placeAxise = function(rows,colums){
    var axises = $('<div></div>').addClass('LB-axises'),
        xaxise = $('<div></div>').addClass('LB-x-axise'),
        yaxise = $('<div></div>').addClass('LB-y-axise'),
        _x = st.defaults.x_axise,
        _y = st.defaults.y_axise;
    for(var i=0;i<_x.length; i+=1){
        var ti = $('<label></label>').html(_x[i])
                          .width(_width).height(_height)
                          .appendTo(xaxise);
        ti.offset(
                              { top:0,
                                left:(_width+_border+_margin)*i
                              });
    }
    xaxise.width(rows*(_width+_border+_margin)).height(_height+_margin+_border);
    for(var j=0;j<_y.length; j+=1){
        var t=$('<label></label>').html(_y[j])
                  .appendTo(yaxise)
                  .width(_width).height(_height);
          // if(!$.browser.mozilla){

          t.offset(
          {
            top:(_height+_border+_margin)*j,
            left:0
          });
          // }
    }
    yaxise.height(colums*(_height+_border+_margin)).width(_width+_margin+_border);
    axises.append(xaxise,yaxise).appendTo(st.wrapper);
    var allHeight = colums*(_height+_margin+_border);

    xaxise.css('margin-left',_width+_margin+_border);
    st.wrapper.height(allHeight)
              .width(rows*(_width+_margin+_border));
  };
  st.setGridsEvent = function(item,x,y){
    $(item).mouseover(function(e){
      e.currentTarget.focus();
      var that = e.currentTarget;
      var temp = $(that).val();
      $(that).keyup(function(evt){
          switch(evt.keyCode){
            case 83:
              $(that).val('s');
              keyInValue(that,'s');
              break;
            case 84:
              $(that).val('t');
              keyInValue(that,'t');
              break;
          // case 37:
          //left
          // case 38:
            //up
          // case 39:
            //right
          // case 40:
            //down
          }
      });
    });
    $(item).change(function(e){
      var that=e.currentTarget;
      var temp = $(that).val();
      if($(that).val() !=='s' && $(that).val() !=='t'){
        $(that).val(temp.substr(0,1));
      }
    });
    var itid;
    $(item).focusin(function(){
      if(st.player){
        itid=window.setInterval(function(){
            var time = st.defaults.x_axise[x]+ st.defaults.y_axise[y]*10;
            console.log('seek to : '+time+'  iterval id '+ itid);
            st.player.seek(time);
        },st.defaults.duration);
      }
    });
    $(item).focusout(function(){
      console.log('clear interval');
      if(itid){
        window.clearInterval(itid);
      }
    });

  };
  st.output = function(){
    // if no input data it will be safe to use dataObject
    return st.dataObject.data;
  };
  //todo st.save      default data => modify data output
})(jQuery);

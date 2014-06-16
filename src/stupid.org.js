/*
 * stupid
 *
 *
 * Copyright (c) 2014 Ian.Chanry
 * Licensed under the MIT license.
 */
;(function($){

  $.fn.stupid = function(settings,iplayer){
      if(settings){
        $.fn.stupid.settings=$.extend($.fn.stupid.defaults, settings);
      }
      return this.each(function(){
        $.fn.stupid.init($(this),$.fn.stupid.settings);
        if(iplayer){
          $.fn.stupid.player=iplayer;
        }
      });
  };
  
  (function () {
         var cache = {};

         this.tmpl = function tmpl(str, data) {
             // Figure out if we're getting a template, or if we need to
             // load the template - and be sure to cache the result.
             var fn = !/\W/.test(str) ?
                 cache[str] = cache[str] ||
                 tmpl(document.getElementById(str).innerHTML) :

             // Generate a reusable function that will serve as a template
             // generator (and which will be cached).
             new Function("obj",
                 "var p=[],print=function(){p.push.apply(p,arguments);};" +

             // Introduce the data as local variables using with(){}
             "with(obj){p.push('" +

             // Convert the template into pure JavaScript
             str
                 .replace(/[\r\t\n]/g, " ")
                 .split("<%").join("\t")
                 .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                 .replace(/\t=(.*?)%>/g, "',$1,'")
                 .split("\t").join("');")
                 .split("%>").join("p.push('")
                 .split("\r").join("\\'") + "');}return p.join('');");

             // Provide some basic currying to the user
             return data ? fn(data) : fn;
         };
     })();
  
  var st = $.fn.stupid,
      unique = false;
  st.settings ={};
  st.grid = [];
  st.defaults = {
    x_axise:[1,2,3,4,5,6,7,8],
    y_axise:[1,2,3,4,5,6,7,8],
	blurEvent:undefined,
    //@todo data.row,data.colum
    data:[],
	dtime:[],
    duration:2000,
    size:{'height':20,'width':20,'margin':10,'border':2}
  };
  var 	_width = st.defaults.size.width,
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
    var dataObject = new Array(st.settings.x_axise.length);
    for(var i=0;i<dataObject.length;i+=1){
      dataObject[i] = new Array(st.settings.y_axise.length);
      var gj = dataObject[i];
      for(var j=0;j<gj.length;j+=1){
        gj[j] = randST();
      }
    }
    return {data:dataObject,rows:st.settings.x_axise.length,colums:st.settings.y_axise.length};
  },
// update x y axise
  tidyGridData = function(conf){
    if(conf.data.length !== conf.colums){
      conf.colums = conf.data.length;
      conf.rows = conf.data[0].length;
      conf.x_axise = conf.x_axise.slice(0,conf.rows);
      conf.y_axise = conf.y_axise.slice(0,conf.colums);
      //console.log('correct wrong rows :'+
      //  conf.rows+' colums :'+conf.colums);
    }
    return conf;
  },
//return input value
  keyInValue = function(currentInput,value){
    var idname = $(currentInput).attr('id');
    var id= idname.split('-');
    st.data=st.dataObject.data;
    st.data[id[1]][id[2]] = value;
  };

  // public function
  st.init = function(wrapper,conf){
	  _width = st.settings.size.width,
      _height = st.settings.size.height,
      _border = st.settings.size.border,
      _margin = st.settings.size.margin;
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
        data = dataObject.data,
		dtime = dataObject.dtime;
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
        var inp = document.createElement('input');
        st.grid[i][j] = $(inp).attr('title', '当前时间点时间：'	+ dtime[i][j]+ ' 秒')
							  .attr('id','boy-'+i+'-'+j);
        st.grid[i][j].val(data[i][j]);
        st.placeGrids(st.grid[i][j],j,i);
        st.setGridsEvent(st.grid[i][j],j,i);
        st.house.append(st.grid[i][j]);
      }
    }
    st.house.css('margin-left',_margin+_width/2)
            .css('margin-top',_margin+_height/2)
    		.appendTo($(st.wrapper));
    placeAxise(rows,colums);
  };

  st.placeGrids = function(item,x,y){

    $(item).addClass('little_boy')
		   .width(_width).height(_height)
    		.offset({
		      top:(_height+_border+_margin)*y,
		      left:(_width+_border+_margin)*x
		    });
  };
  var placeAxise = function(rows,colums){
    var axises = $('<div></div>').addClass('LB-axises'),
        xaxise = $('<div></div>').addClass('LB-x-axise'),
        yaxise = $('<div></div>').addClass('LB-y-axise'),
        _x = st.settings.x_axise,
        _y = st.settings.y_axise;



    for(var i=0;i<_x.length; i=i+1){
        $('<label></label>').html(_x[i])
		  .width(_width).height(_height)
		  .css('margin-left',(_border+_margin))
          .css('margin-top',0).appendTo(xaxise);
    }
    xaxise.width(rows*(_width+_border+_margin))
			.height(_height+_border)
			.css('margin-left',0+_width/2);

    for(var j=0;j<_y.length; j+=1){
        $('<label></label>').html(_y[j]).width(_width).height(_height)
			.css('margin-top',(_border+_margin))
            .css('margin-left',0).appendTo(yaxise);
    }
    yaxise.height(colums*(_height+_border+_margin))
			.width(_width+_border)
			.css('margin-top',-(_height+_border)+_height/2);

    axises.append(xaxise,yaxise).appendTo(st.wrapper);
    st.wrapper.height(colums*(_height+_margin+_border))
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
		  // @todo case 37
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
    $(item).focusin(
		function(){
      if(st.player){
        itid=window.setInterval(function(){
			var time = st.settings.dtime[y][x];
            st.player.seek(time);
        },st.settings.duration);
      }
    });
    $(item).focusout(function(){
      if(itid){
        window.clearInterval(itid);
      }
	  if(st.settings.blur!==undefined){
		st.settings.blur.apply(item,item);
	  }
    });

  };
  st.output = function(){
    return st.dataObject.data;
  };
  //@todo st.save      default data => modify data output
})(jQuery);

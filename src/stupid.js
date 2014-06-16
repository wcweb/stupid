/*
 * stupid
 *
 *
 * Copyright (c) 2014 Ian.Chanry
 * Licensed under the MIT license.
 */

;(function($){
  $.fn.stupid = function(settings, IPlayer){
    if(settings){
      $.fn.stupid.settings = $.extend($.fn.stupid.defaults,settings);
    }
    if(IPlayer){
      $.fn.stupid.player = IPlayer;
    }
    return this.each(function(){
      $.fn.stupid.init($(this), $.fn.stupid.settings);
    });
  };
  //var tmpl = function(){ return function(){};};

  (function(){
    var cache = {};
    this.tmpl = function tmpl(str, data) {
      var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
        new Function("obj",
           "var p=[],print=function(){p.push.apply(arguments);};"+
           "with(obj){ p.push('" +
            str
              .replace(/[\t\r\n]/g," ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .replace(/\\/g,"\\\\")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'") + "');} return p.join('');");
      return data ? fn(data) : fn;
    };

  })();

  var st = $.fn.stupid;
      st.settings = {};
      st.defaults = {
        data: [
          {time:0,tag:"s",guid:"aabbccdd"},
          {time:30,tag:"t",guid:"aabbccdd"},
          {time:60,tag:"e",guid:"aabbccdd"},
          {time:90,tag:"s",guid:"aabbccdd"},
          {time:120,tag:"s",guid:"aabbccdd"},
          {time:150,tag:"s",guid:"aabbccdd"},
          {time:180,tag:"s",guid:"aabbccdd"},
          {time:210,tag:"s",guid:"aabbccdd"},
          {time:240,tag:"s",guid:"aabbccdd"},
          {time:270,tag:"s",guid:"aabbccdd"},
          {time:300,tag:"s",guid:"aabbccdd"},
          {time:330,tag:"s",guid:"aabbccdd"},
          {time:360,tag:"s",guid:"aabbccdd"},
          {time:390,tag:"s",guid:"aabbccdd"},
          {time:420,tag:"s",guid:"aabbccdd"},
          {time:450,tag:"s",guid:"aabbccdd"}
        ],
        x_axise:[1,2,3,4],
        y_axise:[1,2,3,4],
        changeItemCallback:function(){},
        changeItemsCallback:function(){},
        itemStyle:{'height':20,'widht':20,'margin':{top:20,bottom:20},'border':0},
        behaviors:{s:"s",t:"t",e:"e"}
      };
      //st.wrapper_pannel;
      var selections_panel = tmpl('<div class=\"selections_panel\">'+
        "<% for(var i= 0; i< selections.length;i++){ %>"+
        '<div class="selection_panel" data-target="<%=selections[i].tag%>">'+
        '<%= selections[i].tag %> </div>'+
        "<% } %>" +
        "</div>"),
        behaviors_panel = tmpl('<div class="behaviors_panel">'+
        "<% for(var i= 0; i< behaviors.length;i++){ %>"+
        '<div class="behavior_panel" data-target="<%= behaviors[i].tag%>">'+
        '<%= behaviors[i].tag %> </div>'+
        "<% } %>" +
        "</div>"),
        grids_panel = tmpl('<div id="grids_panel" class="grids_panel"></div>');


 var  mask= $('<div></div>').addClass('st_mask');

 var initPannels = function(){
        // wrapper_panel
        st.wrapper_panel.addClass('little_boy_family');
        // selections panel
        var selections =[{tag:"s"},{tag:"t"}, {tag:"e"}];
        st.selections_panel =$(selections_panel({selections:selections})).appendTo(st.wrapper_panel);
        $(st.selections_panel).on("click",".selection_panel",function(e){
          console.log($(e.currentTarget).attr('data-target'));
        });

        // grid
        st.girds_panel = $(grids_panel({data:{}})).appendTo(st.wrapper_panel);
        initGrids();
      },
      initGrids = function(){
        var width = $(st.wrapper_panel).width(),
            //height = $(st.wrapper_panel).height()*0.8,
            height = 400;
            margin = st.settings.itemStyle.margin;
        var data = st.settings.data,
            timesArray = data.map(function(x){
              var d = new Date();
              d.setHours(0);
              d.setMinutes(0);
              d.setSeconds(x.time);
              console.log(d.getTime());
              return d;
            }),
            timeLinear = d3.scale.linear()
                        .domain([0, d3.max(data)])
                        .range([0, 600]);
                        console.log(timesArray);

        var grids = d3.select(".grids_panel").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(80,"+ -40 + ")");

        var xScale = d3.time.scale.utc()
              .domain(timesArray)
                    .nice(15)
              .range([0, 100])
          ,yScale = d3.time.scale.utc()
              .domain(timesArray)
                    .nice(15)
              .range([100,0])
            ;

       var format = function(c){
         var f=d3.time.format(':%S');
          f.parse(c);
          return "ss";
       }

        var xAxis = d3.svg.axis().scale(xScale).orient("bootom")
                    //.ticks(d3.time.second,30)
            ,yAxis = d3.svg.axis().scale(yScale).orient("left")
                    //.ticks(d3.time.second,30)
                    //.tickFormat(format)
            ;
        grids.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0,"+(height)+ ")")
          .call(xAxis);

        grids.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,"+(height-100)+ ")")
          .call(yAxis);

        var grid = grids.append("g")
              .attr("class", "grids")
              .attr("transform", "translate(0,"+height/2+")")
              .selectAll(".grid")
              .data(data)
           .enter().append("g")
              .attr("class", "grid")
              .attr("transform",function(d,i){return "translate("+i*40+",0)";})
              .text(function(d){ return d.tag;});

        grid.append("rect")
            .attr("y", function(d) { d})
            .attr("width",30)
            .attr("height",30);
        grid.append("text")
            .attr("dy",".75em")
            .text(function(d){return d.tag;});
        //var grid = d3.selectAll("dt")
              //.data(function(d){return d;})
              //.enter().append("dt")
                //.text(function(d) { return d.tag;});
      };

   st.init = function(wrapper, settings){
     st.wrapper_panel = wrapper;
     initPannels();
   };


})(jQuery);

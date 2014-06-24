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
        selections: [{tag:"s"},{tag:"t"}, {tag:"e"}],
        x_axise:[1,2,3,4],
        y_axise:[1,2,3,4],
        changeItemCallback:function(){},
        changeItemsCallback:function(){},
        itemStyle:{'height':20,'widht':20,'margin':{top:20,bottom:20},'border':0},
        behaviors:{s:"s",t:"t",e:"e"}
      },
      st.views={};
      //st.wrapper_pannel;
  var wrapper_template = '<div class="selections_panels"></div>'+
                          '<div class="grids_panels"></div>',
      selection_panel_template = '<div class="selection_panel" id="<%= name %>" data-target="<%= tag%>">'+
                              '<div class="mask hide">' +
                              '<div class="options ">'+
                              '<input type="checkbox" id="check1" >preview</input>'+
                              '</div>'+
                              '<div class="buttons"><button class="btn submit_btn">提交</button>'+
                              '<button class="btn exit_btn">exit</button></div>' +
                              '</div>'+
                                '<div class="selection_icon"><%= tag %></div>'+
                                "</div>",
      behaviors_panel = tmpl('<div id="behaviors_panel"  class="behaviors_panel">'+
                                "<% for(var i= 0; i< behaviors.length;i++){ %>"+
                                '<div class="behavior_panel" data-target="<%= behaviors[i].tag%>">'+
                                '<%= behaviors[i].tag %> </div>'+
                                "<% } %>" +
                                "</div>" +
                                '<div class="st_messages"></div>'),
      behaviors_mask = tmpl('<div  class="mask behaviors_mask">'+
                              '</div>'),
      grids_mask = tmpl('<div class="mask"></div>'),
      grids_panel = tmpl('<div id="grids_panel" class="grids_panel"></div>');

   st.init = function(wrapper, settings){
     initPannels(wrapper, settings);

   };



   var Panel = {
     view:"",
     controller:function(){
     },
     model:{},
     templateEnginer: tmpl,
     events:[],
     group:{},


     createInstant: function(name, groupName){
       var panel = new Observer();
       //panel.view = tmpl(view);

       // event -> status(controller) -> view

       // name meanings ID
       panel.name = name;
       panel.groupName = groupName;
       panel.events = [];

       var self = this;
       panel.configure = function( panelConfig ){

         panel.view = self.templateEnginer(panelConfig.view);
         panel.model = $.extend(panelConfig.model, {name: panel.name});
         panel.status = Object.keys(panelConfig.status);
         panel.currentStatus = panelConfig.currentStatus;
         for(var s in panelConfig.status){
           panel.subscribe(s,panelConfig.status[s]);
         }
       }
       var joinGroup = function(panel, groupName){
         if(!Object.keys(self.group).some(function(elm){return elm == groupName;})){
           self.group[groupName] = [];
         }
         self.group[groupName].push(panel);
       };

       joinGroup(panel,groupName);

       panel.complie = function(){
         return panel.view(panel.model);
       };

       panel.toggleStatus = function toggleStatus(){
         var args = Array.prototype.slice.call(arguments);
         if(args.length == 0){
           // toggleStatus("");
           nextStatus(panel.status, panel.status.indexOf(panel.currentStatus));
         }else if(args.length == 1){
           // toggleStatus("singleStatus") add
           if(typeof(args[0]) == "string"){
             var status =  args[0];
             for( var k in panel.status){
               if(status == panel.status[k]){
                 if(panel.status[k] == panel.currentStatus){
                   var nextStatusK = nextStatus(panel.status, k);
                   panel.dispath(panel.status[nextStatusK]);
                 }else{
                   panel.dispath(panel.status[k]);
                 }
               }
             }
           }else if(Object.prototype.toString.call(args[0]) == '[object Array]'){
               // toggleStatus("active", "inactive") oppsit
              var argStatus = getKeys(panel.status,args[0]);
              for(var i=0; i<argStatus.length; i++){
                if(args[0][argStatus[i]] == panel.currentStatus){
                  var nextStatusK  = nextStatus(argStatus, i);
                   panel.dispath(panel.status[nextStatusK]);
                  break;
                }
              };
           }
         } else {
         };
       };
       panel.registerEvent = function(eventName, eventTarget, handler, status, relateGroup){
         panel.events.push({eventName: eventTarget});
         $('#'+panel.name).on(eventName,eventTarget, function(e){
           panel.toggleStatus(status);
           var otherPanels = [];
           if(relateGroup){
              var parentGroup = self.group[panel.groupName];
              for(var other in parentGroup){
                if(parentGroup[other] == panel) continue;
                otherPanels.push(parentGroup[other]);
                if(parentGroup[other].currentStatus !== panel.currentStatus ) continue;
                if( parentGroup[other].currentStatus == status[0]){
                  parentGroup[other].toggleStatus(status);
                }
              }
           }
           console.log(otherPanels);
           handler.call(null, e, otherPanels);
         });
       };

       panel.registerStatus = function(statusName, handler){

       }

       return panel;
     }
   };
   var initPannels = function(wrapper,settings){
        // wrapper_panel
        var views = st.views;
        views.wrapper_panel = wrapper.append(tmpl(wrapper_template)({}));
        // selections panel

        views.selections_panels = views.wrapper_panel.find(".selections_panels");
        for(var k in settings.selections){
          (function(){
          var selections = settings.selections;
          var selection_panel = Panel.createInstant('selections_panel_'+selections[k].tag,'selections_panels');

          selection_panel.configure(
            {
              model:selections[k],
              view: selection_panel_template,
              status: {
                "active":function(){
                  $('#'+selection_panel.name).addClass("active");
                  $('#'+selection_panel.name).find('.mask').show();
                },
                "inactive":function(){
                  $('#'+selection_panel.name).toggleClass("active");
                  $('#'+selection_panel.name).find('.mask').hide();
                }
              },
              currentStatus:'inactive'
            }
          );

          views.selections_panels.append(selection_panel.complie());

          selection_panel.registerEvent('click','.selection_icon', function(evt, others){
                  var maxZindex = 0;
                  for(var k=0; k<others.length; k++){
                    var curZindex = $('#'+others[k].name).css("z-index");
                    maxZindex = curZindex > maxZindex ?
                    function(){$('#'+others[k].name).css("z-index",maxZindex);
                    return curZindex;}: maxZindex;
                  }
          }, ["active","inactive"], true);

          selection_panel.registerEvent('click','.exit_btn', function(evt){
          }, ["active","inactive"], true);

          })();
        }


        // grid
        
        $(document).on('changeGrid', function(e,data,d3Object){
            console.log("changeGird: ",data,d3Object);
            switch(d3.select(d3Object).attr("class")){
               case "grid_m" :
                  d3.select(d3Object).attr("class","grid_t");
                  break;
              case "grid_t" :
                 d3.select(d3Object).attr("class","grid_s");
                 break;
              case "grid_s" :
                d3.select(d3Object).attr("class","grid_m");
                break;
            default:
                d3.select(d3Object).attr("class","grid_m");
                break;
                 
            }
        
          
        });
        
        st.grids_panels = views.wrapper_panel.find(".grids_panels");
        $(grids_panel({data:{}})).appendTo(st.grids_panels);

        var gs = {
          each_line:10,
          width:65,
          height:65,
          margin:5
        };
        var width = $(views.wrapper_panel).width(),
            //height = $(views.wrapper_panel).height()*0.8,
            height = (gs.height+gs.margin)*9;
            margin = st.settings.itemStyle.margin;
        var data =st.settings.data.map(function(elem){
             return elem = $.extend(elem, {cx:0,cy:0});
        }),
        
            timesArray = data.map(function(x){
              var d = new Date();
              d.setHours(0);
              d.setMinutes(0);
              d.setSeconds(x.time);
              return d;
            }),
            timeLinear = d3.scale.linear()
                        .domain([0, d3.max(data)])
                        .range([0, 600]);
                  
        var grids = d3.select(".grids_panel").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            //.attr("transform", "translate(80,"+ -40 + ")");

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
          
          var clickGird = d
        var dragGird = d3.behavior.drag()
              .origin(function(d) { return d; })
              .on('dragstart', function(){
                d3.event.sourceEvent.stopPropagation();
                //console.log("start dtrag");
              })
              .on('drag', function(d,i) {
                // console.log(d3.event);
                // d.cx += d3.event.dx;
                if(d3.event.dy>5){
                    $(document).trigger("changeGrid", [d,this]);
                }
                d.cy += d3.event.dy;
                //console.log(d);
                //d3.select(this).attr('cx', d.cx).attr('cy',d.cy);
                d3.select(this).attr('transform', "translate("+d.cx+","+d.cy+")");
              })
              .on('dragend', function(d){
                  d.cx = 0;
                  d.cy = 0;
                  d3.select(this).attr('transform',
                      "translate(0,0)");
              });


        var grid = grids.append("g")
              .attr("class", "grids")
              //.attr("transform", "translate(0,"+height/2+")")
              .selectAll(".grid")
              .data(data)
           .enter().append("g")
              .attr("class", "grid")
              .attr("transform",function(d,i){

                return "translate("+(i%gs.each_line*(gs.width+gs.margin))+","+
                  (Math.floor(i/gs.each_line)*(gs.height+gs.margin))+")";
              });

              grid.append("rect")
                  .attr("class","grid_background")
                  .attr("width",gs.width).attr("height",gs.height);

        var dragRect = grid.append("rect")
            .attr("y", function(d) {
                //console.log(d);
                 d;})
            // .attr("cx", function(d) {return d.cx})
    //         .attr("cy", function(d) {return d.cy})
                // .data({cx:0,cy:0})
            .attr("width",gs.width)
            .call(dragGird)
            .call(clickGird)
            .attr("height",gs.height);

        dragRect.append("text")
            .attr("dy",".75em")
            .text(function(d){return d.tag;})
            .attr("transform", function(d){return "translate(10,10)"});
       
        //var grid = d3.selectAll("dt")
              //.data(function(d){return d;})
              //.enter().append("dt")
                //.text(function(d) { return d.tag;});
      };
         //
      if (!Array.prototype.some)
      {
        Array.prototype.some = function(fun /*, thisArg */)
        {
          'use strict';

          if (this === void 0 || this === null)
            throw new TypeError();

          var t = Object(this);
          var len = t.length >>> 0;
          if (typeof fun !== 'function')
            throw new TypeError();

          var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
          for (var i = 0; i < len; i++)
          {
            if (i in t && fun.call(thisArg, t[i], i, t))
              return true;
          }

          return false;
        };
      }
         var nextStatus = function(status, currentStatusKey){
             return currentStatusKey = (currentStatusKey+1) % status.length;
           },
           getKeys = function(array,args){
            var keys = [];
            for(var i=0; i<args.length; i++){
              array.some(function(elem, index){
                if(args[i] == elem){
                  keys.push(index);
                  return true;
                }else{
                  return false;
                }
              });
            }
            return keys;
          };

   var Observer = function Observer(){
     this.maneger = {};
     this.currentStatus ="";
   };

   Observer.prototype = {
     subscribe: function(statusName,fn){
       if(!Object.keys(this.maneger).some(function(el){return statusName == el;})){
         this.maneger[statusName] = [];
       }
       this.maneger[statusName].push(fn);
     },
     unsubscribe: function(statusName,fn){
       var eventFns =this.maneger[statusName];
       for(var m in eventFns){
         if(eventFns[m] == fn){
           eventFns.slice(m,1);
         }
       }
     },
     dispath:function(statusName, target){
       var scope = target || window;
       var eventFns =this.maneger[statusName];
       this.currentStatus = statusName;
       for(var f in eventFns){
            eventFns[f].call(scope);
       };

     }
   };


})(jQuery);

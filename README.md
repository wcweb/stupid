stupid
======

jquery plugin for determine what  (s,t)  happen in some durations of the video with player( jwplayer).
<p> this plugin is only use for student-teacher behave analysis.</p>

 >  ```  <script>
 >       var player = new Function;
 >       $(document).ready(function(){
 >        $('#st_wraper').stupid(
 >       {
 >         x_axise:[0,1,2,3,4,5,6,7,8,10,9,11],
 >         y_axise:[0,1,2,3,4,5,6,7,8,9,10,20],
 >		   duration:2000,
 >         data:[['s','t','t','t','t','t','s'],['s','s','s','s','s','t','t']],
 >         'size':{'height':20,'width':20,'margin':10,'border':2}
 >       },player
 >         );
 >       });
 >     </script> ```

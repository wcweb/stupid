# instruction behavior analyser.

Instruction behavior analyser.

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/wcweb/jquery-stupid/master/dist/jquery.stupid.min.js
[max]: https://raw.github.com/wcweb/jquery-stupid/master/dist/jquery.stupid.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/stupid.min.js"></script>
<script>
var player = new Function;
$(document).ready(function(){

  $('#st_wraper').stupid(
{
  x_axise:[0,1,2,3,4,5,6,7,8,10,9,11],
  y_axise:[0,1,2,3,4,5,6,7,8,9,10,20],
  data:[['s','t','t','t','t','t','s'],['s','s','s','s','s','t','t']],
  'size':{'height':20,'width':20,'margin':10,'border':2}
},player
  );
});
</script>
<section>
获取当前整个数据表 return array：
<code>$('#st_wraper').stupid.output()</code>
</section>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

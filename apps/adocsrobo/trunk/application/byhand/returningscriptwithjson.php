<h1>Returning Script with JSON</h1>

<p>It may be that you wish to have some bit of javascript
   execute when your JSON call is returned to the browser.
   You can do this with the x6script() function, which 
   takes as its argument a fragment of Javascript that will
   execute on the browser.
</p>

<p>The example below is identical to the prior page, except
   for the very last line, which adds script to the JSON
   return payload.
<p>

<pre>
<?php
class x6jsonexample extends androX6 {
    function x6main() {
        # Conventional HTML generation...
        $top = html('div');
        $top->h('h1','Hello JSON!');
        $top->h('p' ,'The server time is:');
        
        # Give this element an ID, so it can be
        # refreshed.
        $p = $top->h('p' ,date('r',time()));
        $p->hp['id'] = 'the_time_paragraph';
        
        $input = $top->h('input','Refresh Time');
        $input->hp['type'] = 'button';
        $input->code['click'] = <<<JS
        function(e) {
            ua.json.init('x6page','jsonexample');
            ua.json.addParm('x6action','refreshtime');
            if(ua.json.execute()) {
                ua.json.process();
            }
        }
JS;
        $top->render();
    }
    
    # This routine handles the call
    function refreshtime() {
        x6html('the_time_paragraph',date('r',time()));
        x6script("alert('Now you know what time I think it is')");
    }
}
?>
</pre>

<p>You can have any amount of script returned with the x6script,
   the only practical limit is bandwidth and the browser's 
   processing power.
</p>

<p>It is safe to put SCRIPT tags around the script, the x6script()
   routine strips them out, so the following is perfectly safe:
</p>

<pre>
<?php
class x6jsonexample extends androX6 {
    function x6main() {
        # .... 
    }
    
    function refreshtime() {
        ob_start();
        ?>
        <script>
        window.newFunction = function() {
            var x = { parm: 'value', parm2: 'value' };
            for(var idx in x) {
                console.log(idx,idx[x]);
            }
        }
        newFunction();
        </script>
        <?php
        x4Script(ob_get_clean());
    }
}
?>
</pre>

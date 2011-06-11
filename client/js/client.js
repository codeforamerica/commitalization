// Client side JS
(function($) {
    $(document).ready(function() {
        var socket = new io.Socket(); 
        socket.on('connect', function() {
            socketHandler.updateStatus('connected');
            socketHandler.updateConnectionStatus('connnected');
        }); 
        socket.on('message', function(message) {
            commitHandler.addCommit(message);
        });
        socket.on('disconnect', function() {
            socketHandler.updateStatus('disconnected');
            socketHandler.updateConnectionStatus('disconnected');
        });
        
        // Conneck the sprockets!
        socket.connect();
        //socketHandler.refreshDisconnect();
        
        // Commitalization go!
        commitHandler.start();
        
        // Handle post test click
        var count = 0;
        $('a.post-test').each(function() {
            var testData = getTestData();
        
            $(this).click(function() {
                $.post('committed', testData[count], function() {
                    // Success
                    count = (count == testData) ? 0 : count + 1;
                });
                return false;
            });
            
        });
    });
})(jQuery);

// Extend jQuery to handle random selectors
jQuery.jQueryRandom = 0;
jQuery.extend(jQuery.expr[":"], {
    random: function(a, i, m, r) {
        if (i == 0) {
            jQuery.jQueryRandom = Math.floor(Math.random() * r.length);
        };
        return i == jQuery.jQueryRandom;
    }
});
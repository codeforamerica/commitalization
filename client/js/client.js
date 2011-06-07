// Client side JS
(function($) {
    $(document).ready(function() {
        var socket = new io.Socket(); 
        socket.on('connect', function() {
            socketHandler.updateStatus('connected'); 
        }); 
        socket.on('message', function(message) {
            commitHandler.addCommit(message);
        });
        socket.on('disconnect', function() {
            socketHandler.updateStatus('disconnected');
        });
        
        // Conneck the sprockets!
        socket.connect();
        
        // Initialize the isotope
        var $container = $('#commit-container');
        $container.isotope({
            itemSelector : '.commit',
            layoutMode : 'masonry',
            animationEngine: 'best-available',
            masonry : {
              columnWidth : 2
            }
        });
        
        // Click handling
        commitHandler.clickHandler();
        
        // Display our palette
        commitHandler.displayPalettes();
        
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
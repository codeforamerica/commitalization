// Client side JS
(function($) {
    $(document).ready(function() {
        var socket = new io.Socket('localhost'); 
        socket.on('connect', function() {
            addCommit('connect'); 
        }); 
        socket.on('message', function() {
            addCommit('message');
        });
        socket.on('disconnect', function() {
            addCommit('disconnect');
        });
        
        socket.connect();
        console.log(socket);
    });
})(jQuery);

/**
 * Add element to commit container.
 */
var addCommit = function(message) {
    $('#commit-container').prepend('<li>' + message + '</li>');
}
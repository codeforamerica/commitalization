/**
 * Socket handler
 */
var socketHandler = {
    connectionStatus: 'waiting',
    disconnectRefreshInterval: 1000,
    lastDisconnect: null,
    
    // Update status
    updateStatus: function(message) {
        $('.status-current').html(message);
    },
    
    // Update connection status
    updateConnectionStatus: function(message) {
        this.status = message;
        
        // Check disconnect
        if (message == 'disconnected') {
            this.lastDisconnect = new Date();
        }
    },
    
    // Refresh after disconnect.  If the disconnect state
    // has been going on for certain interval, refresh page.
    refreshDisconnect: function() {
        var thisSocket = this;
        $(document).everyTime(this.disconnectRefreshInterval - 10, function(i) {
            var now = new Date();
            
            if (thisSocket.lastDisconnect != null && thisSocket.connectionStatus == 'disconnected') {
                var t = now.GetTime();
                var l = thisSocket.lastDisconnect.getTime();
                var i = thisSocket.disconnectRefreshInterval;
                if ((t - l) > i) {
                    $(document).stopTime();
                    window.location.href = window.location.href;
                }
            }
        });
    }
};
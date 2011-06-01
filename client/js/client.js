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
        
        // Handler to open up commits
        $('.commit:not(.commit-latest)').live('click', function() {
            $thisTitle = $(this);
            if ($thisTitle.hasClass('open')) {
                $thisTitle.find('.commit-commits-container').hide();
                $thisTitle.removeClass('open');
            }
            else {
                $thisTitle.find('.commit-commits-container').show();
                $thisTitle.addClass('open');
            }
            $container.isotope('reLayout');
        });
        
        // Handle post test click
        $('a.post-test').click(function() {
            $.post('committed', getPostData(), function() {
                // Success
            });
            return false;
        });
    });
})(jQuery);

/**
 * Example commit data
 */
var getPostData = function() {
    return {
      "before": "5aef35982fb2d34e9d9d4502f6ede1072793222d",
      "repository": {
        "url": "http://github.com/defunkt/github",
        "name": "github",
        "description": "You're lookin' at it.",
        "watchers": 5,
        "forks": 2,
        "private": 1,
        "owner": {
          "email": "chris@ozmm.org",
          "name": "defunkt"
        }
      },
      "commits": [
        {
          "id": "41a212ee83ca127e3c8cf465891ab7216a705f59",
          "url": "http://github.com/defunkt/github/commit/41a212ee83ca127e3c8cf465891ab7216a705f59",
          "author": {
            "email": "chris@ozmm.org",
            "name": "Chris Wanstrath"
          },
          "message": "okay i give in",
          "timestamp": "2008-02-15T14:57:17-08:00",
          "added": ["filepath.rb"]
        },
        {
          "id": "de8251ff97ee194a289832576287d6f8ad74e3d0",
          "url": "http://github.com/defunkt/github/commit/de8251ff97ee194a289832576287d6f8ad74e3d0",
          "author": {
            "email": "chris@ozmm.org",
            "name": "Chris Wanstrath"
          },
          "message": "update pricing a tad",
          "timestamp": "2008-02-15T14:36:34-08:00"
        }
      ],
      "after": "de8251ff97ee194a289832576287d6f8ad74e3d0",
      "ref": "refs/heads/master"
    }
}
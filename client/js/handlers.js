/**
 * Commit handler object
 */
var commitHandler = {
    commits: [],
    projectColors: {},
    colors: ['#3366FF', '#6633FF', '#CC33FF', '#FF33CC', '#33CCFF',
            '#003DF5', '#002EB8', '#FF3366', '#33FFCC', '#B88A00', '#F5B800', 
            '#FF6633', '#33FF66', '#66FF33', '#CCFF33', '#FFCC33'],
    borderWidth: 3,
    halfThreshhold: 15,
    totalThreshold: 100,
    projectCount: 0,
    commitCount: 0,

    addCommit: function(commit) {
        if (this.validateCommit(commit)) {
            commit = this.getMeta(commit);
            this.commits.push(commit);
            
            // Remove any latest commit classes and add new one
            $('#commit-container .commit').removeClass('commit-latest');
            $newCommit = $(this.commitMarkup(commit, true)).addClass('commit-latest');
            $('#commit-container').prepend($newCommit);
            
            // Update with fun colors and other styling
            this.updateSizes();
            this.updateColors();
            
            // Fancy isotope stuff
            $('#commit-container').isotope('reloadItems')
                .isotope({ sortBy: 'original-order' }).isotope('reLayout');
            
            // Add nice time formats that update automatically
            $('.timeago').timeago();
            
            // Update stats
            this.updateStats(commit);
        }
    },
    
    // Commit markup
    commitMarkup: function(commit) {
        var output = '';
        var commitCount = Object.keys(commit.commits).length;
        // Assign a color
        this.matchColor(commit.repository.name);
        
        
        // Start container
        output += '<div class="commit commit-' + commit.commitID + ' repo-' + commit.repository.name + '">';
        output += '<div class="commit-title-container">';
        
        // Push recieved
        output += '<div class="commit-recieved timeago" title="' + commit.received + '">' + 
            commit.received + '</div>';
        
        // Commit count
        output += '<div class="commits-title">' + commitCount + ' commits</div>';
        
        // Project information
        output += '<div class="commit-project">' + 
            '<a href="' + commit.repository.url + '">' + commit.repository.name + '</a> ' +
            '</div>';
        output += '</div>';

        // Commit informtation
        output += '<div class="commit-commits-container">';
        for (var i in commit.commits) {
            output += '<div class="commit-commits commit-' + commit.commits[i].id + '">' +
                '<a class="commit-message" href="' + commit.commits[i].url + '">' + 
                    commit.commits[i].message + '</a>' +
                'Committed <span class="commit-time timeago" title="' + commit.commits[i].timestamp + '">' + 
                    commit.commits[i].timestamp + '</span> by ' + 
                '<a class="commit-author" href="#">' + commit.commits[i].author.name + '</a> ' +
                '</div>';
        }
        output += '</div>';
        
        // Finish and return
        output += '</div>';
        return output;
    },
    
    // Get meta data
    getMeta: function(commit) {
        // Let's assume the first author we find is the only/main author
        commit.author = commit.author || {};
        commit.author.name = commit.commits[0].author.name;
        
        // This is where we would query GitHub to get some more information
        
        // Format time that commit was recieved by server
        commit.received = commit.received || new Date();
        commit.received = dateFormat(commit.received, 'isoDateTime');
        
        return commit;
    },
    
    // Validate commit.  Sometimes we may get duplicates of commits
    // so we should check them out
    validateCommit: function(commit) {
        var valid = true;
    
        // Is it easier to search the DOM or search an array?
        // Probably the array
        for (var i in this.commits) {
            if (this.commits[i].commitID == commit.commitID) {
                valid = false;
            }
        }
        
        return valid;
    },
    
    matchColor: function(projectName) {
        // Check if we already assigned it
        if (typeof this.projectColors[projectName] == 'undefined') {
            this.projectColors[projectName] = this.colors[Math.floor(Math.random() * (this.colors.length + 1))];
        }
        
        return this.projectColors[projectName];
    },
    
    updateColors: function() {
        for (var i in this.projectColors) {
            $('.repo-' + i + ' .commit-project a').css('color', this.projectColors[i]);
            $('.repo-' + i + '.half .commit-recieved').css('border-bottom', '3px solid ' + this.projectColors[i]);
        }
    },
    
    updateSizes: function() {
        // Any commits over half threshold get a new class.
        $('#commit-container .commit').slice(this.halfThreshhold).addClass('half');
    },
    
    clickHandler: function() {
        // Handler to open up commits (could be more eddicient)
        $('.commit:not(.commit-latest)').live('click', function() {
            var $container = $('#commit-container');
            $thisTitle = $(this);
            
            // Check half
            if ($thisTitle.hasClass('half')) {
                $thisTitle.data('half', true);
                $thisTitle.removeClass('half');
            }
            else if ($thisTitle.data('half')) {
                $thisTitle.addClass('half');
            }
            
            // Handle opening
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
    },
    
    displayPallette: function() {
        for (var i in this.colors) {
            $('<li></li>').css('background-color', this.colors[i]).appendTo('ul.palette');
        }
    },
    
    updateStats: function(commit) {
        this.commitCount += Object.keys(commit.commits).length;
        $('li.status-commits').html(this.commitCount);
        
        this.projectCount += Object.keys(this.projectColors).length;
        $('li.status-projects').html(this.projectCount);
    }
};

/**
 * GitHub Data handler
 */
var githubDataHandler = {
    users: {},
    projects: {}
}

/**
 * Socket handler
 */
var socketHandler = {
    // update status
    updateStatus: function(message) {
        $('.status-current').html(message);
    }
};
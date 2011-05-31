/**
 * Commit handler object
 */
var commitHandler = {
    commits: [],

    addCommit: function(commit) {
        if (this.validateCommit(commit)) {
            commit = this.getMeta(commit);
            this.commits.push(commit);
            
            // Remove last commit
            $('#commit-container-latest .commit').appendTo('#commit-container-old').hide().show('slow');
            // Add new items
            $('#commit-container-latest').prepend(this.commitMarkup(commit, true)).hide().show('slow');
            // Add nice time formats that update automatically
            $('.timeago').timeago();
        }
    },
    
    // Commit markup
    commitMarkup: function(commit) {
        var output = '';
        output += '<div class="commit commit-' + commit.commitID + '">';
        
        // Push recieved
        output += '<div class="commit-recieved timeago" title="' + commit.received + '">' + commit.received + '</div>'
        
        // Project information
        output += '<div class="commit-project">Push to ' + 
            '<a href="' + commit.repository.url + '">' + commit.repository.name + '</a> ' +
            '</div>';

        // Commit informtation
        output += '<div class="commits-title">Commits</div><div class="commit-commits-container">';
        for (var i in commit.commits) {
            output += '<div class="commit-commits commit-' + commit.commits[i].id + '">' +
                '<a class="commit-message" href="' + commit.commits[i].url + '">' + commit.commits[i].message + '</a>' +
                'Committed about <span class="commit-time timeago" title="' + commit.commits[i].timestamp + '">' + 
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
        $('#status-current').html(message);
    }
};
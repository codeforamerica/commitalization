// Event emitting object to handle committes
var emitter = require('events').EventEmitter;
var github = require('github');

// Define committer event emitting object
var committer = function(commitLimit) {
    this.posted = false;
    this.commits = [];
    this.commitLimit = commitLimit || 50;
    this.commitID = 0;
    this.committers = [];
}
committer.prototype = new emitter;

// Emit commit event
committer.prototype.emitCommit = function(commit) {
    var i = 0;
    var thisCommitter = this;
    
    // Check that it is an actual commit
    var valid = this.checkCommit(commit);
    if (valid) {
        commit = this.addCommit(commit);
        
        // Add some meta data.  We should cache the users we already
        // have looked up not to anger the GitHub API gods.
        if (typeof this.committers[commit.pusher.name] != 'undefined') {
console.log('FOUND');
            commit.author_meta = this.committers[commit.pusher.name];
            thisCommitter.emit('committed', commit);
        }
        else {
            var githubAPI = new github.GitHubApi(true);
            // Get general author info
            githubAPI.getUserApi().show(commit.pusher.name, function(err, response) {
                commit.author_meta = response;
                thisCommitter.committers[commit.pusher.name] = response;
                
                // Send it out
                thisCommitter.emit('committed', commit);
            });
        }
    }
    
    return valid;
}

// Get commits
committer.prototype.getCommits = function() {
    return this.commits;
}

// Check commits
committer.prototype.checkCommit = function(data) {
    var valid = false;
    
    if (typeof data != 'undefined') {
        if (data.before && data.after) {
            valid = true;
        }
    }
    
    return valid;
}

// Add commit.  We manage new commits on the end of
// the array and take off old ones from the begginning.
committer.prototype.addCommit = function(commit) {
    this.commitID++;
    commit.commitID = this.commitID;
    
    // Add some metadata
    commit.received = new Date();
    
    // Push it to the list
    var length = this.commits.push(commit);
    
    // Check if too long
    if (length > this.commitLimit) {
        for (var i = 0; i < length - this.commitLimit; i++) {
            this.commits.shift();
        }
    }
    
    return commit;
}

// Export it
exports.committer = committer;
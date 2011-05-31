// Event emitting object to handle committes
var emitter = require('events').EventEmitter;

// Define committer event emitting object
var committer = function(commitLimit) {
    this.posted = false;
    this.commits = [];
    this.commitLimit = commitLimit || 20;
    this.commitID = 0;
}
committer.prototype = new emitter;

// Emit commit event
committer.prototype.emitCommit = function(commit) {
    var valid = this.checkCommit(commit);
    if (valid) {
        commit = this.addCommit(commit);
        this.emit('committed', commit);
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
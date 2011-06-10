/**
 * Commit handler object
 */
var commitHandler = {
    commits: [],
    projectColors: {},
    palettes: {
        'default': ['#3366FF', '#CC33FF', '#FF33CC', '#33CCFF',
            '#003DF5', '#002EB8', '#FF3366', '#33FFCC', '#B88A00', '#F5B800', 
            '#FF6633', '#33FF66', '#66FF33', '#CCFF33', '#FFCC33'],
        'spring': ['#90AB76', '#E880A2', '#67A6A6', '#630947', '#F5AA9D',
            '#E2F09C', '#FDD3E1', '#FA1B5E', '#FA6693', '#86BD77', '#F69E9E', 
            '#FFB3C5', '#ED4051', '#FF6D32', '#FBB7A2'],
        'fire': ['#FCE138', '#FBDB34', '#FAD531', '#F9CF2E', '#F9C92B', '#F8C328', 
            '#F7BD25', '#F6B722', '#F6B11F', '#F5AB1B', '#F4A518', '#F39F15', '#F39912', 
            '#F2930F', '#F18D0C'],
        'craft': ['#BD2A4E', '#654B6B', '#628179', '#899738', '#34AB1A', '#8CB6A9', '#396ACC', '#A82A54', '#C29819', '#244844', '#AFA689', '#E5A600', '#F03737', '#CC9C0A', '#E4444C']
        },
    palette: 'default',
    paletteColorIndex: 0,
    borderWidth: 3,
    halfThreshhold: 25,
    totalThreshold: 100,
    projectCount: 0,
    commitCount: 0,
    fileChanges: {},
    minFileCount: 0,
    maxFileCount: 1,
    projectSelectorDimensionMax: 30,
    projectSelectorDimensionMin: 10,
    playing: null,
    playingInterval: 4000,

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
            // Update project selector
            this.updateProjectSelector();
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
        // See server side for details, but we really are only getting full
        // data for the author of the push, not each commit, so we are hoping
        // it all matches up.
        output += '<div class="commit-commits-container">';
        for (var i in commit.commits) {
            output += '<div class="commit-commits commit-commits-' + commit.commits[i].id + '">' +
                '<img class="commit-commit-user" src="https://secure.gravatar.com/avatar/' + 
                    commit.author_meta.gravatar_id + '" />' +
                '<a class="commit-message" href="' + commit.commits[i].url + '">' + 
                    commit.commits[i].message + '</a>' +
                'Committed <span class="commit-time timeago" title="' + commit.commits[i].timestamp + '">' + 
                    commit.commits[i].timestamp + '</span> by ' + 
                '<a class="commit-author" href="http://github.com/'  + commit.author_meta.login + '">' + 
                    commit.commits[i].author.name + '</a> ' +
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
    
    // Assign a color to a project
    matchColor: function(projectName, force) {
        var force = force || false;

        // Check if already assigned
        if (typeof this.projectColors[projectName] == 'undefined' || force) {
            // Choose next one
            this.projectColors[projectName] = this.palettes[this.palette][this.paletteColorIndex];
            
            // Increment color index
            this.paletteColorIndex++;
            if (this.paletteColorIndex > this.palettes[this.palette].length) {
                this.paletteColorIndex = 0;
            }
        }
        return this.projectColors[projectName];
    },
    
    // Update all the already set project colors.
    updateProjectColors: function(projectName) {
        for (var i in this.projectColors) {
            this.matchColor(i, true);
        }
    },
    
    // Update colors on the screen.
    updateColors: function() {
        for (var i in this.projectColors) {
            $('.repo-' + i + ' .commit-project a').css('color', this.projectColors[i]);
            $('.repo-' + i + '.half .commit-recieved').css('border-bottom', '3px solid ' + this.projectColors[i]);
        }
    },
    
    // Update sizes of items.
    updateSizes: function() {
        // Any commits over half threshold get a new class.
        $('#commit-container .commit').slice(this.halfThreshhold).addClass('half');
    },
    
    // Click handler for commit items.
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
    
    // Display palette switcher.
    displayPalettes: function() {
        // This should only be done once.
        var thisCommitter = this;
    
        // Go through palettes.
        for (var p in this.palettes) {
            // Create palette display
            $('<ul class="palette palette-' + p + '"></ul>').data('committer-palette', p).appendTo('div.settings');
            for (var c in this.palettes[p]) {
                $('<li></li>').css('background-color', this.palettes[p][c]).appendTo('ul.palette-' + p);
            }
            
            // Randomize pallete
            this.palettes[p].sort(function() {return 0.5 - Math.random()});
        }
        
        $('ul.palette-' + this.palette).addClass('active');
        $('ul.palette').hover(function() {
            $(this).toggleClass('viewing');
        });
        $('ul.palette').click(function() {
            var palette = $(this).data('committer-palette');
            
            if (!$(this).hasClass('active')) {            
                $('ul.palette').removeClass('active');
                $(this).addClass('active');
                thisCommitter.palette = palette;
                thisCommitter.updateProjectColors();
                thisCommitter.updateColors();
                thisCommitter.updateProjectSelector();
            }
        });
    },
    
    // Display project selector
    updateProjectSelector: function() {
        $('#project-selector a').remove();
        for (var i in this.fileChanges) {
            // Determine dimension
            var a = this.minFileCount;
            var b = this.fileChanges[i];
            var c = this.maxFileCount;
            var d = this.projectSelectorDimensionMin;
            var e = this.projectSelectorDimensionMax;
            if (c == a) {
                var final = e;
            }
            else {
                var final = Math.ceil((e - d) * ((b - a) / (c - a)) + d);
            }
            
            // It's easier to deal with this here
            $('#project-selector').css('background-color', '#111111');

            // Add box
            $addition = $('<a></a>').addClass('project-' + i)
                .attr('title', 'Filter by: ' + i)
                .attr('data-filter', '.repo-' + i)
                .css('background-color', this.projectColors[i])
                .css('width', String(final) + 'px')
                .css('height', String(final) + 'px')
                .appendTo('#project-selector');
        }
        // Show all link
        final = Math.ceil((0.5 * (e - d)) + d);
        $('<a></a>').addClass('project-none')
                .attr('title', 'Reset filters and show all projects.')
            .attr('data-filter', '*')
            .css('background-color', '#EEEEEE')
            .css('width', String(final) + 'px')
            .css('height', String(final) + 'px')
            .appendTo('#project-selector');
            
        // Make the commit container just slightly bigger than selector
        var selectHeight =  $('#project-selector').height();
        $('#commit-container').css('min-height', (selectHeight + 20) + 'px');
        
    },
    
    // Handler for project select clicks
    projectSelectHandler: function() {
        $('#project-selector a').live('click', function() {
            $('#project-selector a').removeClass('active');
            $(this).addClass('active');
            $('#commit-container').isotope({ filter: $(this).attr('data-filter') });
            return false;
        });
        $('#project-selector a').tipsy({
            live: true,
            gravity: 'east',
            fade: true
        });
    },
    
    // Update the stats.
    updateStats: function(commit) {
        // Collect file changes by project
        var types = ['added', 'modified', 'deleted'];
        var collected = 0;
        for (var i in commit.commits) {
            for (var t in types) {
                if (typeof commit.commits[i][types[t]] != 'undefined' && 
                    typeof commit.commits[i][types[t]].length != 'undefined') {
                    collected += Object.keys(commit.commits[i][types[t]]).length;
                }
            }
        }
        this.fileChanges[commit.repository.name] = this.fileChanges[commit.repository.name] || 0;
        this.fileChanges[commit.repository.name] += collected;
        collected = this.fileChanges[commit.repository.name];
        this.minFileCount = (this.minFileCount == 0 || collected < this.minFileCount) ? collected : this.minFileCount;
        this.maxFileCount = (this.maxFileCount == 1 || collected > this.maxFileCount) ? collected : this.maxFileCount;

        // Update bottom display with project and commit count
        this.commitCount += Object.keys(commit.commits).length;
        $('li.status-commits').html(this.commitCount);
        this.projectCount = Object.keys(this.projectColors).length;
        $('li.status-projects').html(this.projectCount);
    },
    
    // Play.  Simulate clicks on screen indefinitely.
    playHandler: function() {
        var thisCommitter = this;
        $('a.play').click(function() {
            $thisLink = $(this);
            if ($thisLink.hasClass('playing')) {
                $thisLink.removeClass('playing');
                $thisLink.html('off');
                $(document).stopTime();
            }
            else {
                $thisLink.addClass('playing');
                $thisLink.html('on');
                $(document).everyTime(thisCommitter.playingInterval, function(i) {
                    // Determine what event will happen
                    var rand = Math.random();
                    if (rand < 0.50) {
                        $('.commit:random').trigger('click');
                    }
                    else if (rand < 0.75) {
                        $('#project-selector a:random').trigger('click');
                    }
                    else {
                        $('.palette li:random').trigger('click');
                    }
                });
            }
            
            return false;
        });
    }
};

/**
 * Socket handler
 */
var socketHandler = {
    // update status
    updateStatus: function(message) {
        $('.status-current').html(message);
    }
};
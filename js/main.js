;(function($, Modernizr, _gaq, storyTestOpts) {
  // App-wide options 
  _.defaults(storyTestOpts, { 
    ignoreCookies: false, // Ignore cookies
    stories: {
      'elk-poster': './stories/elk-poster/index.html',
      'elk-linear': './stories/elk-linear/index.html',
      'elk-node-graph': './stories/elk-node-graph/index.html',
      'elk-slideshow': './stories/elk-slideshow/index.html',
      'elk-compressed': './stories/elk-compressed/index.html'
    }
  });
  // Story formats that the user has seen
  var seen = $.cookie('floodlight_storytest_seen');
  if (seen && !storyTestOpts.ignoreCookies) {
    seen = JSON.parse(seen);
  }
  else {
    seen = {};
  }
  // UserId, usually the e-mail address
  var userId;

  // Get unseen story ids
  function getStoryIds(seen) {
    // HACK: This was fun to write, but is kind of ridiculous
    return _.chain(storyTestOpts.stories).map(function(url, id) {
      if (seen[id]) {
        return undefined;
      }
      return id;
    }).reject(_.isUndefined).value();
  }

  // Mark a particular story as seen
  function setSeen(id) {
    seen[id] = true;
    $.cookie('floodlight_storytest_seen', JSON.stringify(seen), {
      expires: 30,
      path: '/'
    });
  }

  /**
   * Navigate to the response form.
   */
  function showSurvey() {
      window.location = googleFormUrl;  
  }

  function getUserId(opts) {
    opts = opts || {};
    var inputVal;
    var saveToCookie = false;

    if (typeof userId == 'undefined') {
      // First try getting it from the cookie
      userId = $.cookie('floodlight_storytest_userid');
    }

    if (typeof userId == 'undefined') {
      // Then try getting it from the form
      inputVal = $('input[name=userid]').val(); 
      if (inputVal.length) {
        userId = inputVal;
        saveToCookie = true;
      }
    }

    if (typeof userId == 'undefined' && opts.setRandom) {
      // Generate a random userId
      userId = uuid.v4();
      saveToCookie = true;
    }

    if (saveToCookie) {
      $.cookie('floodlight_storytest_userid', userId, {
        expires: 30,
        path: '/'
      });
    }

    return userId;
  }

  function displayUserId() {
    var userId = getUserId();
    // If the userId is present, hide the form elements
    if (userId) {
      $('#userid-container').hide();
      $('input[name=userid]').val(userId);
    }
  }

  /**
   * Launch the story viewer in fullscreen mode.
   */
  function showStory(id) {
    setSeen(id);
    window.location = storyTestOpts.stories[id];
  }

  function getRandomStoryId(storyIds) {
    var idx = Math.floor(Math.random() * storyIds.length);
    return storyIds[idx];
  }

  function updateIntro() {
    var storyIds = getStoryIds(seen);
    // No remaining stories, 
    if (!storyIds.length) {
      $('#intro-default').hide();
      $('#intro-returning').hide();
      $('#intro-finished').show();
      $('#view-story-form').hide();
    }
    else if (_.size(seen)) {
      $('#intro-default').hide();
      $('#intro-returning').show();
      $('#intro-finished').hide();
      $('#view-story-form').show();
    }
    else {
      $('#intro-default').show();
      $('#intro-returning').hide();
      $('#intro-finished').hide();
      $('#view-story-form').show();
    }
  }

  $(function() {
    if (!Modernizr.csstransforms3d) {
      // Unsupported browser.  Show an error message and track an event
      // with Google Analytics
      $('#unsupported-browser-alert').show(); 
      _gaq.push(['_trackEvent', 'Unsupported Browser', 'Unsupported Browser']);
    }
    updateIntro();
    displayUserId();
    $('#launch-viewer').click(function() {
      var storyIds = getStoryIds(seen);
      // Call getUserId again, this time with setRandom set to true
      // so that a UUID will be created if the user didn't specify an
      // e-mail address.
      getUserId({
        setRandom: true
      });
      if (storyIds.length) {
        showStory(getRandomStoryId(storyIds));
      }
    });
  });
})(jQuery, Modernizr, _gaq, window.storyTestOpts || {});

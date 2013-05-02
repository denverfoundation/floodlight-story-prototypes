/**
 * Common functionality across stories.
 */
;(function($) {
  function getSurveyUrl(userId, storyType) {
    var googleFormUrl = 'https://docs.google.com/forms/d/11FO5El2U35pV8HIiidjQkpqKeE4t1nwfYWxugOwbIdE/viewform';
    var qsValues = [];
    if (userId) {
      qsValues.push('entry.1498993524=' + userId);
    }

    if (storyType) {
      qsValues.push('entry.75722686=' + storyType);
    }

    if (qsValues.length) {
      googleFormUrl += '?';
      googleFormUrl += qsValues.join('&');
    }

    return googleFormUrl;
  }

  function getUserId() {
    return $.cookie('floodlight_storytest_userid');
  }

  function getStoryType() {
    return $('body').data('story-type');
  }

  function updateSurveyBtnUrl(sel) {
    sel = sel || '#btn-launch-survey';
    var userId = getUserId();
    var storyType = getStoryType();
    $(sel).attr('href', getSurveyUrl(userId, storyType));
  }

  function showSurveyBtnInstructions(sel) {
    sel = sel || '#btn-launch-survey';
    var hidePopover = function() {
      $(sel).popover('hide');
    }
    $(sel).popover({
      placement: 'bottom',
      content: "Click this button when you're finished viewing the story",
      trigger: 'hover'
    }).popover('show');
    $('body').one('click.storytest', hidePopover); 
    $(window).one('scroll.storytest', hidePopover);
  }
  
  $(function() {
    updateSurveyBtnUrl();
    showSurveyBtnInstructions();
  });
})(jQuery);

// ==UserScript==
// @name          GitHub Code Review Checklist
// @author        Paras Narang
// @version       1.8
// @namespace     http://www.flipkart.com/
// @description	  Code Review Checklist for Flipkart Warehouse team
// @updateURL     https://github.com/parasnarang/GitHub-Code-Review-Checklist/raw/master/GitHub%20Code%20Review%20Checklist.user.js
// @include       http*://github.com/Flipkart/*/pull/*
// ==/UserScript==

// Written in a hurry, please don't judge by code quality :)

function addReviewChecklists() {
    var checklistHash = {
        "Functional": [
            "Is the code functionally accurate",
            "Confirm that code must not use Active record",
            "Are Unit tests written and coverage > 90%",
            "FactoryGirl is not used for writing specs",
            "Are Acceptance test written for all external APIs",
            "Complete pull request is reviewed",
            "For each comment are next steps mentioned",
            "Have you gone through the design doc? Or the description in Jira ?",
            "DB validations present?",
            "Any Sync call in the flow validation present",
            "Are necessary Alerts and Dashboard available",
            "Bigfoot - should be treated as a data store. Is there any migration impacting BF",
            "Metrics - Are right metrics being captured?",
            "Error Handling - Make sure errors/exceptions are not being suppressed.",
            "Logging - differentiate between what is needed and what is good to have."
        ],
        "Technical": [
            "Are OOP concepts followed",
            "Is the code extensible",
            "Is LA model followed, no deviations should be present",
            "Exception handling vs over exception handling",
            "Separation of concerns",
            "Data structure added/used is appropriate for the flow",
            "Have you gone through the design doc? Or the description in Jira ?",
            "There should be no function with more than 10 logical lines of code",
            "Make sure there is a clear segregation what is data and what is business. Likes of no business logic in VO’s."
        ],
        "Performance": [
            "Has the code introduced multi-threading, if so, does the code behave accurately or are there potential loop holes",
            "Is more logging introduced in sync flow, affects of that understood and limited",
            "Has the API response time increased",
            "Dependency on external system introduced",
            "Is a new GEM added, consequence of that additional understood from perf standpoint",
            "Is there enough logging present to be able to root cause an issue, excessive logging is bad too",
            "Are DB changes introduced, impact of that on performance, multi-write",
            "Is the scenario applicable to caching - if caching is used, is it evaluated on cache miss as well",
            "How much is QPS increasing due to the change",
            "Have you gone through the design doc? Or the description in Jira ?",
            "Any new SYNC call introduced? Is the latency of that accounted for ?",
            "Check if things can be batched. We had to recently explicitly solve for n+1 queries.",
            "Check for potential memory leaks.",
            "Are DB queries optimised or do they have an underlying assumption. Example - a query in put away was initially a good query but became slow as operations started using a shelf for a bulk location."
        ]
    };

    $.each(checklistHash, function(reviewerType, checklistItemsArray) {
        var checklistForm = $('<form class="menu" id="' + reviewerType + 'Form">  </form>');
        checklistForm.css({
            position: 'fixed',
            bottom: 60,
            right: 30,
            width: "20%",
            height: "50%",
            overflow: 'scroll',
            zIndex: 10,
            display: 'none'
        });
        var checklistItems = [];
        $.each(checklistItemsArray, function(index, value) {
            var backgroundColor = (index % 2) ? "#f7f7f7" : "#fff";
            checklistItems.push( $(
                '<div class="menu-item columns" style="background: ' + backgroundColor + ';">' +
                '<label class="four-fifths column" style="font-weight: normal; text-align: justify;" >' +
                '<input type="checkbox" value="' + value + '"> ' + value +
                '</label>' +
                '<a id="' + reviewerType + index + 'CommentButton" class="one-fifth column octicon octicon-comment" style="cursor: pointer; cursor: hand;">' +
                '</a>' +
                '</div>' +
                '<input type="text" class="input-mini input-block" style="display: none;" id="' + reviewerType + index + 'CommentInput" placeholder="Enter Comments here..">'
            ));
        });
        var checklistTitle = $('<span class="menu-heading" style="">Checklist : ' + reviewerType + ' Review</span>').css('textTransform', 'capitalize');
        checklistForm.append(checklistTitle);
        $.each(checklistItems, function( index, checklistItem ) {
            checklistForm.append(checklistItem);
        });
        var checklistSubmit = $('<center><a style="width:100%;" id="' + 
                                reviewerType + 
                                'ChecklistShipIt" class="btn btn-sm btn-primary tooltipped tooltipped-n" aria-label="Post Comment">Ship it!</a></center>');
        checklistForm.append(checklistSubmit);
        $('body').append(checklistForm);
        $.each(checklistItems, function( index, checklistItem ) {
            $('#' + reviewerType + index + 'CommentButton').click(function() {
                $('#' + reviewerType + index + 'CommentInput').toggle();
                if($('#' + reviewerType + index + 'CommentInput').is(':visible')){
                    $('#' + reviewerType + index + 'CommentInput').focus();
                }
            });
        });
    });
}

function addShipItButton() {
    var shipItButton = $('<a id="shipItButton" class="btn btn-big tooltipped tooltipped-n" aria-label="Code Review Checklist">Review Checklist</a>');
    shipItButton.css({
        position: 'fixed',
        bottom: 20,
        right: 30
    });
    $('body').append(shipItButton);
}

function addReviewerTypeMenu() {
    var reviewerTypeMenuHTML = (function reviewerTypeMenuHTML() {
        var elements = [];
        $.each(['Functional', 'Technical', 'Performance'], function( index, reviewerType ) {
            elements.push('<a id="' + reviewerType + 'Reviewer" class="menu-item" style="cursor: pointer; cursor: hand;">' + reviewerType + 'Review</a>');
        });

        return '<nav class="menu">' +
            '<span class="menu-heading">Choose</span>' +
            elements.join("") +
            '</nav>';
    })();
    var reviewerTypeMenu = document.createElement("div");
    reviewerTypeMenu.innerHTML = reviewerTypeMenuHTML;
    reviewerTypeMenu.id = "reviewerTypeMenu";
    reviewerTypeMenu.style.position = "fixed";
    reviewerTypeMenu.style.bottom = "60px";
    reviewerTypeMenu.style.right = "30px";
    reviewerTypeMenu.style.zIndex = 100;
    reviewerTypeMenu.style.display = "none";

    $('body').append(reviewerTypeMenu);
}

function registerMenuToggle() {
    $('#shipItButton').click(function() {
        $("#submitConfirmNotification").hide();
        $('#reviewerTypeMenu').toggle();
        $.each(['Functional', 'Technical', 'Performance'], function( index, reviewerType ) {
            if($('#' + reviewerType + 'Form').is(":visible")){
                $('#reviewerTypeMenu').hide(); 
                $('#' + reviewerType + 'Form').hide();
            }
        });
    });
}

function registerChecklistsToggle() {
    $.each(['Functional', 'Technical', 'Performance'], function( index, reviewerType ) {
        $('#' + reviewerType + 'Reviewer').click(function() {
            $('#' + reviewerType + 'Form').show();
            $('#reviewerTypeMenu').hide();
        });
    });
}

function createShipItComment(message) {
    var commentForm = $( "textarea[name='comment[body]']" ).first();
    commentForm.val(message);
    commentForm.closest("form").submit();

    var url = $(location).attr('href');
    url = url.substring(0, url.lastIndexOf('/')) + $('.timeline-comment-header-text .timestamp').last().attr('href');
    var submitConfirmNotification = $('<div id="submitConfirmNotification" class="flash text-center">'+
                                      '<span class="octicon octicon-x flash-close js-flash-close"></span>'+
                                      'Comment Posted at <a href="'+ url +'">' + url + '</a></div>');
    submitConfirmNotification.css({     
        position: 'fixed',
        width: '100%',
        left: 0,
        top: 0,
        zIndex: 100,
        borderTop: 0
    });
    $('body').prepend(submitConfirmNotification);
}

function constructShipItMessage(reviewerType) {
    var username = $('.header-nav-current-user .css-truncate-target').first().text();
    var message = reviewerType + " Review by " + username + "\n\n";
    $.each($('#' + reviewerType +'Form').find(':input'), function (index, element) {
        if(element.type == 'checkbox'){
            value = element.checked ? " :white_check_mark: " : " :red_circle: ";
            message = message + value + " | " + element.value + "\n";
        }
        if(element.type == 'text' && element.value.length > 0){
            message = message + " Comments : " + element.value + "\n";
        }
    });
    return message;
}

function registerChecklistShipIts() {
    $.each(['Functional', 'Technical', 'Performance'], function( index, reviewerType ) {
        $('#' + reviewerType + 'ChecklistShipIt').click(function() {
            var message = constructShipItMessage(reviewerType);
            createShipItComment(message);
            $('#' + reviewerType + 'Form').hide();
            $('#reviewerTypeMenu').hide();
        });
    });
}

function letsJQuery() {
    //alert($); // check if the dollar (jquery) function works
    //alert($().jquery); // check jQuery version

    $(document).ready(function(){
        addShipItButton();
        addReviewerTypeMenu();
        registerMenuToggle();
        addReviewChecklists();
        registerChecklistsToggle();
        registerChecklistShipIts();
    });
}

function jquery_wait() {
    if (typeof unsafeWindow.jQuery == 'undefined') {
        window.setTimeout(jquery_wait, 10);
    } else {
        letsJQuery();
    }
}

(function(){    
    jquery_wait();
})();

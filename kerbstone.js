// ==UserScript==
// @name         Kerbstone
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  adds kerbstone functionality to Wykop Mikroblog
// @author       @ZasilaczKomputerowy
// @author       @shar
// @match        http://www.wykop.pl/mikroblog/*
// @grant        none
// ==/UserScript==

(function () {
    console.log('Kerbstone starting...');


    // constants
    var STORAGE_KEY_COLLAPSED_LIST = 'wykop.kerbstone.collapsedList';


    // routines
    var collapse = collapse;
    var expand = expand;
    var collapseOrExpand = collapseOrExpand;
    var toggleCollapseExpand = toggleCollapseExpand;
    var init = init;


    // variables
    var collapsedList;


    // initialization
    init();


    // implementation
    function init() {
        try {
            console.log('localStorage.getItem(STORAGE_KEY_COLLAPSED_LIST)', localStorage.getItem(STORAGE_KEY_COLLAPSED_LIST));
            collapsedList = JSON.parse(localStorage.getItem(STORAGE_KEY_COLLAPSED_LIST));

            if (!collapsedList) {
                collapsedList = [];
                localStorage.setItem(STORAGE_KEY_COLLAPSED_LIST, JSON.stringify(collapsedList));
            }
        }
        catch(ex) {
            collapsedList = [];
            localStorage.setItem(STORAGE_KEY_COLLAPSED_LIST, JSON.stringify(collapsedList));
        }

        $('#itemsStream')
            .children()
            .each(function(index, element) {
                var vC = $(element).find('p.vC').first();
                var html = $(vC).html();
                var id = $(element).find('div.wblock').attr('data-id');

                var idHandle = id + '_handle';
                if (collapsedList.indexOf(id) === -1) {
                    html = '<span id="' + idHandle + '">[ - ]</span>' + html;
                    $(vC).html(html);
                } else {
                    html = '<span id="' + id + '_handle">[ + ]</span>' + html;
                    $(vC).html(html);

                    collapse(id);
                }

                $(vC)
                    .find('#' + idHandle)
                    .click(function() {
                        toggleCollapseExpand(id);
                    });

            });
    }

    function collapse(id) {
        collapseOrExpand(id, true);
    }

    function expand(id) {
        collapseOrExpand(id, false);
    }

    function collapseOrExpand(id, collapse) {
        var displayValue = collapse ? 'none' : 'block';
        var textValue = collapse ? '+' : '-';

        var parent = $('div[data-id=' + id + ' ]').parent();
        parent.find('div.text').first().css('display', displayValue);
        parent.find('div.elements').first().css('display', displayValue);
        parent.find('img.avatar').first().css('display', displayValue);
        parent.children('ul.sub').css('display', displayValue);
        parent.find('#' + id + '_handle').text('[ ' + textValue + ' ]');
    }

    function toggleCollapseExpand(id) {
        var idx = collapsedList.indexOf(id);

        if (idx > -1) {
            collapsedList.splice(idx, 1);

            expand(id);
        } else {
            collapsedList.push(id);

            collapse(id);
        }

        localStorage.setItem(STORAGE_KEY_COLLAPSED_LIST, JSON.stringify(collapsedList));
    }
})();
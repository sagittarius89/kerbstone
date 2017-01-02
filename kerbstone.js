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

(function() {
    // variables
    var collapsedList;


    // routines
    var collapse = collapse;
    var expand = expand;
    var toggleCollapse = toggleCollapse;
    var init = init;


    // initialization
    init();


    // implementation
    function init() {
        if (localStorage.collapsedList === undefined) {
            localStorage.setItem('collapsedList', JSON.stringify([]));
        }
        collapsedList = JSON.parse(localStorage.getItem('collapsedList'));

        $('#itemsStream')
            .children()
            .each(function(index, element) {
                var vC = $(element).find('p.vC').first();
                var html = $(vC).html();
                var id = $(element).find('div.wblock').attr('data-id');

                var collapsedList = JSON.parse(localStorage.getItem('collapsedList'));

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
                        toggleCollapse(id);
                    });

            });
    }

    function collapse(id) {
        var parent = $('div[data-id=' + id + ' ]').parent();
        parent.find('div.text').first().css('display', 'none');
        parent.find('div.elements').first().css('display', 'none');
        parent.find('img.avatar').first().css('display', 'none');
        parent.children('ul.sub').css('display', 'none');
        parent.find('#' + id + '_handle').text('[ + ]');
    }

    function expand(id) {
        var parent = $('div[data-id=' + id + ' ]').parent();
        parent.find('div.text').first().css('display', 'block');
        parent.find('div.elements').first().css('display', 'block');
        parent.find('img.avatar').first().css('display', 'block');
        parent.children('ul.sub').css('display', 'block');
        parent.find('#' + id + '_handle').text('[ - ]');
    }

    function toggleCollapse(id) {
        var idx = collapsedList.indexOf(id);

        if (idx > -1) {
            collapsedList.splice(idx, 1);

            localStorage.setItem('collapsedList', JSON.stringify(collapsedList));

            expand(id);
        } else {
            collapsedList.push(id);

            localStorage.setItem('collapsedList', JSON.stringify(collapsedList));

            collapse(id);
        }
    };
})();
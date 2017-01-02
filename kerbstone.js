// ==UserScript==
// @name         Krawężnik
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  dodaje funkcje krawężnika do mirko
// @author       @ZasilaczKomputerowy
// @match        http://www.wykop.pl/mikroblog/*
// @match        http://www.wykop.pl/link/*
// @grant        none
// ==/UserScript==

(function() {
    // dodaje przycisk do watkow
    $('#itemsStream').children().each(function(elem) {
        var vC = $(this).find('p.vC').first();
        var html = $(vC).html();
        var id = $(this).find('div.wblock').attr('data-id');

        if(localStorage.listaZwinietych === undefined)
        {
            localStorage.setItem("listaZwinietych", JSON.stringify([]));
        }

        var zwin = function(id)
        {
            var parent = $('div[data-id=' + id +' ]').first().parent();
            $(parent).find('div.text').first().css('display', 'none');
            $(parent).find('div.elements').first().css('display', 'none');
            $(parent).find('img.avatar').first().css('display', 'none');
            $(parent).children('ul.sub').first().css('display', 'none');
            $(parent).find('#' + id + '_handle').first().text('[ + ]');
        };

        var rozwin = function(id)
        {
            var parent = $('div[data-id=' + id +' ]').first().parent();
            $(parent).find('div.text').first().css('display', 'block');
            $(parent).find('div.elements').first().css('display', 'block');
            $(parent).find('img.avatar').first().css('display', 'block');
            $(parent).children('ul.sub').first().css('display', 'block');
            $(parent).find('#' + id + '_handle').first().text('[ - ]');
        };

        var listaZwinietych = JSON.parse(localStorage.getItem("listaZwinietych"));

        var idHandle = id + "_handle";
        if(listaZwinietych.indexOf(id) == -1)
        {
            html = '<span id="' + idHandle + '">[ - ]</span>' + html;
            $(vC).html(html);
        }
        else
        {
            html = '<span id="' + id + '_handle">[ + ]</span>' + html;
            $(vC).html(html);

            zwin(id);
        }

        $(vC).find('#' + idHandle).click(function() {
            if(localStorage.listaZwinietych === undefined)
            {
                localStorage.setItem("listaZwinietych", JSON.stringify([]));
            }

            var listaZwinietych = JSON.parse(localStorage.getItem("listaZwinietych"));
            var idx = listaZwinietych.indexOf(id);

            if(idx>-1)
            {
                listaZwinietych.splice(idx,1);

                localStorage.setItem("listaZwinietych", JSON.stringify(listaZwinietych));

                rozwin(id);
            }
            else
            {
                listaZwinietych.push(id);

                localStorage.setItem("listaZwinietych", JSON.stringify(listaZwinietych));

                zwin(id);
            }
        });

        $('img[data-original]').each(function() { $(this).attr('src', $(this).attr('data-original')); });
    });
})();

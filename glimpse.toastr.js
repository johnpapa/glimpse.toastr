; (function ($, pubsub, tab, render, toastr) {
    'use strict';

    if (!toastr) {
        pubsub.subscribe('action.panel.showed.toastr', function (args) {
            render.engine.insert(args.panel, 'Toastr is not available on this screen. Plugin disabled.');
        });
        return;
    }

    var preexistingToasts = [];
    var rendered = false;
    var toastrPanel;
    var headerRow = ['Toast Id', 'State', 'Date', 'Toastr Options', 'Toast Options'];
    //var layout = [
    //    [{ data: 0, key: true, width: '8%' }, { data: 1, width: '8%' }, { data: 2, width: '28%' }, { data: 3, width: '28%' }, { data: 4, width: '28%' }]
    //];

    toastr.subscribe(receiveToasts);

    function receiveToasts(args) {
        var data = args;
        data.map.toastId = data.toastId; // Forces collapse (need 5 properties for this)
        !rendered ? preexistingToasts.push(data) : write(data);
    }

    function write(data) {
        var pivotedData = [data.toastId, data.state, data.timestamp, data.options, data.map, stateGetStyle(data)];
        //render.engine.append(toastrPanel, [headerRow, pivotedData, { layout: layout }]);
        render.engine.append(toastrPanel, [headerRow, pivotedData]);
    }

    function stateGetStyle(data) {
        return data.state === 'visible' ? 'info' : '';
    }

    pubsub.subscribe('action.panel.rendered.toastr', function (args) {
        console.log('rendered glimpse.toastr');
        toastrPanel = args.panel;
        rendered = true;
        render.engine.insert(toastrPanel, [headerRow]);
        if (preexistingToasts.length) {
            for (var i = 0; i < preexistingToasts.length; i++) {
                write(preexistingToasts[i]);
            }
        }
    });

    //pubsub.subscribe('action.panel.rendering.toastr', function (args) {
    //    console.log('rendering glimpse.toastr');
    //});
    
    //pubsub.subscribe('action.panel.showed.toastr', function (args) {
    //    console.log('showed glimpse.toastr');
    //});

    //pubsub.subscribe('action.panel.showing.toastr', function (args) {
    //    console.log('showing glimpse.toastr');
    //});

    //pubsub.subscribe('action.panel.hiding.toastr', function (args) {
    //    console.log('hiding glimpse.toastr');
    //});

    var config = {
        key: 'toastr',
        payload: {
            name: 'toastr',
            version: '0.1.0',
            isPermanent: true,
            data: 'Loading...'
        },
        metadata: {
            documentationUri: "http://jpapa.me/c7toastr"
        }
    };

    tab.register(config);

})(jQueryGlimpse, glimpse.pubsub, glimpse.tab, glimpse.render, window.toastr);
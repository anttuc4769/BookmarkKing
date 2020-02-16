chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
    switch (rq.action) {
        case "gb":
            $.get(rq.url, function (data) {
                sendResponse({ response: data });
            });
            break;
        case "kw":
            InsertTags(rq.url, rq.json, rq.dbKey, rq.bookmarkJson, rq.tagNameQuery);
            break;
        case "sc-dbKey":
            chrome.cookies.set({
                url: "https://www.vikyn.io",
                name: "BookmarkKingDbKey",
                value: rq.data
            });
            break;
        case "sc-dbUrl":
            chrome.cookies.set({
                url: "https://www.vikyn.io",
                name: "BookmarkKingDbUrl",
                value: rq.data
            });
            break;
        case "gc-dbKey":
            chrome.cookies.get({ "url": "https://www.vikyn.io", "name": "BookmarkKingDbKey" }, function (cookie) {
                sendResponse({ data: cookie === null ? null : cookie.value });
            });
            break;
        case "gc-dbUrl":
            chrome.cookies.get({ "url": "https://www.vikyn.io", "name": "BookmarkKingDbUrl" }, function (cookie) {
                sendResponse({ data: cookie === null ? null : cookie.value });
            });
            break;
        case "rc-dbKey":
            chrome.cookies.remove({ "url": "https://www.vikyn.io", "name": "BookmarkKingDbKey" }, function (cookie) {
                sendResponse({ data: cookie.value });
            });
            break;
        case "cb":
            chrome.bookmarks.create({
                'title': rq.url,
                'url': rq.url
            });
            break;
    }
    return true;  
});

function InsertTags(url, json, dbKey, bookmarkJson, tagNameQuery) {
    $.ajax
    ({
        type: "POST",
        url: url + "tags",
        dataType: 'json',
        data: json,
        headers: {
            "x-apikey": dbKey
        },
        contentType: 'application/json',
        success: function() {
            return GetTagsByName(url, bookmarkJson, dbKey, tagNameQuery);
        },
        error: function () { return "error"; }
    });
}

function GetTagsByName(url, bookmarkJson, dbKey, tagNameQuery) {
    $.ajax
    ({
        type: "GET",
        url: url + "tags" + tagNameQuery,
        headers: {
            "x-apikey": dbKey
        },
        contentType: 'application/json',
        success: function(data) {
            var tagJson = CreateTagIdJson(data);
            var json = bookmarkJson.replace("{tags}", tagJson);
            return InsertBookmark(url, json, dbKey);
        },
        error: function () { return false; }
    });
}

function CreateTagIdJson(data) {
    var json = '';
    var firstGo = true;
    data.forEach(function (element) {
        if (firstGo) {
            json += '"'+ element._id +'"';
            firstGo = false;
        }
        else
            json += ', "' + element._id + '"';
    });
    json += '';
    return json;
}

function InsertBookmark(url, json, dbKey) {
    $.ajax
    ({
        type: "POST",
        url: url + "bookmarks",
        dataType: 'json',
        data: json,
        headers: {
            "x-apikey": dbKey
        },
        contentType: 'application/json',
        success: function() {
            return true;
        },
        error: function () { return false; }
    });
}

function GetTags(url, dbKey) {
    $.ajax
    ({
        type: "GET",
        url: url,
        headers: { "x-apikey": dbKey },
        contentType: 'application/json',
        function() {
            return "success";
        },
        error: function () { return "error"; }
    });
}
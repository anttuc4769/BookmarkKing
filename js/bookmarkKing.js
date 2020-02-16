function BookmarkKing() {
    var dbUrlBase = "";
    var dbKey = "";

    function SetDbKey() {
        chrome.extension.sendMessage({
            action: "gc-dbKey"
        }, function (resp) {
                dbKey = resp.data;
                MissingCookiesCheck("dbKey", resp.data);
        });
    }
    function SetDbUrl() {
        chrome.extension.sendMessage({
            action: "gc-dbUrl"
        }, function (resp) {
            dbUrlBase = resp.data;
            MissingCookiesCheck("dbUrl", resp.data);
        });
    }

    function GetCookiesForApp() {
        SetDbKey();
        SetDbUrl();  
    }

    GetCookiesForApp();

    function MissingCookiesCheck(name, data) {
        switch (name) {
            case "dbUrl":
                var labelD09SAC7LOXP98 = document.getElementById('label_D09SAC7LOXP98');
                if (data === null)
                    labelD09SAC7LOXP98.style.display = "block";
                else
                    labelD09SAC7LOXP98.style.display = "none";
                break;
            case "dbKey":
                var labelD3396C7LOXP98 = document.getElementById('label_D3396C7LOXP98');
                if (data === null)
                    labelD3396C7LOXP98.style.display = "block";
                else
                    labelD3396C7LOXP98.style.display = "none";
                break;
        default:
        }
    }

    function RemoveDbKey() {
        chrome.extension.sendMessage({
            action: "rc"
        }, function (resp) {
            dbKey = resp.data;
            console.log(dbKey);
        });
    }

    function AddBookmark() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            var url = activeTab.url;
            AddBookmarkToDb(url, "");
            AddBookmarkToBrowser(url);
        });
    }

    function SearchBookmarks() {
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var keywords = input9D4E63B7711C.value;
        if (!keywords)
            return;
        var tagQuery = TagsQueryBuilder(keywords);
        if (!tagQuery.gtg)
            return;
        chrome.extension.sendMessage({
            action: "gb",
            url: dbUrlBase + "bookmarks" + tagQuery.tagQuery,
            dbKey: dbKey
        }, function (resp) {
            BookmarkResultHtmlBuilder(JSON.stringify(resp));
        });
    }
    function TagsQueryBuilder(keywords) {
        var keywordArray = keywords.split(",");
        var regex = new RegExp(/^[A-Za-z0-9]+$/);
        var gtg = false;
        var firstRun = true;
        var tagQuery = '?q={"$and": [';
        keywordArray.forEach(function (element) {
            if (regex.test(element))
                gtg = true;
            if (element !== "") {
                if (firstRun) {
                    tagQuery += ' {"Tags": { "Name" : "' + element.trim().toLowerCase() + '" }}';
                    firstRun = false;
                }
                else
                    tagQuery += ', {"Tags":{ "Name" : "' + element.trim().toLowerCase() + '" }}';
            }
        });
        tagQuery += "]}";
        return { tagQuery: tagQuery, gtg: gtg };
    }
    function BookmarkResultHtmlBuilder(json) {
        var parsedJson = JSON.parse(json);
        var divDB32541AAB9B = document.getElementById('result_div_DB32541AAB9B');
        var html = "";
        parsedJson.response.forEach(function(element) {
            var h = '<div style="padding-top:15px;">';
            h += '<a style="word-break: break-all" title="' + element.Url + '"  href="' + element.Url + '" target="_blank">' + element.Name + '</a>';
            h += "</div>";
            html += h;
        });
        divDB32541AAB9B.innerHTML = html;
    }

    function AddBookmarkToBrowser(currentPageUrl) {
        chrome.extension.sendMessage({
            action: "cb",
            url: currentPageUrl
        }, function (resp) {
        });
    }

    function AddBookmarkToDb(currentPageUrl) {
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var input9D4E69KA711C = document.getElementById('name_input_9D4E69KA711C');
        var keywords = input9D4E63B7711C.value;
        if (!keywords)
            return;
        var tagsJson = CreateTagQuery(keywords);
        if (!tagsJson.gtg)
            return;
        var name = !input9D4E69KA711C.value ? currentPageUrl : input9D4E69KA711C.value;
        var bookmarkJson = '{"Name": "' + name  + '", "Url" : "' + currentPageUrl + '", "Active": true, "Tags":[ {tags} ]}';
        chrome.extension.sendMessage({
            action: "kw",
            url: dbUrlBase,
            dbKey: dbKey,
            json: tagsJson.tagsJson,
            tagNameQuery: CreateTagQueryByName("or", tagsJson.cleanTagArray),
            bookmarkJson: bookmarkJson
        }, function (resp) {});
        input9D4E69KA711C.value = "";
        input9D4E63B7711C.value = "";
    }

    function CreateTagQuery(keywords) {
        var keywordArray = keywords.split(",");
        var regex = new RegExp(/^[A-Za-z]+$/);
        var gtg = false;
        var tagsJson = "[";
        var cleanTagArray = [];
        keywordArray.forEach(function (element) {
            if (regex.test(element))
                gtg = true;
            if (element !== "") {
                if (tagsJson === "[")
                    tagsJson += ' { "Name" : "' + element.trim().toLowerCase() + '" }';
                else
                    tagsJson += ', { "Name" : "' + element.trim().toLowerCase() + '" }';
                cleanTagArray.push(element);
            }
        });
        tagsJson += "]";
        return {tagsJson: tagsJson, gtg: gtg, cleanTagArray: cleanTagArray};
    }

    function CreateTagQueryByName(opType, array) {
        var query = '?q={"$' + opType + '": [';
        var firstGo = true;
        array.forEach(function (element) {
            if (firstGo) {
                query += '{"Name":"' + element.trim().toLowerCase() +'"}';
                firstGo = false;
            }
            else
                query += ', {"Name":"' + element.trim().toLowerCase() + '"}';
        });
        query += ']}';
        return query;
    }

    function OpenSettings() {
        var divEA761612MN6D = document.getElementById('div_EA761612MN6D');
        var divDB325LO9AB9B = document.getElementById('div_DB325LO9AB9B');
        var icon9D4E63B77101 = document.getElementById('icon_9D4E63B77101');

        divEA761612MN6D.style.display = "none";
        icon9D4E63B77101.style.display = "none";
        divDB325LO9AB9B.style.display = "block";
    }

    function CloseSettings() {
        var divEA761612MN6D = document.getElementById('div_EA761612MN6D');
        var divDB325LO9AB9B = document.getElementById('div_DB325LO9AB9B');
        var icon9D4E63B77101 = document.getElementById('icon_9D4E63B77101');

        divEA761612MN6D.style.display = "block";
        icon9D4E63B77101.style.display = "block";
        divDB325LO9AB9B.style.display = "none";
    }

    function SaveDbKey() {
        var input9D4E63POX11C = document.getElementById('dbKey_input_9D4E63POX11C');
        chrome.extension.sendMessage({
            action: "sc-dbKey",
            data: input9D4E63POX11C.value
        }, function (resp) {
            //console.log(JSON.stringify(resp));
        });
    }

    function SaveDbUrl() {
        var input9D4E69BNX11C = document.getElementById('dbUrl_input_9D4E69BNX11C');
        var url = input9D4E69BNX11C.value;
        if (!url.endsWith("/"))
            url += "/";
        chrome.extension.sendMessage({
            action: "sc-dbUrl",
            data: url
        }, function (resp) {
            //console.log(JSON.stringify(resp));
        });
    }

    function CheckForCookie() {
        var input9D4E63POX11C = document.getElementById('dbKey_input_9D4E63POX11C');
        var input9D4E69BNX11C = document.getElementById('dbUrl_input_9D4E69BNX11C');
        chrome.extension.sendMessage({
            action: "gc-dbKey"
        }, function (resp) {
            input9D4E63POX11C.value = resp.data;
        });
        chrome.extension.sendMessage({
            action: "gc-dbUrl"
        }, function (resp) {
            input9D4E69BNX11C.value = resp.data;
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var btnEA761612CD6D = document.getElementById('btn_search_EA761612CD6D');
        var btnA0CE92C0EC52 = document.getElementById('btn_add_A0CE92C0EC52');
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var icon9D4E63B77101 = document.getElementById('icon_9D4E63B77101');
        var btnAPX992C0EC52 = document.getElementById('btn_close_APX992C0EC52');
        var btnKLX01612CD6D = document.getElementById('btn_save_KLX01612CD6D');
        var input9D4E69KA711C = document.getElementById('name_input_9D4E69KA711C');

        // onClick's logic below:
        btnA0CE92C0EC52.addEventListener('click', function () {
            AddBookmark();
        });
        btnEA761612CD6D.addEventListener('click', function () {
            SearchBookmarks();
        });
        icon9D4E63B77101.addEventListener('click', function () {
            CheckForCookie();
            OpenSettings();
        });
        btnAPX992C0EC52.addEventListener('click', function () {
            GetCookiesForApp();
            CloseSettings();
        });
        btnKLX01612CD6D.addEventListener('click', function () {
            SaveDbKey();
            SaveDbUrl();
            GetCookiesForApp();
            CloseSettings();
        });
        input9D4E63B7711C.addEventListener('keyup', function (event) {
            event.target.value = event.target.value.replace(/[\r\n\v]+/g, '');
            if (event.keyCode === 13)
                SearchBookmarks();
        });
        input9D4E69KA711C.addEventListener('keyup', function (event) {
            if (event.keyCode === 13)
                if (input9D4E69KA711C)
                    AddBookmark();
        });
    });
}

BookmarkKing();

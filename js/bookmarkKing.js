function BookmarkKing() {
    var dbUrlBase = "";
    var dbKey = "";
    var currentTab = "";
    var nameKeeper = "";

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
        });
    }

    function AddBookmark() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            var url = activeTab.url;
            currentTab = url;
            AddBookmarkToDb(url, "");
            AddBookmarkToBrowser(url);
        });
    }

    function SearchBookmarks(data) {
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var keywords = data ? data : input9D4E63B7711C.value;
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
        var ids = [];
        parsedJson.response.forEach(function(element) {
            var h = '<div style="padding-top:15px;">';
            h += '<a style="word-break: break-all" title="' + element.Url + '"  href="' + element.Url + '" target="_blank">' + element.Name + '</a>';
            var id = CreateGuid() + element._id;
            ids.push(id);
            h += '&nbsp;<text style="cursor:pointer;" id="' + id + '">&#9998;</text>';
            h += "</div>";
            html += h;
        });
        divDB32541AAB9B.innerHTML = html;
        ids.forEach(function (element) {
            SetListenerForEditBookmarks(element);
        });
    }

    function SetListenerForEditBookmarks(id) {
        var htmlElement = document.getElementById(id);
        htmlElement.addEventListener('click', function () {
            var divDB325LNXA29B = document.getElementById("div_DB325LNXA29B");
            var divDB325KA0929C = document.getElementById("div_DB325KA0929C");
            divDB325LNXA29B.style.display = "block";
            divDB325KA0929C.style.display = "none";
            var id = this.id.split("_")[1];
            chrome.extension.sendMessage({
                action: "gb-id",
                url: dbUrlBase + "bookmarks/" + id,
                dbKey: dbKey
            }, function (resp) {
                    SetBookmarkData(JSON.stringify(resp));
            });
            });
    }

    var editBookmarkId = "";
    var editBookmarkUrl = "";
    function SetBookmarkData(json) {
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var input9D4E69KA711C = document.getElementById('name_input_9D4E69KA711C');

        var parsedJson = JSON.parse(json);
        var tags = "";
        parsedJson.response.Tags.forEach(function(element) {
            if (tags === "")
                tags += element.Name;
            else
                tags += ", " + element.Name;
        });
        input9D4E63B7711C.value = tags;
        input9D4E69KA711C.value = parsedJson.response.Name;
        editBookmarkId = parsedJson.response._id;
        editBookmarkUrl = parsedJson.response.Url;
    }

    function AddBookmarkToBrowser(currentPageUrl) {
        chrome.extension.sendMessage({
            action: "gbmf",
            data: "Bookmark King"
        }, function (resp) {
                var folderId = "";
                if (resp.data.length > 0) {
                    folderId = resp.data[0].id;
                    CreateBookmark(folderId, currentPageUrl);
                }
                else
                    CreateBookmarkFolder(currentPageUrl);
        });
    }

    function CreateBookmarkFolder() {
        chrome.extension.sendMessage({
                action: "cbmf",
                data: "Bookmark King"
        }, function (resp) {
                AddBookmarkToBrowser(currentTab);
        });
    }

    function CreateBookmark(folderId, currentPageUrl) {
        chrome.extension.sendMessage({
            action: "cb",
            url: currentPageUrl,
            data: { folderId: folderId, name: nameKeeper }
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
        nameKeeper = name;
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

    function UpdateBookmark() {
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var input9D4E69KA711C = document.getElementById('name_input_9D4E69KA711C');
        var keywords = input9D4E63B7711C.value;
        if (!keywords)
            return;
        var tagsJson = CreateTagQuery(keywords);
        if (!tagsJson.gtg)
            return;
        var name = !input9D4E69KA711C.value ? editBookmarkUrl : input9D4E69KA711C.value;
        var bookmarkJson = '{"Name": "' + name + '", "Url" : "' + editBookmarkUrl + '", "Active": true, "Tags":[ {tags} ]}';
        chrome.extension.sendMessage({
            action: "ubm",
            url: dbUrlBase,
            id: editBookmarkId,
            dbKey: dbKey,
            json: tagsJson.tagsJson,
            tagNameQuery: CreateTagQueryByName("or", tagsJson.cleanTagArray),
            bookmarkJson: bookmarkJson
        }, function (resp) { });
        CancelEdit();
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

    function CreateGuid() {
        return 'xxxx-4xxx_'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function CancelEdit() {
        var divDB325LNXA29B = document.getElementById("div_DB325LNXA29B");
        var divDB325KA0929C = document.getElementById("div_DB325KA0929C");
        var input9D4E63B7711C = document.getElementById('keyword_input_9D4E63B7711C');
        var input9D4E69KA711C = document.getElementById('name_input_9D4E69KA711C');

        divDB325LNXA29B.style.display = "none";
        input9D4E63B7711C.value = "";
        input9D4E69KA711C.value = "";
        divDB325KA0929C.style.display = "block";
    }

    function DeleteBookmark() {
        chrome.extension.sendMessage({
            action: "dbm",
            url: dbUrlBase + "bookmarks/" + editBookmarkId,
            dbKey: dbKey
        }, function (resp) {
                SearchBookmarks();
                CancelEdit();
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
        var btnA0CE92CSAC52 = document.getElementById('btn_cancel_A0CE92CSAC52');
        var btnASC0S12CFD6D = document.getElementById('btn_delete_ASC0S12CFD6D');
        var btnPLSAW612CD6D = document.getElementById('btn_update_PLSAW612CD6D');

        // onClick's logic below:
        btnASC0S12CFD6D.addEventListener('click', function () {
            DeleteBookmark();
        });
        btnPLSAW612CD6D.addEventListener('click', function () {
            UpdateBookmark();
        });
        btnA0CE92CSAC52.addEventListener('click', function () {
            CancelEdit();
        });
        btnA0CE92C0EC52.addEventListener('click', function () {
            AddBookmark();
        });
        btnEA761612CD6D.addEventListener('click', function () {
            SearchBookmarks();
            CancelEdit();
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

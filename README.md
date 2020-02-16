Use this extension to start managing bookmarks like a KING! The extension is made to make organizing bookmark easier and more efficient. Instead of just listing bookmark inside folder, Bookmark King saves you bookmark using tags in a database you'll be able to access across any device or account. 

Database Setup: 
1) Creating an account at https://restdb.io/signup/ so we can store your bookmark data.
2) Next create the database, https://restdb.io/account. (You can name this whatever you like, I just went with "bookmark")
3) In the top right hand corner of your database, click the cogs logo to go in developer mode.
4) Click the "Collection +" icon in the left hand menu.
5) Create a collection named "tags"
6) Now you should see your newly created tags collection in the menu, click the "tags" name.
7) Lets add a new field, click the orange "Add Field +" button.
8) Name the column "Name" and keep the datatype as text.
9) Next expand the requirements drop down and check both required and unique.
10) Click the "Collection +" icon in the left hand menu again.
11) Create a collection named "bookmarks"
12) You should see your newly created bookmarks collection in the menu, click the "bookmarks" name.
13) Click the orange "Add Field +" button again.
14) Name the column "Url" and keep the datatype as text.
15) Expand the requirements drop down and check required.
16) Create another field, and name the column "Name" and keep the datatype as text.
17) Create another field, and name it "Tags" and change the datatype to "tags" (Relations to collections) with "Select many tags"
18) Create one last field, and name it "Active" and change the datatype to bool that required. 
19) Lastly click the "Setting" link in the left side menu, then open the "API" tab. Copy the "Server API-key (full access)" and database Url (Above the tabs, will be {database name}.restdb.io) we will need these in the extension.

Extension Setup:
1) Click the cog icon in the top right corner.
2) From the setting tab save the database key and database url with "/rest/" appended to the end. Example: https://bookmark-0101.restdb.io/rest/

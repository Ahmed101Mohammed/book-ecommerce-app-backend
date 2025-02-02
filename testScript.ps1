# Unit testing
node ./tests/unitTest/cryptoMethods.test.js
# Integeration tests for auth API
node ./tests/integrationTests/authRouteTests/register.test.js;
node ./tests/integrationTests/authRouteTests/login.test.js;
node ./tests/integrationTests/authRouteTests/logout.test.js;
# Integeration tests for books API
node ./tests/integrationTests/booksRouteTests/createBook.test.js;
node ./tests/integrationTests/booksRouteTests/getBooks.test.js;
node ./tests/integrationTests/booksRouteTests/getBook.test.js;
node ./tests/integrationTests/booksRouteTests/updateBook.test.js;
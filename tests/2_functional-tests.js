/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { isValidObjectId } = require('mongoose');

chai.use(chaiHttp);

const openRequest = chai.request(server).keepOpen();

// debug:
/**
 * @param {any} x
 * @returns {void}
 * @description console.log(x)
 * @example clg('hello')
 * @example clg({hello: 'world'})
 * @example clg([1, 2, 3])
 */
const clg = console.log;

suite('Functional Tests', () => {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', (done) => {
    openRequest.get('/api/books').end((err, res) => {
      assert.equal(res.status, 200);
      assert.isArray(res.body, 'response should be an array');
      assert.property(
        res.body[0],
        'commentcount',
        'Books in array should contain commentcount'
      );
      assert.property(
        res.body[0],
        'title',
        'Books in array should contain title'
      );
      assert.property(res.body[0], '_id', 'Books in array should contain _id');
      done();
    });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', (done) => {
          try {
            const title = 'Functional_Test_Title_' + Date.now();
            openRequest
              .post('/api/books')
              .send({ title })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.title, title);
                assert.property(res.body, '_id');
                done();
              });
          } catch (error) {
            clg('error: ', error);
            done(error);
          }
        });

        test('Test POST /api/books with no title given', (done) => {
          try {
            openRequest
              .post('/api/books')
              .send({})
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'missing required field title');
                done();
              });
          } catch (error) {
            clg('error: ', error);
            done(error);
          }
        });
      }
    );

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        try {
          openRequest.get('/api/books').end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.isNumber(res.body[0]['commentcount']);
            assert.property(res.body[0], 'title');
            assert.isString(res.body[0]['title']);
            assert.property(res.body[0], '_id');
            assert.isString(res.body[0]['_id']);
            assert.isTrue(isValidObjectId(res.body[0]['_id']));
            done();
          });
        } catch (error) {
          clg('error: ', error);
          done(error);
        }
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        try {
          openRequest
            .get('/api/books/123456789012345678901234')
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            });
        } catch (error) {
          clg('error: ', error);
          done(error);
        }
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        try {
          openRequest
            .post('/api/books')
            .send({ title: 'test', _id: '648da4db4e3caafd464a7906' })
            .end();

          openRequest
            .get('/api/books/648da4db4e3caafd464a7906')
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'comments');
              assert.isArray(res.body.comments);
              assert.property(res.body, 'title');
              assert.isString(res.body['title']);
              assert.property(res.body, '_id');
              assert.isString(res.body['_id']);
              assert.isTrue(isValidObjectId(res.body['_id']));
              done();
            });
        } catch (error) {
          clg('error: ', error);
          done(error);
        }
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', (done) => {
          try {
            const comment = 'Functional_Test_Comment_' + Date.now();
            openRequest
              .post('/api/books/648da4db4e3caafd464a7906')
              .send({ comment })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'comments');
                assert.isArray(res.body.comments);
                assert.include(res.body.comments, comment);
                assert.property(res.body, 'title');
                assert.isString(res.body['title']);
                assert.property(res.body, '_id');
                assert.isString(res.body['_id']);
                assert.isTrue(isValidObjectId(res.body['_id']));
                done();
              });
          } catch (error) {
            clg('error: ', error);
            done(error);
          }
        });

        test('Test POST /api/books/[id] without comment field', (done) => {
          try {
            openRequest
              .post('/api/books/648da4db4e3caafd464a7906')
              .send({})
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'missing required field comment');
                done();
              });
          } catch (error) {
            clg('error: ', error);
            done(error);
          }
        });

        test('Test POST /api/books/[id] with comment, id not in db', (done) => {
          try {
            const comment = 'Functional_Test_Comment_' + Date.now();
            openRequest
              .post('/api/books/123456789012345678901234')
              .send({ comment })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'no book exists');
                done();
              });
          } catch (error) {
            clg('error: ', error);
            done(error);
          }
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        try {
          openRequest
            .delete('/api/books/648da4db4e3caafd464a7906')
            .then((res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              openRequest
                .get('/api/books/648da4db4e3caafd464a7906')
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.equal(res.text, 'no book exists');
                  done();
                });
            });
        } catch (error) {
          clg('error: ', error);
          done(error);
        }
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        try {
          const comment = 'Functional_Test_Comment_' + Date.now();
          openRequest
            .delete('/api/books/123456789012345678901234')
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            });
        } catch (error) {
          clg('error: ', error);
          done(error);
        }
      });
    });
  });
});

suite('Hints', () => {
  //   You can send a POST request to /api/books with title as part of the form data to add a book.
  //  The returned response will be an object with the title and a unique _id as keys.
  // If title is not included in the request, the returned response should be the string missing required field title.
  test(`H-1. You can send a POST request to /api/books with title as part of the form data to add a book. 
  The returned response will be an object with the title and a unique _id as keys.
  If title is not included in the request, the returned response should be the string missing required field title.`, (done) => {
    try {
      openRequest
        .post('/api/books')
        .send({ title: 'Faux Book 1' })
        .then((res) => {
          assert.isObject(res.body);
          assert.property(res.body, 'title');
          assert.equal(res.body.title, 'Faux Book 1');
          assert.property(res.body, '_id');
          assert.isTrue(isValidObjectId(res.body['_id']));
          openRequest
            .post('/api/books')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field title');
              done();
            });
        });
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });

  // You can send a GET request to /api/books and receive a JSON response representing all the books.
  //  The JSON response will be an array of objects with each object(book) containing title, _id, and commentcount properties.
  test(`H-2. You can send a GET request to /api/books and receive a JSON response representing all the books.
  The JSON response will be an array of objects with each object(book) containing title, _id, and commentcount properties.`, (done) => {
    try {
      const url = '/api/books';
      const a = openRequest
        .post('/api/books')
        .send({ title: 'Faux Book A' })
        .then((res) => res.body);
      const b = openRequest
        .post('/api/books')
        .send({ title: 'Faux Book B' })
        .then((res) => res.body);
      const c = openRequest
        .post('/api/books')
        .send({ title: 'Faux Book C' })
        .then((res) => res.body);
      Promise.all([a, b, c]).then(async (books) => {
        const data = await openRequest.get(url).then((res) => res.body); // ! might not work with async
        assert.isArray(data);
        assert.isAtLeast(data.length, 3);
        data.forEach((book) => {
          assert.isObject(book);
          assert.property(book, 'title');
          assert.isString(book.title);
          assert.property(book, '_id');
          assert.isTrue(isValidObjectId(book['_id']));
          assert.property(book, 'commentcount');
          assert.isNumber(book.commentcount);
        });
        done();
      });
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });

  // You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing
  //  the properties title, _id, and a comments array(empty array if no comments present).
  // If no book is found, return the string no book exists.

  test(`H-3. You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing
  the properties title, _id, and a comments array(empty array if no comments present).
  If no book is found, return the string no book exists.`, (done) => {
    try {
      const url = '/api/books';
      let noBook = openRequest
        .get(url + '/5f665eb46e296f6b9b6a504d')
        .then((res) => res.text);
      Promise.resolve(noBook).then((noBook) => {
        assert.isString(noBook);
        assert.equal(noBook, 'no book exists');
        openRequest
          .post(url)
          .send({ title: 'Faux Book Alpha' })
          .then((res) => res.body)
          .then((sampleBook) => {
            const bookId = sampleBook._id;
            openRequest
              .get(url + '/' + bookId)
              .then((res) => res.body)
              .then((bookQuery) => {
                assert.isObject(bookQuery);
                assert.property(bookQuery, 'title');
                assert.equal(bookQuery.title, 'Faux Book Alpha');
                assert.property(bookQuery, 'comments');
                assert.isArray(bookQuery.comments);
                done();
              });
          });
      });
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });

  // You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment to a book.
  //  The returned response will be the books object similar to GET / api / books / { _id } request in an earlier test.
  // If comment is not included in the request, return the string missing required field comment.If no book is found,
  // return the string no book exists.
  test(`H-4. You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment to a book.
  The returned response will be the books object similar to GET / api / books / { _id } request in an earlier test.
  If comment is not included in the request, return the string missing required field comment.If no book is found,
  return the string no book exists.`, (done) => {
    try {
      const url = '/api/books';
      openRequest
        .post(url)
        .send({ title: 'Notable Book' })
        .then((res) => res.body)
        .then((commentTarget) => {
          const bookId = commentTarget._id;
          openRequest
            .post(url + '/' + bookId)
            .send({ comment: 'This book is fab!' }) // ! may error
            .then(() => {
              openRequest
                .post(url + '/' + bookId)
                .send({ comment: 'I did not care for it' })
                .then((res) => res.body)
                .then((bookCom2) => {
                  assert.isObject(bookCom2);
                  assert.property(bookCom2, '_id');
                  assert.property(bookCom2, 'title');
                  assert.property(bookCom2, 'comments');
                  assert.lengthOf(bookCom2.comments, 2);
                  bookCom2.comments.forEach((comment) => {
                    assert.isString(comment);
                    assert.oneOf(comment, [
                      'This book is fab!',
                      'I did not care for it'
                    ]);
                  });
                  openRequest
                    .post(url + '/' + bookId)
                    .send({})
                    .then((res) => res.text)
                    .then((commentErr) => {
                      assert.isString(commentErr);
                      assert.equal(
                        commentErr,
                        'missing required field comment'
                      );
                      openRequest
                        .post(url + '/5f665eb46e296f6b9b6a504d')
                        .send({ comment: 'Never Seen Comment' })
                        .then((res) => res.text)
                        .then((failingComment) => {
                          assert.isString(failingComment);
                          assert.equal(failingComment, 'no book exists');
                          done();
                        });
                    });
                });
            });
        });
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });

  // You can send a DELETE request to /api/books/{_id} to delete a book from the collection.
  // The returned response will be the string delete successful if successful.
  // If no book is found, return the string no book exists.
  test(`H-5. You can send a DELETE request to /api/books/{_id} to delete a book from the collection. 
  The returned response will be the string delete successful if successful.
  If no book is found, return the string no book exists.`, (done) => {
    try {
      const url = '/api/books';
      openRequest
        .post(url)
        .send({ title: 'Deletable Book' })
        .then((res) => res.body)
        .then((deleteTarget) => {
          assert.isObject(deleteTarget);
          const bookId = deleteTarget._id;
          openRequest
            .delete(url + '/' + bookId)
            .then((res) => res.text)
            .then((doDelete) => {
              assert.isString(doDelete);
              assert.equal(doDelete, 'delete successful');
              openRequest
                .delete(url + '/5f665eb46e296f6b9b6a504d')
                .then((res) => res.text)
                .then((failingDelete) => {
                  assert.isString(failingDelete);
                  assert.equal(failingDelete, 'no book exists');
                  done();
                });
            });
        });
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });

  // You can send a DELETE request to /api/books to delete all books in the database.
  // The returned response will be the string complete delete successful if successful.
  test(`H-6. You can send a DELETE request to /api/books to delete all books in the database.
  The returned response will be the string complete delete successful if successful.`, (done) => {
    try {
      const url = '/api/books';
      openRequest
        .delete(url)
        .then((res) => res.text)
        .then((deleteAll) => {
          assert.isString(deleteAll);
          assert.equal(deleteAll, 'complete delete successful');
          done();
        });
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });

  after((done) => {
    try {
      openRequest
        .post('/api/books')
        .send({ title: '(Always There) Test Book' })
        .end(done);
    } catch (error) {
      clg('error: ', error);
      done(error);
    }
  });


  // All 10 functional tests required are complete and passing.
  // test(`H-7. All 10 functional tests required are complete and passing.`, (done) => {
  //   try {
  //     const url = '/_api/get-tests';
  //     openRequest.get(url).end((err, res) => {
  //       const tests = res.body;
  //       assert.isArray(tests);
  //       assert.isAtLeast(tests.length, 10, 'At least 10 tests passed');
  //       let testIndex = 0;
  //       for (const _test of tests) {
  //         assert.equal(_test.state, 'passed', 'Test in Passed State');
  //         assert.isAtLeast(
  //           _test.assertions.length,
  //           1,
  //           'At least one assertion per test'
  //         );
  //         testIndex++;
  //         if (testIndex === 10) clg('All 10 tests passed, I should call done();');
  //       }
  //       clg('tests: ', tests);
  //       done();
  //     });
  //   } catch (error) {
  //     clg('error: ', error);
  //     done(error);
  //   }
  // });
});


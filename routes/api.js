/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const mongoose = require('mongoose');
const Book = require('../models/Book');

const clg = console.log; // debug: ⏮️

module.exports = function (app) {
  app
    .route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        let books = await Book.find().exec();
        books = books.map((book) => ({
          _id: book._doc._id,
          title: book._doc.title,
          comments: book._doc.comments,
          commentcount: book._doc.comments.length
        }));
        res.json(books);
      } catch (error) {
        clg('error: ', error);
        res.status(500).send('Error retrieving books');
      }
    })

    .post((req, res) => {
      const title = req.body.title;
      //response will contain new book object including atleast _id and title
      try {
        if (!title) {
          res.send('missing required field title');
          return;
        }
        const book = new Book({
          title,
          _id: req.body?._id ?? new mongoose.Types.ObjectId()
        });
        book.save();
        res.json(book);
      } catch (error) {
        res.status(500).send('Error saving book');
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const deleted = await Book.deleteMany({}).exec();

        if (!deleted) {
          clg('error: ', error);
          res.status(500).send('Error deleting books');
        } else {
          res.send('complete delete successful');
        }
      } catch (error) {
        clg('error: ', error);
        res.status(500).send('Error deleting books');
      }
    });

  app
    .route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      if (!mongoose.isValidObjectId(bookid)) {
        res.send('no book exists');
        return;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send('no book exists');
          return;
        }
        res.json(book);
      } catch (error) {
        clg('error: ', error);
        res.status(500).send('Error retrieving book');
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!mongoose.isValidObjectId(bookid)) {
        res.send('no book exists');
        return;
      }
      try {
        if (!comment) {
          res.send('missing required field comment');
          return;
        }
        const updateCandidate = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true }
        ).exec();

        if (!updateCandidate) {
          res.send('no book exists');
          return;
        }
        res.json(updateCandidate);
      } catch (error) {
        clg('error: ', error);
        res.status(500).send('Error retrieving book');
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        if (!mongoose.isValidObjectId(bookid)) {
          res.send('no book exists');
          return;
        }
        const deleteCandidate = await Book.findByIdAndDelete(bookid).exec();
        if (!deleteCandidate) {
          res.send('no book exists');
          return;
        }
        res.send('delete successful');
      } catch (error) {
        clg('error: ', error);
        res.status(500).send('Error deleting book');
      }
    });
};


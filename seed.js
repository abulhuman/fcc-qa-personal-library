const Book = require('./models/Book');
const connectMongoose = require('./db');
require('dotenv').config();

const uri = process.env.DB ?? '';
(async () => {
  await connectMongoose(uri).catch(console.error);
})();

const bookSeedData = [
  {
    title: 'The Lord of the Rings',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Hobbit',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Fellowship of the Ring',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Two Towers',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Return of the King',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Silmarillion',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Children of Húrin',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'Unfinished Tales',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The History of Middle-earth',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Fall of Gondolin',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Book of Lost Tales',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Lays of Beleriand',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Shaping of Middle-earth',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Lost Road and Other Writings',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  },
  {
    title: 'The Return of the Shadow',
    comments: ['I love this book', 'I hate this book', 'I like this book']
  }
];

const booksCount = bookSeedData.length;
const commentsCount = bookSeedData.reduce(
  (acc, book) => acc + book.comments.length,
  0
);

(async () => {
  for (const book of bookSeedData) {
    const seededBook = await new Book({ title: book.title }).save();
    console.log('Seeding Book: ', seededBook.title);
    const bookId = seededBook?._id;
    for (const comment of book.comments) {
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { $push: { comments: comment } },
        { new: true }
      ).exec();
      if (updatedBook) {
        console.log(`Commenting '${comment}' on Book '${seededBook.title}'`);
      }
    }
  }

  const allBooks = await Book.find();
  const createdBookCount = allBooks.length;
  const createdCommentCount = allBooks.reduce(
    (acc, book) => acc + book.comments.length,
    0
  );
  console.log(
    'Current Book Count Vs Seed Count: ',
    createdBookCount,
    booksCount
  );
  console.log(
    'Current Comment Count Vs Seed Count: ',
    createdCommentCount,
    commentsCount
  );
  if (
    createdBookCount === booksCount + 1 &&
    createdCommentCount === commentsCount
  )
    process.kill(process.pid, 'SIGTERM');
})();


/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose')
const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: [String]
  }
})

const Book = mongoose.model('books', bookSchema)
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.aggregate([
        { $match: {} },
        { $project: { _id: 1, title: 1, commentcount: { $size: "$comments" } } }
      ]).then(books => {
        res.json(books)
      })
      .catch(error => {
        console.log(error)
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;

      if(!title){ return res.send('missing required field title') }

      const newBook = new Book({title})

      newBook.save()
      .then(book => {
        return res.json(book)
      })
      .catch(error => {

      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({})
      .then(data => {
        return res.send('complete delete successful')
      })
      .catch(error => {
        console.log(error)
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid)
      .then(book => {
        if(!book || Object.keys(book).length === 0){ return res.send('no book exists') }
        res.json(book)
      })
      .catch(error => {
        return res.send('no book exists')
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){ return res.send('missing required field comment') }

      Book.findByIdAndUpdate(bookid, {$push : {comments: comment}}, { new: true })
      .then(book => {
        if(!book || Object.keys(book).length === 0){ return res.send('no book exists') }
        res.json(book)
      })
      .catch(error => {
        return res.send('no book exists')
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid)
      .then(book => {
        if(!book || Object.keys(book).length === 0){ return res.send('no book exists') }
        res.send('delete successful')
      })
      .catch(error => {
        console.log(error)
        res.send('no book exists')
      })
      //if successful response will be 'delete successful'
    });
  
};

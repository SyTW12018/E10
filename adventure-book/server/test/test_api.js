"use strict"

 var assert = require('assert');
 var request = require('supertest')
 var app = require('../src/app.js')

 var request = request("http://localhost:8081")

 describe('Comprobar', function() {
     describe('GET', function(){
         it('Should return json as default data format', function(done){
            let user = {"name":"pedrito"} 
            console.log(user.type)
            request.get('/comprobar')
                .send(user)
                .expect('Content-Type', /json/)
                .expect(200, done);
         });
     });
 });
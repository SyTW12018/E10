"use strict"

 var assert = require('assert');
 var request = require('supertest')
 var app = require('../src/app.js')

 var request = request("http://localhost:8081")

 describe('Comprobar', function() {
     describe('GET', function(){
         it('Should return json as default data format', function(done){ 
            request.get('/comprobar')
                .send({"name":"sergio", "pass":"12345"})
                .expect('Content-Type', /json/)
                //.expect(200, done);
                done();
         });
     });
 });
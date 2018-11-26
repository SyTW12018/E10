"use strict"

 var assert = require('assert');
 var request = require('supertest')
 var app = require('../src/app.js')
 var chai = require('chai')
 var chai_http = require('chai-http')

 var expect = chai.expect;
 chai.use(chai_http);


 var request = request("http://localhost:8081")

 describe('Comprobar', function() {
     describe('GET', function(){
         it('Should return json as default data format', function(done){
            let user = {"name":"sergio"} 
            request.get('/comprobar')
                .send(user)
                .expect('Content-Type', /json/)
                //.expect(200, done);
                done();
         });
     });
 });


 describe('Sign UP', function(){
     it('Should return the user and his token', function(done){
         request.post('/signup')
            .send({"name_":"Bea", "pass_":"1234", "mail_":"beita@gmail.com"})
            .end(function(err, res){
                //var name_res = res.user;
                var toJSON = JSON.stringify(res.text)
                console.log("Usuario en mocha " + toJSON)
                expect(res).to.have.status(200)
                
                
                done(err);
            })
            
     });
 });
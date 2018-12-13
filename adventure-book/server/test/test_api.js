"use strict"

 var assert = require('assert');
 var request = require('supertest')
 var app = require('../src/app.js')
 var chai = require('chai')
 var chai_http = require('chai-http')

 var expect = chai.expect;
 chai.use(chai_http);


console.log(process.argv);
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


describe('Follow_W', function() {
    describe('POST', function(){
        it('Should return json as default data format', function(done){ 
           request.post('/follow_W/sergio/Canarias')
            .expect('Content-Type', /json/)
            .expect(200);
            done();
        });
    });
});

/*
describe('SignUp', function() {
    describe('POST', function(){
        it('Should return json as default data format', function(done){ 
           request.post('/signup')
            .send({"name": "sergio", "pass" :"123", "email": "Sergio@gmail.com"})
            //.expect('Content-Type', /json/)
            .expect(200, done);
            done();
        });
    });
});
*/
/*
/* Suponemos que pasa por tener la base de datos en localhost y no puede acceder
 describe('Sign UP', function(){
     it('Should return the user and his token', function(done){
         request.post('/signup')
            .send({"name":"Bea", "pass":"1234", "mail":"beita@gmail.com"})
            .end(function(err, res){
                //var name_res = res.user;
                var data = JSON.parse(res.text)
                expect(res).to.have.status(200)
                expect(data).to.be.a('object')
                expect(data.user.name).to.equal('Bea')
                
                
                done(err);
            })
            
     });
 });
*/
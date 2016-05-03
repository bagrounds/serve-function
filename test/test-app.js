
;(function(){
    "use strict";

    var chai = require("chai");

    describe('app', function() {

        var serve = require('../app');
        var express = require('express');
        var portFinder = require('portfinder');
        var request = require('request');

        it('should serve a function as a REST API', function (done) {
            this.timeout(10000);
            portFinder.getPort(function test(error,port){

                var functionToserve = function(options,callback){
                    var result = options.a + options.b + options.c;
                    callback(null,result);
                };

                var options = {
                    port: port,
                    endpoint: '/hello/world',
                    function: functionToserve,
                    parameters: ['a','b','c']
                };

                serve(options);

                var testA = 'testA';
                var testB = 'testB';
                var testC = 'testC';


                var url = 'http://localhost:' + port;

                url += options.endpoint;

                url += '?a=' + testA;
                url += '&b=' + testB;
                url += '&c=' + testC;

                var expectedResponse = testA + testB + testC;

                request(url,function(error,response,body){
                    body = JSON.parse(body);

                    chai.expect(body.error).to.not.be.ok;

                    chai.expect(body.data).to.equal(expectedResponse);
                    done();
                });
            });
        });
    });
})();

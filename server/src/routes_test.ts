import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { BUILDINGS, parseEdges } from './campus';
import {
    clearDataForTesting, getBuildings, getUserData, getShortestPath,
    setUserData
  } from './routes';
import { readFileSync } from 'fs';


const content: string = readFileSync("data/campus_edges.csv", {encoding: 'utf-8'});
parseEdges(content.split("\n"));


describe('routes', function() {
  // TODO: add or update tests to verify you can set and get friends in task 5

  it('data_friends', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/userData', query: {}});
    const res1 = httpMocks.createResponse();
    getUserData(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "user" was missing');

    // Request for friends not present should return empty
    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/userData', query: {user: "Kevin"}});
    const res2 = httpMocks.createResponse();
    getUserData(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {schedule: [], friends: []});
    
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData', body: {}});
    const res3 = httpMocks.createResponse();
    setUserData(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
            'missing or invalid "user" in POST body');

    //set friends to have 3 names in it
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData',
         body: {
           user: "Kevin", 
           schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"}
           ],
           friends: ["Alice", "Bob", "Charlie"]
         }});
    const res4 = httpMocks.createResponse();
    setUserData(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: true});

    //get friends to make sure it was saved
    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/userData', query: {user: "Kevin"}});
    const res5 = httpMocks.createResponse();
    getUserData(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {
        schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"}
        ],
        friends: ["Alice", "Bob", "Charlie"]
    });
    
    //test if friend information is missing
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData', body: {user: "Kevin", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"}
        ]}});
    const res6 = httpMocks.createResponse();
    setUserData(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
            'missing or invalid friends');


    clearDataForTesting();
  });


  it('data_schedule', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/userData', query: {}});
    const res1 = httpMocks.createResponse();
    getUserData(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "user" was missing');

    // Request for schedule not present already should return empty.
    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/userData', query: {user: "Kevin"}});
    const res2 = httpMocks.createResponse();
    getUserData(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {schedule: [], friends: []});

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData', body: {}});
    const res3 = httpMocks.createResponse();
    setUserData(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
            'missing or invalid "user" in POST body');

    // Set the schedule to have two people on it.
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData',
         body: {user: "Kevin", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},  // quantum ultra theory
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ], friends: []}});
    const res5 = httpMocks.createResponse();
    setUserData(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Get schedule again to make sure it was saved.
    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/userData', query: {user: "Kevin"}});
    const res6 = httpMocks.createResponse();
    getUserData(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {
        schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
        ], 
        friends: []
    });
    //test if schedule information is missing
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData', body: {user: "Kevin", friends: ["Alice", "Bob"]}});
    const res7 = httpMocks.createResponse();
    setUserData(req7, res7);
    assert.deepStrictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
            'missing or invalid schedule information');

    clearDataForTesting();
  });

  it('getBuildings', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/buildings', query: {}});
    const res1 = httpMocks.createResponse();
    getBuildings(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {buildings: BUILDINGS});
  });

  it('getShortestPath', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {}});
    const res1 = httpMocks.createResponse();
    getShortestPath(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "user" was missing');

    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin"}});
    const res2 = httpMocks.createResponse();
    getShortestPath(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "hour" was missing');

    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "9:30"}});
    const res3 = httpMocks.createResponse();
    getShortestPath(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'user has no saved schedule');

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/schedule',
         body: {user: "Kevin", schedule: [
            {hour: "9:30", location: "MLR", desc: "GREEK 101"},
            {hour: "10:30", location: "CS2", desc: "CSE 989"},
            {hour: "11:30", location: "HUB", desc: "nom nom"},
          ], friends: ["Alice", "Bob", "Charlie"]}});
    const res4 = httpMocks.createResponse();
    setUserData(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: true});

    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "8:30"}});
    const res5 = httpMocks.createResponse();
    getShortestPath(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), 'user has no event starting at this hour');

    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "9:30"}});
    const res6 = httpMocks.createResponse();
    getShortestPath(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        'user is not walking between classes at this hour');

    const req7 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}});
    const res7 = httpMocks.createResponse();
    getShortestPath(req7, res7);
    assert.deepStrictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().found, true);
    assert.deepStrictEqual(res7._getData().path.length > 0, true);
    assert.deepStrictEqual(res7._getData().nearby, []);

    // TODO: improve this test to include "nearby" results in Task 5
    //set up Alice's schedule and friends wiht
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData',
         body: {
           user: "Alice", 
           schedule: [
            {hour: "9:30", location: "CS2", desc: "CSE 142"},
            {hour: "10:30", location: "HUB", desc: "MATH 125"},
            {hour: "11:30", location: "MLR", desc: "ENGL 101"}
           ],
           friends: ["Kevin", "Charlie"]}});
    const res8 = httpMocks.createResponse();
    setUserData(req8, res8);
    assert.deepStrictEqual(res8._getStatusCode(), 200);
    

    // set up Charlie's schedule but not as kevin's friend
    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData',
        body: {
        user: "Charlie", 
        schedule: [
            {hour: "9:30", location: "MLR", desc: "HIST 101"},
            {hour: "10:30", location: "CS2", desc: "PHYS 121"},
            {hour: "11:30", location: "HUB", desc: "Lunch"}
        ],
        friends: ["Alice"]}});
    const res9 = httpMocks.createResponse();
    setUserData(req9, res9);
    assert.deepStrictEqual(res9._getStatusCode(), 200);

    // set up Bob's schedule as kevin and alice's friend
    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/api/userData',
        body: {
        user: "Bob", 
        schedule: [
            {hour: "9:30", location: "DEN", desc: "class1"},
            {hour: "10:30", location: "EEB", desc: "class2"},
            {hour: "11:30", location: "GWN", desc: "class3"}
        ],
        friends: ["Alice", "Kevin"]}});
    const res10 = httpMocks.createResponse();
    setUserData(req10, res10);
    assert.deepStrictEqual(res10._getStatusCode(), 200);

    //test get shortest path for kevin
    const req11 = httpMocks.createRequest(
        {method: 'GET', url: '/api/shortestPath', query: {user: "Kevin", hour: "10:30"}});
    const res11 = httpMocks.createResponse();
    getShortestPath(req11, res11);
    assert.deepStrictEqual(res11._getStatusCode(), 200);
    const pathData = res11._getData();
    assert.deepStrictEqual(pathData.found, true);
    assert.deepStrictEqual(pathData.path.length > 0, true);
    
    // verify nearby friends
    // alice and bob should be nearby since they're Kevin's friends
    // Charlie should not be nearby since not friends with Kevin
    const nearbyFriends = pathData.nearby;
    assert.deepStrictEqual(nearbyFriends.length, 2);
    assert.deepStrictEqual(nearbyFriends[0].friend, "Alice");
    assert.deepStrictEqual(nearbyFriends[1].friend, "Bob");

    clearDataForTesting();
  });

});

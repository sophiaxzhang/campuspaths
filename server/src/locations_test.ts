import * as assert from 'assert';
import {
    centroid, distance, sameLocation, squaredDistance, distanceMoreThan
  } from './locations';


describe('locations', function() {

  it('sameLocations', function() {
    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 0, y: 0}), true);
    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 0, y: 1}), true);
    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 1, y: 0}), true);
    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 1, y: 1}), true);

    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 0, y: 1}), false);
    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 1, y: 0}), false);
    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 1, y: 1}), false);

    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 0, y: 0}), false);
    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 1, y: 0}), false);
    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 1, y: 1}), false);

    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 0, y: 0}), false);
    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 0, y: 1}), false);
    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 1, y: 1}), false);

    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 0, y: 0}), false);
    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 0, y: 1}), false);
    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 1, y: 0}), false);
  });

  it('squaredDistance', function() {
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 1, y: 1}), 2);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 0, y: 1}), 1);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 1, y: 0}), 1);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 2, y: 0}), 4);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 0, y: 2}), 4);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 2, y: 2}), 8);
  });

  it('distance', function() {
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 1, y: 1}) - Math.sqrt(2)) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 0, y: 1}) - 1) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 1, y: 0}) - 1) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 2, y: 0}) - 2) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 0, y: 2}) - 2) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 2, y: 2}) - Math.sqrt(8)) < 1e-3);
  });

  it('centroid', function() {
    assert.deepStrictEqual(centroid([{x: 0, y: 1}]), {x: 0, y: 1});
    assert.deepStrictEqual(centroid([{x: 1, y: 2}]), {x: 1, y: 2});

    assert.deepStrictEqual(centroid([{x: 0, y: 0}, {x: 1, y: 2}]), {x: 0.5, y: 1});
    assert.deepStrictEqual(centroid([{x: 0, y: 0}, {x: 1, y: 2}]), {x: 0.5, y: 1});
    assert.deepStrictEqual(centroid([{x: 0, y: 1}, {x: 1, y: 2}]), {x: 0.5, y: 1.5});
    assert.deepStrictEqual(
        centroid([{x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 3}]), {x: 1, y: 2});
  });

  it('distanceMoreThan', function() {
    const locIn = {x: 1, y: 1};
    const region = { x1: 0, x2: 10, y1: 0, y2: 10 };
    const locNE = {x: 12, y: -1};
    const locSE = {x: 12, y: 12};
    const locSW = {x: -1, y: 12};
    const locNW = {x: -2, y: -2};
    const locN = {x: 5, y: -2};
    const locE = {x: 15, y: 5};
    const locS= {x: 5, y: 16};
    const locW = {x: -7, y: 5};
    //branch coverage: 
    //first branch (dist is negative)
    assert.throws(() => distanceMoreThan(locIn, region, -5));
    //second branch (location is in region)
    assert.deepStrictEqual(distanceMoreThan(locIn, region, 1), false);
    //third branch (location is NE of region)
    assert.deepStrictEqual(distanceMoreThan(locNE, region, 2), true);
    //fourth branch (location is SE of region)
    assert.deepStrictEqual(distanceMoreThan(locSE, region, 3), false);
    assert.deepStrictEqual(distanceMoreThan(locSE, region, 2), true);
    //fifth branch (location is SW of region)
    assert.deepStrictEqual(distanceMoreThan(locSW, region, 2), true);
    assert.deepStrictEqual(distanceMoreThan(locSW, region, 3), false);
    //sixth branch (location is NW of region)
    assert.deepStrictEqual(distanceMoreThan(locNW, region, 2), true);
    assert.deepStrictEqual(distanceMoreThan(locNW, region, 3), false);
    //seventh branch (location is N of region)
    assert.deepStrictEqual(distanceMoreThan(locN, region, 1), true);
    assert.deepStrictEqual(distanceMoreThan(locN, region, 2), false);
    //eigth branch (location is E of region)
    assert.deepStrictEqual(distanceMoreThan(locE, region, 4), true);
    assert.deepStrictEqual(distanceMoreThan(locE, region, 6), false);
    //ninth branch (location is S of region)
    assert.deepStrictEqual(distanceMoreThan(locS, region, 5), true);
    assert.deepStrictEqual(distanceMoreThan(locS, region, 7), false);
    //tenth branch (location is W of region)
    assert.deepStrictEqual(distanceMoreThan(locW, region, 6), true);
    assert.deepStrictEqual(distanceMoreThan(locW, region, 8), false);

    //statement coverage: covered above by case where location in region and cases where location not in region
  });

});

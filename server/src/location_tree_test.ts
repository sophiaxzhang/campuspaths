import * as assert from 'assert';
import { buildTree, findClosestInTree, closestInTree, NO_INFO, LocationTree } from './location_tree';


describe('location_tree', function() {

  it('buildTree', function() {
    assert.deepStrictEqual(buildTree([]), {kind: "empty"});

    assert.deepStrictEqual(buildTree([{x: 1, y: 1}]),
        {kind: "single", loc: {x: 1, y: 1}});
    assert.deepStrictEqual(buildTree([{x: 2, y: 2}]),
        {kind: "single", loc: {x: 2, y: 2}});

    assert.deepStrictEqual(buildTree([{x: 1, y: 1}, {x: 3, y: 3}]),
        {kind: "split", at: {x: 2, y: 2},
         nw: {kind: "single", loc: {x: 1, y: 1}},
         ne: {kind: "empty"},
         sw: {kind: "empty"},
         se: {kind: "single", loc: {x: 3, y: 3}}});
    assert.deepStrictEqual(buildTree([{x: 1, y: 3}, {x: 3, y: 1}]),
        {kind: "split", at: {x: 2, y: 2},
         nw: {kind: "empty"},
         ne: {kind: "single", loc: {x: 3, y: 1}},
         sw: {kind: "single", loc: {x: 1, y: 3}},
         se: {kind: "empty"}});

    assert.deepStrictEqual(buildTree(
        [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 5}, {x: 7, y: 7}]),
        {kind: "split", at: {x: 4, y: 4},
         nw: {kind: "split", at: {x: 2, y: 2},
              nw: {kind: "single", loc: {x: 1, y: 1}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 3, y: 3}}},
         ne: {kind: "empty"},
         sw: {kind: "empty"},
         se: {kind: "split", at: {x: 6, y: 6},
              nw: {kind: "single", loc: {x: 5, y: 5}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 7, y: 7}}}});
    assert.deepStrictEqual(buildTree(
        [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}]),
        {kind: "split", at: {x: 2, y: 2},
          nw: {kind: "split", at: {x: 0.5, y: 0.5},
            nw: {kind: "single", loc: {x: 0, y: 0}},
            ne: {kind: "empty"},
            sw: {kind: "empty"},
            se: {kind: "single", loc: {x: 1, y: 1}}},
          ne: {kind: "empty"},
          sw: {kind: "empty"},
          se: {kind: "split", at: {x: 3, y: 3},
              nw: {kind: "single", loc: {x: 2, y: 2}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "split", at: {x: 3.5, y: 3.5},
                nw: {kind: "single", loc: {x: 3, y: 3}},
                ne: {kind: "empty"},
                sw: {kind: "empty"},
                se: {kind: "single", loc: {x: 4, y: 4}}}}});
    assert.deepStrictEqual(buildTree(
        [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 3}, {x: 7, y: 1},
         {x: 1, y: 7}, {x: 3, y: 5}, {x: 5, y: 5}, {x: 7, y: 7}]),
        {kind: "split", at: {x: 4, y: 4},
         nw: {kind: "split", at: {x: 2, y: 2},
              nw: {kind: "single", loc: {x: 1, y: 1}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 3, y: 3}}},
         ne: {kind: "split", at: {x: 6, y: 2},
              nw: {kind: "empty"},
              sw: {kind: "single", loc: {x: 5, y: 3}},
              ne: {kind: "single", loc: {x: 7, y: 1}},
              se: {kind: "empty"}},
         sw: {kind: "split", at: {x: 2, y: 6},
              nw: {kind: "empty"},
              ne: {kind: "single", loc: {x: 3, y: 5}},
              sw: {kind: "single", loc: {x: 1, y: 7}},
              se: {kind: "empty"}},
         se: {kind: "split", at: {x: 6, y: 6},
              nw: {kind: "single", loc: {x: 5, y: 5}},
              ne: {kind: "empty"},
              sw: {kind: "empty"},
              se: {kind: "single", loc: {x: 7, y: 7}}}});
  });

  it('closestInTree', function() {
    //branch coverage: below tests execute each branch in the function
    const loc = {x: 20, y: 20};
    const region = { x1: 0, x2: 10, y1: 0, y2: 10 };
    const closest = {loc: {x: 5, y: 10}, dist: 1};
    //dist from loc to bounds is more than closest dist
    assert.deepStrictEqual(closestInTree({kind: "single", loc: {x: 1, y: 5}}, loc, region, closest), closest);
    //tree is empty
    const closest2 = {loc: {x: 5, y: 10}, dist: 2};
    assert.deepStrictEqual(closestInTree({kind: "empty"}, loc, region, closest2), closest2);
    //tree is single and dist(loc, tree.loc) < closest dist
    const loc2 = {x: 1, y: 6};
    assert.deepStrictEqual(closestInTree({kind: "single", loc: {x: 1, y: 5}}, loc2, region, closest2), {loc: {x: 1, y: 5}, dist: 1});

    //tree is single and dist(loc, tree.loc) > closest dist
    const closest3 = {loc: {x: 5, y: 10}, dist: 0};
    assert.deepStrictEqual(closestInTree({kind: "single", loc: {x: 1, y: 5}}, loc2, region, closest3), closest3);

    //tree is a split
    const tree: LocationTree = {
      kind: "split",
      at: {x: 5, y: 5},
      nw: {
        kind: "split",
        at: {x: 3, y: 3},
        nw: { kind: "single", loc: {x: 2, y: 2} },
        ne: { kind: "single", loc: {x: 4, y: 2} },
        sw: { kind: "single", loc: {x: 2, y: 4} },
        se: { kind: "single", loc: {x: 4, y: 4} }
      },
      ne: {
        kind: "split",
        at: {x: 7, y: 3},
        nw: { kind: "single", loc: {x: 6, y: 2} },
        ne: { kind: "single", loc: {x: 8, y: 2} },
        sw: { kind: "single", loc: {x: 6, y: 4} },
        se: { kind: "single", loc: {x: 8, y: 4} }
      },
      sw: {
        kind: "split",
        at: {x: 3, y: 7},
        nw: { kind: "single", loc: {x: 2, y: 6} },
        ne: { kind: "single", loc: {x: 4, y: 6} },
        sw: { kind: "single", loc: {x: 2, y: 8} },
        se: { kind: "single", loc: {x: 4, y: 8} }
      },
      se: {
        kind: "split",
        at: {x: 7, y: 7},
        nw: { kind: "single", loc: {x: 6, y: 6} },
        ne: { kind: "single", loc: {x: 8, y: 6} },
        sw: { kind: "single", loc: {x: 6, y: 8} },
        se: { kind: "single", loc: {x: 8, y: 8} }
      }
    };
    const bounds = { x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity };

    // NE Quadrant
    //closer to NW quadrant
    assert.deepStrictEqual(
      closestInTree(tree, { x: 8, y: 1 }, bounds, NO_INFO),
      { loc: { x: 8, y: 2 }, dist: 1 }
    );
    //closer to SE quadrant
    assert.deepStrictEqual(
      closestInTree(tree, { x: 7, y: 3 }, bounds, NO_INFO),
      { loc: { x: 8, y: 4 }, dist: Math.sqrt(2) }
    );

    // SE Quadrant
    //closer to SW quadrant
    assert.deepStrictEqual(
      closestInTree(tree, { x: 9, y: 10 }, bounds, NO_INFO),
      { loc: { x: 8, y: 8 }, dist: Math.sqrt(5) }
    );
    //closer to NE quadrant
    assert.deepStrictEqual(
      closestInTree(tree, { x: 7, y: 7 }, bounds, NO_INFO),
      { loc: { x: 8, y: 8 }, dist: Math.sqrt(2) }
    );

    // SW Quadrant
    //closer to SE quadrant
    assert.deepStrictEqual(
      closestInTree(tree, { x: 1, y: 10 }, bounds, NO_INFO),
      { loc: { x: 2, y: 8 }, dist: Math.sqrt(5) }
    );
    //closer to NW quadrant
    assert.deepStrictEqual(
      closestInTree(tree, { x: 3, y: 7 }, bounds, NO_INFO),
      { loc: { x: 4, y: 8 }, dist: Math.sqrt(2) }
    );

    // NW Quadrant
    //closer to NE
    assert.deepStrictEqual(
      closestInTree(tree, { x: 2, y: 1 }, bounds, NO_INFO),
      {loc: { x: 2, y: 2 }, dist: 1 }
    );
    //closer to SW
    assert.deepStrictEqual(
      closestInTree(tree, { x: 1, y: 1 }, bounds, NO_INFO),
      {loc: { x: 2, y: 2 }, dist: Math.sqrt(2) }
    );
  
    //statement coverage: covered above by branch coverage
    //recursion: 
    // 0 case covered by case where tree is empty
    // 1 case: 
    const tree2: LocationTree = {
      kind: "split",
      at: { x: 5, y: 5 },
      nw: { kind: "single", loc: { x: 2, y: 2 } },
      ne: { kind: "single", loc: { x: 8, y: 2 } },
      sw: { kind: "single", loc: { x: 2, y: 8 } },
      se: { kind: "single", loc: { x: 8, y: 8 } }
    };
    assert.deepStrictEqual(
      closestInTree(tree2, { x: 3, y: 3 }, bounds, NO_INFO),
      { loc: { x: 2, y: 2 }, dist: Math.sqrt(2) } 
    );
    //many case covered above by split tree
  });


  it('findClosestInTree', function() {
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 2, y: 1}]),
        [{x: 1, y: 1}]),
      [{x: 2, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 3}]),
        [{x: 1, y: 1}]),
      [{x: 2, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}]),
      [{x: 1, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}, {x: 4.9, y: 4.9}]),
      [{x: 5, y: 5}, Math.sqrt((5-4.9)**2+(5-4.9)**2)]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 2, y: 1}, {x: -1, y: -1}]),
      [{x: 1, y: 1}, 1]);
    assert.deepStrictEqual(findClosestInTree(
        buildTree([{x: 1, y: 1}, {x: 1, y: 5}, {x: 5, y: 1}, {x: 5, y: 5}]),
        [{x: 4, y: 1}, {x: -1, y: -1}, {x: 10, y: 10}]),
      [{x: 5, y: 1}, 1]);
  });
});

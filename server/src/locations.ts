/** Represents an (x, y) coordinate location on the map. */
export type Location = {x: number, y: number};

/** 
 * Determines whether the two given locations are the same. 
 * @returns true if (loc1.x, loc1.y) = (loc2.x, loc2.y)
 */
export const sameLocation = (loc1: Location, loc2: Location): boolean => {
  return loc1.x === loc2.x && loc1.y === loc2.y;
}

/** 
 * Returns the squared distance between the two given locations 
 * @returns dist(loc1, loc2)^2
 */
export const squaredDistance = (loc1: Location, loc2: Location): number => {
  const dx = loc1.x - loc2.x;
  const dy = loc1.y - loc2.y;
  return dx*dx + dy*dy;
};

/** 
 * Returns the distance between the two given locations 
 * @returns dist(loc1, loc2)
 */
export const distance = (loc1: Location, loc2: Location): number => {
  return Math.sqrt(squaredDistance(loc1, loc2));
};

/**
 * Returns the average position of the given locations.
 * @param locs to average over, length must be >= 1
 * @returns Location representing average of all locs
 */
export const centroid = (locs: Array<Location>): Location => {
  let sx = 0;
  let sy = 0;
  let i = 0;
  
  // Inv: sx = sum of locs[j].x for j = 0 .. i-1 and
  //      sy = sum of locs[j].y for j = 0 .. i-1
  while (i !== locs.length) {
    sx += locs[i].x;
    sy += locs[i].y;
    i = i + 1;
  }

  return {x: sx / locs.length, y: sy / locs.length};
};


/**
 * Represents a rectangular range of space on the map. Note that infinite values
 * (Infinity and -Infinity) are allowed for the ends of either dimension.
 * Inv: x1 <= x2 and y1 <= y2
 */
export type Region = {x1: number, x2: number, y1: number, y2: number};


/**
 * Determines whether the distance from a given location to a given region 
 * is more than the given distance.
 * 
 * @param loc given location
 * @param region given region
 * @param dist to compare to distance between loc and region
 * @returns true if the distance from loc to closest point in Region is > than dist
 */
export const distanceMoreThan = (loc: Location, region: Region, dist: number): boolean => {
  if (dist < 0) {
    throw new Error(`not a valid distance: ${dist}`);
  }
  let locDist = 0;

  //location is in region
  if (region.x1 <= loc.x && loc.x <= region.x2 && region.y1 <= loc.y && loc.y <= region.y2) {
    return false; //since locDist = 0
  }
  //location is NE of region
  else if (loc.x > region.x2 && loc.y < region.y1){
    locDist = squaredDistance(loc, {x: region.x2, y: region.y1});
  }
  //location is SE of region
  else if (loc.x > region.x2 && loc.y > region.y2){
    locDist = squaredDistance(loc, {x: region.x2, y: region.y2});
  }
  //location is SW of region
  else if (loc.x < region.x1 && loc.y > region.y2){
    locDist = squaredDistance(loc, {x: region.x1, y: region.y2});
  }
  //location is NW of region
  else if (loc.x < region.x1 && loc.y < region.y1){
    locDist = squaredDistance(loc, {x: region.x1, y: region.y1});
  }
  //location is N of region
  else if (loc.y < region.y1) {
    locDist = region.y1 - loc.y;
    locDist = locDist ** 2;
  } 
  //location is E of region
  else if (loc.x > region.x2) {
    locDist = loc.x - region.x2;
    locDist = locDist ** 2;
  } 
  //location is S of region
  else if (loc.y > region.y2) {
    locDist = loc.y - region.y2;
    locDist = locDist ** 2;
 
  }
  //location is W of region 
  else if (loc.x < region.x1) {
    locDist = region.x1 - loc.x;
    locDist = locDist ** 2;
  }
  return locDist > dist ** 2;
  
}
// Extended Toronto Locations - Universities, Colleges, Parks, Malls, Libraries
// This extends the base toronto-locations.ts with even more locations

import { Coordinates } from './toronto-locations';

// All Toronto Universities and Colleges
export const EDUCATION: Map<string, Coordinates> = new Map([
  // Universities
  ['university of toronto', { lat: 43.6629, lng: -79.3957 }],
  ['u of t', { lat: 43.6629, lng: -79.3957 }],
  ['uoft', { lat: 43.6629, lng: -79.3957 }],
  ['university of toronto scarborough', { lat: 43.7845, lng: -79.1874 }],
  ['utsc', { lat: 43.7845, lng: -79.1874 }],
  ['university of toronto mississauga', { lat: 43.5477, lng: -79.6624 }],
  ['utm', { lat: 43.5477, lng: -79.6624 }],
  ['ryerson university', { lat: 43.6577, lng: -79.3788 }],
  ['toronto metropolitan university', { lat: 43.6577, lng: -79.3788 }],
  ['tmu', { lat: 43.6577, lng: -79.3788 }],
  ['york university', { lat: 43.7735, lng: -79.5019 }],
  ['york u', { lat: 43.7735, lng: -79.5019 }],
  ['glendon campus', { lat: 43.7276, lng: -79.3782 }],
  ['ocad university', { lat: 43.6530, lng: -79.3912 }],
  ['ocad', { lat: 43.6530, lng: -79.3912 }],
  
  // Colleges
  ['george brown college', { lat: 43.6513, lng: -79.3700 }],
  ['george brown casa loma', { lat: 43.6761, lng: -79.4105 }],
  ['george brown waterfront', { lat: 43.6447, lng: -79.3590 }],
  ['seneca college', { lat: 43.7955, lng: -79.3496 }],
  ['seneca newnham', { lat: 43.7955, lng: -79.3496 }],
  ['seneca markham', { lat: 43.8517, lng: -79.3703 }],
  ['seneca york', { lat: 43.7713, lng: -79.4986 }],
  ['humber college', { lat: 43.7294, lng: -79.6072 }],
  ['humber north', { lat: 43.7294, lng: -79.6072 }],
  ['humber lakeshore', { lat: 43.5955, lng: -79.5021 }],
  ['centennial college', { lat: 43.7854, lng: -79.2264 }],
  ['centennial progress', { lat: 43.7854, lng: -79.2264 }],
  ['centennial morningside', { lat: 43.7869, lng: -79.1950 }],
  ['centennial ashtonbee', { lat: 43.7315, lng: -79.2904 }],
  ['sheridan college', { lat: 43.4693, lng: -79.6985 }],
  
  // Specialized Schools
  ['ontario college of art and design', { lat: 43.6530, lng: -79.3912 }],
  ['royal conservatory of music', { lat: 43.6677, lng: -79.3933 }],
  ['national ballet school', { lat: 43.6582, lng: -79.3643 }],
  ['canadian film centre', { lat: 43.7896, lng: -79.3509 }],
  ['michener institute', { lat: 43.6604, lng: -79.3880 }],
]);

// Major Parks and Green Spaces
export const PARKS: Map<string, Coordinates> = new Map([
  // Large Parks
  ['high park', { lat: 43.6465, lng: -79.4637 }],
  ['trinity bellwoods park', { lat: 43.6465, lng: -79.4137 }],
  ['trinity bellwoods', { lat: 43.6465, lng: -79.4137 }],
  ['christie pits', { lat: 43.6647, lng: -79.4204 }],
  ['dufferin grove park', { lat: 43.6558, lng: -79.4319 }],
  ['allan gardens', { lat: 43.6615, lng: -79.3747 }],
  ['moss park', { lat: 43.6554, lng: -79.3677 }],
  ['riverdale park', { lat: 43.6700, lng: -79.3620 }],
  ['riverdale park east', { lat: 43.6668, lng: -79.3526 }],
  ['riverdale park west', { lat: 43.6700, lng: -79.3620 }],
  ['withrow park', { lat: 43.6796, lng: -79.3480 }],
  ['monarch park', { lat: 43.6873, lng: -79.3211 }],
  
  // Waterfront Parks
  ['harbourfront', { lat: 43.6389, lng: -79.3817 }],
  ['sugar beach', { lat: 43.6444, lng: -79.3621 }],
  ['cherry beach', { lat: 43.6367, lng: -79.3444 }],
  ['woodbine beach', { lat: 43.6632, lng: -79.3049 }],
  ['kew beach', { lat: 43.6683, lng: -79.2970 }],
  ['balmy beach', { lat: 43.6700, lng: -79.2900 }],
  ['sunnyside beach', { lat: 43.6376, lng: -79.4525 }],
  ['hanlan\'s point', { lat: 43.6194, lng: -79.3933 }],
  ['centre island', { lat: 43.6178, lng: -79.3736 }],
  ['ward\'s island', { lat: 43.6300, lng: -79.3553 }],
  
  // Ravines and Nature
  ['don valley', { lat: 43.6927, lng: -79.3486 }],
  ['taylor creek park', { lat: 43.6897, lng: -79.3083 }],
  ['earl bales park', { lat: 43.7438, lng: -79.4344 }],
  ['edwards gardens', { lat: 43.7334, lng: -79.3598 }],
  ['sunnybrook park', { lat: 43.7227, lng: -79.3653 }],
  ['cedarvale park', { lat: 43.6875, lng: -79.4286 }],
  ['rosedale ravine', { lat: 43.6787, lng: -79.3753 }],
  ['moore park ravine', { lat: 43.6927, lng: -79.3753 }],
  ['glen stewart ravine', { lat: 43.6803, lng: -79.2875 }],
  
  // Squares and Urban Parks
  ['nathan phillips square', { lat: 43.6527, lng: -79.3839 }],
  ['dundas square', { lat: 43.6561, lng: -79.3802 }],
  ['yonge dundas square', { lat: 43.6561, lng: -79.3802 }],
  ['david pecaut square', { lat: 43.6460, lng: -79.3869 }],
  ['berczy park', { lat: 43.6477, lng: -79.3747 }],
  ['st james park', { lat: 43.6513, lng: -79.3731 }],
  ['queens park', { lat: 43.6640, lng: -79.3922 }],
  ['alexandra park', { lat: 43.6477, lng: -79.4063 }],
  ['bellevue square park', { lat: 43.6542, lng: -79.4030 }],
  ['grange park', { lat: 43.6512, lng: -79.3925 }],
  
  // Sports Parks
  ['lamport stadium', { lat: 43.6411, lng: -79.4219 }],
  ['bickford park', { lat: 43.6620, lng: -79.4280 }],
  ['wychwood barns park', { lat: 43.6792, lng: -79.4204 }],
  ['ramsden park', { lat: 43.6778, lng: -79.3934 }],
  ['greenwood park', { lat: 43.6673, lng: -79.3211 }],
  ['stan wadlow park', { lat: 43.6947, lng: -79.3099 }],
  ['thomson memorial park', { lat: 43.7615, lng: -79.2883 }],
  ['centennial park', { lat: 43.6511, lng: -79.5912 }],
  ['downsview park', { lat: 43.7473, lng: -79.4783 }],
  ['earl haig park', { lat: 43.7697, lng: -79.4433 }],
]);

// Shopping Malls and Centers
export const SHOPPING: Map<string, Coordinates> = new Map([
  // Downtown Malls
  ['eaton centre', { lat: 43.6544, lng: -79.3807 }],
  ['cf eaton centre', { lat: 43.6544, lng: -79.3807 }],
  ['hudson bay', { lat: 43.6525, lng: -79.3792 }],
  ['the bay', { lat: 43.6525, lng: -79.3792 }],
  ['yorkville', { lat: 43.6707, lng: -79.3933 }],
  ['manulife centre', { lat: 43.6701, lng: -79.3900 }],
  ['holt renfrew', { lat: 43.6713, lng: -79.3900 }],
  ['college park', { lat: 43.6601, lng: -79.3831 }],
  ['atrium on bay', { lat: 43.6555, lng: -79.3834 }],
  
  // West End Malls
  ['dufferin mall', { lat: 43.6561, lng: -79.4353 }],
  ['galleria shopping centre', { lat: 43.6542, lng: -79.4485 }],
  ['stockyards', { lat: 43.6664, lng: -79.4761 }],
  ['crossroads of the danforth', { lat: 43.6853, lng: -79.3147 }],
  ['junction', { lat: 43.6656, lng: -79.4867 }],
  
  // North York Malls
  ['yorkdale', { lat: 43.7255, lng: -79.4522 }],
  ['yorkdale mall', { lat: 43.7255, lng: -79.4522 }],
  ['fairview mall', { lat: 43.7777, lng: -79.3444 }],
  ['bayview village', { lat: 43.7688, lng: -79.3855 }],
  ['shops at don mills', { lat: 43.7367, lng: -79.3467 }],
  ['centerpoint mall', { lat: 43.7522, lng: -79.4108 }],
  ['promenade mall', { lat: 43.8082, lng: -79.4522 }],
  
  // Scarborough Malls
  ['scarborough town centre', { lat: 43.7765, lng: -79.2578 }],
  ['stc', { lat: 43.7765, lng: -79.2578 }],
  ['agincourt mall', { lat: 43.7888, lng: -79.2805 }],
  ['bridlewood mall', { lat: 43.8073, lng: -79.1897 }],
  ['malvern town centre', { lat: 43.8067, lng: -79.2178 }],
  ['cedarbrae mall', { lat: 43.7598, lng: -79.2347 }],
  ['woodside square', { lat: 43.8147, lng: -79.2958 }],
  
  // Etobicoke Malls
  ['sherway gardens', { lat: 43.6112, lng: -79.5569 }],
  ['cloverdale mall', { lat: 43.6375, lng: -79.5300 }],
  ['woodbine centre', { lat: 43.7131, lng: -79.5978 }],
  ['kipling plaza', { lat: 43.6408, lng: -79.5289 }],
  
  // Markets
  ['st lawrence market', { lat: 43.6487, lng: -79.3715 }],
  ['kensington market', { lat: 43.6542, lng: -79.4003 }],
  ['parkdale market', { lat: 43.6383, lng: -79.4367 }],
  ['wychwood barns', { lat: 43.6792, lng: -79.4204 }],
  ['evergreen brick works', { lat: 43.6839, lng: -79.3653 }],
  ['distillery district', { lat: 43.6503, lng: -79.3596 }],
]);

// Toronto Public Libraries
export const LIBRARIES: Map<string, Coordinates> = new Map([
  // Major Reference Libraries
  ['toronto reference library', { lat: 43.6717, lng: -79.3868 }],
  ['reference library', { lat: 43.6717, lng: -79.3868 }],
  ['north york central library', { lat: 43.7705, lng: -79.4145 }],
  ['fort york library', { lat: 43.6393, lng: -79.4040 }],
  
  // District Libraries
  ['lillian h smith library', { lat: 43.6583, lng: -79.4000 }],
  ['yorkville library', { lat: 43.6713, lng: -79.3933 }],
  ['deer park library', { lat: 43.6840, lng: -79.3900 }],
  ['rosedale library', { lat: 43.6773, lng: -79.3831 }],
  ['st james town library', { lat: 43.6677, lng: -79.3713 }],
  ['parliament library', { lat: 43.6642, lng: -79.3643 }],
  ['riverdale library', { lat: 43.6677, lng: -79.3464 }],
  ['beaches library', { lat: 43.6808, lng: -79.2970 }],
  ['bloor gladstone library', { lat: 43.6615, lng: -79.4371 }],
  ['roncesvalles library', { lat: 43.6489, lng: -79.4489 }],
  ['high park library', { lat: 43.6542, lng: -79.4665 }],
  ['runnymede library', { lat: 43.6661, lng: -79.4766 }],
  ['jane dundas library', { lat: 43.6656, lng: -79.4867 }],
  ['mount dennis library', { lat: 43.6989, lng: -79.4744 }],
  ['york woods library', { lat: 43.7615, lng: -79.5019 }],
  ['barbara frum library', { lat: 43.7688, lng: -79.4467 }],
  ['don mills library', { lat: 43.7583, lng: -79.3444 }],
  ['fairview library', { lat: 43.7777, lng: -79.3467 }],
  ['agincourt library', { lat: 43.7854, lng: -79.2805 }],
  ['cedarbrae library', { lat: 43.7598, lng: -79.2347 }],
  ['malvern library', { lat: 43.8067, lng: -79.2178 }],
  ['bridlewood library', { lat: 43.8073, lng: -79.1897 }],
  ['albion library', { lat: 43.7408, lng: -79.5769 }],
  ['richview library', { lat: 43.6875, lng: -79.5300 }],
  ['brentwood library', { lat: 43.6292, lng: -79.5483 }],
  ['mimico library', { lat: 43.6125, lng: -79.4967 }],
]);

// Recreation and Community Centers
export const REC_CENTERS: Map<string, Coordinates> = new Map([
  // Major Recreation Centers
  ['regent park aquatic centre', { lat: 43.6606, lng: -79.3631 }],
  ['regent park athletic grounds', { lat: 43.6583, lng: -79.3631 }],
  ['scadding court', { lat: 43.6425, lng: -79.4025 }],
  ['john innes community recreation', { lat: 43.6554, lng: -79.3677 }],
  ['wellesley community centre', { lat: 43.6653, lng: -79.3815 }],
  ['519 church', { lat: 43.6618, lng: -79.3815 }],
  ['miles nadal jcc', { lat: 43.6750, lng: -79.4036 }],
  ['harbourfront centre', { lat: 43.6389, lng: -79.3817 }],
  ['waterfront neighbourhood centre', { lat: 43.6389, lng: -79.3817 }],
  ['canoe landing', { lat: 43.6393, lng: -79.4006 }],
  
  // YMCA Centers
  ['ymca central', { lat: 43.6677, lng: -79.3876 }],
  ['ymca west end', { lat: 43.6533, lng: -79.4063 }],
  ['ymca north york', { lat: 43.7615, lng: -79.4108 }],
  ['ymca scarborough', { lat: 43.7321, lng: -79.2638 }],
  ['ymca cooper koo', { lat: 43.7764, lng: -79.2578 }],
  
  // Sports Complexes
  ['mattamy athletic centre', { lat: 43.6577, lng: -79.3788 }],
  ['varsity centre', { lat: 43.6677, lng: -79.3969 }],
  ['goldring centre', { lat: 43.6604, lng: -79.3957 }],
  ['birchmount stadium', { lat: 43.7321, lng: -79.2638 }],
  ['etobicoke olympium', { lat: 43.7131, lng: -79.5300 }],
  ['scarborough village recreation', { lat: 43.7408, lng: -79.2083 }],
  ['malvern recreation centre', { lat: 43.8067, lng: -79.2178 }],
  ['centennial recreation centre', { lat: 43.7854, lng: -79.2264 }],
  ['pan am sports centre', { lat: 43.7911, lng: -79.1942 }],
  
  // Ice Rinks / Arenas
  ['ted reeve arena', { lat: 43.6897, lng: -79.3099 }],
  ['moss park arena', { lat: 43.6554, lng: -79.3677 }],
  ['bill bolton arena', { lat: 43.6478, lng: -79.4089 }],
  ['mccormick arena', { lat: 43.6383, lng: -79.4319 }],
  ['dufferin grove rink', { lat: 43.6558, lng: -79.4319 }],
  ['christie pits outdoor rink', { lat: 43.6647, lng: -79.4204 }],
  ['harbourfront natrel rink', { lat: 43.6389, lng: -79.3817 }],
  ['nathan phillips rink', { lat: 43.6527, lng: -79.3839 }],
  ['greenwood ice rink', { lat: 43.6673, lng: -79.3211 }],
  ['rennie park', { lat: 43.6700, lng: -79.4637 }],
]);

// Places of Worship (Major ones that serve as landmarks)
export const WORSHIP: Map<string, Coordinates> = new Map([
  // Churches
  ['st james cathedral', { lat: 43.6507, lng: -79.3731 }],
  ['st michaels cathedral', { lat: 43.6531, lng: -79.3778 }],
  ['metropolitan united church', { lat: 43.6540, lng: -79.3831 }],
  ['holy trinity church', { lat: 43.6544, lng: -79.3807 }],
  ['st andrews presbyterian', { lat: 43.6477, lng: -79.3850 }],
  ['st patricks church', { lat: 43.6513, lng: -79.3870 }],
  ['our lady of lourdes', { lat: 43.6653, lng: -79.3871 }],
  ['knox presbyterian', { lat: 43.6489, lng: -79.3987 }],
  ['little trinity church', { lat: 43.6503, lng: -79.3606 }],
  ['church of the redeemer', { lat: 43.6707, lng: -79.3868 }],
  
  // Synagogues
  ['holy blossom temple', { lat: 43.6875, lng: -79.4113 }],
  ['anshei minsk', { lat: 43.6542, lng: -79.4003 }],
  ['beth tzedec', { lat: 43.6840, lng: -79.4113 }],
  
  // Mosques
  ['jami mosque', { lat: 43.6519, lng: -79.3987 }],
  ['islamic foundation', { lat: 43.7854, lng: -79.2578 }],
  ['masjid toronto', { lat: 43.6519, lng: -79.3831 }],
  
  // Temples
  ['hindu temple', { lat: 43.7321, lng: -79.2883 }],
  ['buddhist temple', { lat: 43.7615, lng: -79.3211 }],
]);

// Government Buildings
export const GOVERNMENT: Map<string, Coordinates> = new Map([
  ['city hall', { lat: 43.6534, lng: -79.3841 }],
  ['toronto city hall', { lat: 43.6534, lng: -79.3841 }],
  ['old city hall', { lat: 43.6519, lng: -79.3823 }],
  ['queens park', { lat: 43.6640, lng: -79.3922 }],
  ['ontario legislature', { lat: 43.6625, lng: -79.3924 }],
  ['metro hall', { lat: 43.6460, lng: -79.3869 }],
  ['north york civic centre', { lat: 43.7674, lng: -79.4145 }],
  ['scarborough civic centre', { lat: 43.7736, lng: -79.2578 }],
  ['etobicoke civic centre', { lat: 43.6511, lng: -79.5362 }],
  ['york civic centre', { lat: 43.6897, lng: -79.4744 }],
  ['east york civic centre', { lat: 43.6905, lng: -79.3277 }],
  
  // Courts
  ['ontario court of justice', { lat: 43.6534, lng: -79.3841 }],
  ['superior court', { lat: 43.6519, lng: -79.3792 }],
  ['family court', { lat: 43.6555, lng: -79.3834 }],
  ['small claims court', { lat: 43.6513, lng: -79.3823 }],
]);

// Entertainment Venues
export const ENTERTAINMENT: Map<string, Coordinates> = new Map([
  // Major Venues
  ['scotiabank arena', { lat: 43.6435, lng: -79.3791 }],
  ['rogers centre', { lat: 43.6414, lng: -79.3894 }],
  ['bmo field', { lat: 43.6334, lng: -79.4186 }],
  ['budweiser stage', { lat: 43.6283, lng: -79.4153 }],
  ['echo beach', { lat: 43.6283, lng: -79.4133 }],
  
  // Theaters
  ['princess of wales theatre', { lat: 43.6477, lng: -79.3894 }],
  ['royal alexandra theatre', { lat: 43.6467, lng: -79.3883 }],
  ['ed mirvish theatre', { lat: 43.6525, lng: -79.3802 }],
  ['elgin winter garden', { lat: 43.6525, lng: -79.3792 }],
  ['massey hall', { lat: 43.6540, lng: -79.3792 }],
  ['roy thomson hall', { lat: 43.6467, lng: -79.3850 }],
  ['four seasons centre', { lat: 43.6507, lng: -79.3860 }],
  ['meridian hall', { lat: 43.6456, lng: -79.3774 }],
  ['theatre passe muraille', { lat: 43.6477, lng: -79.4063 }],
  ['tarragon theatre', { lat: 43.6542, lng: -79.4113 }],
  ['factory theatre', { lat: 43.6465, lng: -79.4063 }],
  ['buddies in bad times', { lat: 43.6615, lng: -79.3677 }],
  
  // Music Venues
  ['phoenix concert theatre', { lat: 43.6632, lng: -79.3711 }],
  ['opera house', { lat: 43.6594, lng: -79.3527 }],
  ['danforth music hall', { lat: 43.6769, lng: -79.3585 }],
  ['rex hotel', { lat: 43.6489, lng: -79.3831 }],
  ['cameron house', { lat: 43.6483, lng: -79.3970 }],
  ['lee\'s palace', { lat: 43.6645, lng: -79.4113 }],
  ['mod club', { lat: 43.6583, lng: -79.4263 }],
  ['drake hotel', { lat: 43.6432, lng: -79.4242 }],
  ['gladstone hotel', { lat: 43.6424, lng: -79.4263 }],
]);

// Combine all extended locations
export function getAllExtendedLocations(): Map<string, Coordinates> {
  return new Map([
    ...EDUCATION,
    ...PARKS,
    ...SHOPPING,
    ...LIBRARIES,
    ...REC_CENTERS,
    ...WORSHIP,
    ...GOVERNMENT,
    ...ENTERTAINMENT
  ]);
}

// Count of extended locations
export const EXTENDED_LOCATIONS_COUNT = 
  EDUCATION.size + 
  PARKS.size + 
  SHOPPING.size + 
  LIBRARIES.size + 
  REC_CENTERS.size +
  WORSHIP.size +
  GOVERNMENT.size +
  ENTERTAINMENT.size;

console.log(`Extended cache adds ${EXTENDED_LOCATIONS_COUNT} more Toronto locations`);
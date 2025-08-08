// Comprehensive Toronto Locations Cache
// Covers major intersections, TTC stations, hospitals, shelters, and landmarks

export interface Coordinates {
  lat: number;
  lng: number;
}

// Major Downtown Intersections
export const MAJOR_INTERSECTIONS: Map<string, Coordinates> = new Map([
  // Downtown Core
  ['yonge and dundas', { lat: 43.6561, lng: -79.3802 }],
  ['yonge & dundas', { lat: 43.6561, lng: -79.3802 }],
  ['yonge and queen', { lat: 43.6525, lng: -79.3792 }],
  ['yonge & queen', { lat: 43.6525, lng: -79.3792 }],
  ['yonge and king', { lat: 43.6489, lng: -79.3783 }],
  ['yonge & king', { lat: 43.6489, lng: -79.3783 }],
  ['yonge and bloor', { lat: 43.6707, lng: -79.3868 }],
  ['yonge & bloor', { lat: 43.6707, lng: -79.3868 }],
  ['yonge and college', { lat: 43.6613, lng: -79.3831 }],
  ['yonge & college', { lat: 43.6613, lng: -79.3831 }],
  ['yonge and wellesley', { lat: 43.6653, lng: -79.3837 }],
  ['yonge & wellesley', { lat: 43.6653, lng: -79.3837 }],
  ['yonge and front', { lat: 43.6456, lng: -79.3774 }],
  ['yonge & front', { lat: 43.6456, lng: -79.3774 }],
  
  // Bay Street Corridor
  ['bay and bloor', { lat: 43.6701, lng: -79.3900 }],
  ['bay & bloor', { lat: 43.6701, lng: -79.3900 }],
  ['bay and college', { lat: 43.6607, lng: -79.3856 }],
  ['bay & college', { lat: 43.6607, lng: -79.3856 }],
  ['bay and dundas', { lat: 43.6555, lng: -79.3834 }],
  ['bay & dundas', { lat: 43.6555, lng: -79.3834 }],
  ['bay and queen', { lat: 43.6519, lng: -79.3823 }],
  ['bay & queen', { lat: 43.6519, lng: -79.3823 }],
  ['bay and king', { lat: 43.6483, lng: -79.3813 }],
  ['bay & king', { lat: 43.6483, lng: -79.3813 }],
  ['bay and adelaide', { lat: 43.6505, lng: -79.3818 }],
  ['bay & adelaide', { lat: 43.6505, lng: -79.3818 }],
  
  // University Avenue
  ['university and dundas', { lat: 43.6549, lng: -79.3871 }],
  ['university & dundas', { lat: 43.6549, lng: -79.3871 }],
  ['university and queen', { lat: 43.6513, lng: -79.3860 }],
  ['university & queen', { lat: 43.6513, lng: -79.3860 }],
  ['university and king', { lat: 43.6477, lng: -79.3850 }],
  ['university & king', { lat: 43.6477, lng: -79.3850 }],
  ['university and college', { lat: 43.6601, lng: -79.3893 }],
  ['university & college', { lat: 43.6601, lng: -79.3893 }],
  
  // Spadina Avenue
  ['spadina and bloor', { lat: 43.6659, lng: -79.4036 }],
  ['spadina & bloor', { lat: 43.6659, lng: -79.4036 }],
  ['spadina and college', { lat: 43.6583, lng: -79.4023 }],
  ['spadina & college', { lat: 43.6583, lng: -79.4023 }],
  ['spadina and dundas', { lat: 43.6519, lng: -79.3987 }],
  ['spadina & dundas', { lat: 43.6519, lng: -79.3987 }],
  ['spadina and queen', { lat: 43.6483, lng: -79.3970 }],
  ['spadina & queen', { lat: 43.6483, lng: -79.3970 }],
  ['spadina and king', { lat: 43.6446, lng: -79.3948 }],
  ['spadina & king', { lat: 43.6446, lng: -79.3948 }],
  ['spadina and front', { lat: 43.6414, lng: -79.3929 }],
  ['spadina & front', { lat: 43.6414, lng: -79.3929 }],
  
  // Bathurst Street
  ['bathurst and bloor', { lat: 43.6645, lng: -79.4113 }],
  ['bathurst & bloor', { lat: 43.6645, lng: -79.4113 }],
  ['bathurst and college', { lat: 43.6555, lng: -79.4113 }],
  ['bathurst & college', { lat: 43.6555, lng: -79.4113 }],
  ['bathurst and dundas', { lat: 43.6513, lng: -79.4082 }],
  ['bathurst & dundas', { lat: 43.6513, lng: -79.4082 }],
  ['bathurst and queen', { lat: 43.6477, lng: -79.4025 }],
  ['bathurst & queen', { lat: 43.6477, lng: -79.4025 }],
  ['bathurst and king', { lat: 43.6432, lng: -79.4025 }],
  ['bathurst & king', { lat: 43.6432, lng: -79.4025 }],
  ['bathurst and front', { lat: 43.6400, lng: -79.4006 }],
  ['bathurst & front', { lat: 43.6400, lng: -79.4006 }],
  
  // Queen Street West
  ['queen and ossington', { lat: 43.6439, lng: -79.4210 }],
  ['queen & ossington', { lat: 43.6439, lng: -79.4210 }],
  ['queen and dovercourt', { lat: 43.6424, lng: -79.4263 }],
  ['queen & dovercourt', { lat: 43.6424, lng: -79.4263 }],
  ['queen and dufferin', { lat: 43.6408, lng: -79.4319 }],
  ['queen & dufferin', { lat: 43.6408, lng: -79.4319 }],
  ['queen and lansdowne', { lat: 43.6392, lng: -79.4392 }],
  ['queen & lansdowne', { lat: 43.6392, lng: -79.4392 }],
  ['queen and roncesvalles', { lat: 43.6383, lng: -79.4467 }],
  ['queen & roncesvalles', { lat: 43.6383, lng: -79.4467 }],
  
  // King Street West
  ['king and bathurst', { lat: 43.6432, lng: -79.4025 }],
  ['king & bathurst', { lat: 43.6432, lng: -79.4025 }],
  ['king and portland', { lat: 43.6440, lng: -79.3985 }],
  ['king & portland', { lat: 43.6440, lng: -79.3985 }],
  ['king and strachan', { lat: 43.6406, lng: -79.4103 }],
  ['king & strachan', { lat: 43.6406, lng: -79.4103 }],
  ['king and dufferin', { lat: 43.6369, lng: -79.4261 }],
  ['king & dufferin', { lat: 43.6369, lng: -79.4261 }],
  
  // Bloor Street West
  ['bloor and ossington', { lat: 43.6620, lng: -79.4263 }],
  ['bloor & ossington', { lat: 43.6620, lng: -79.4263 }],
  ['bloor and dovercourt', { lat: 43.6615, lng: -79.4316 }],
  ['bloor & dovercourt', { lat: 43.6615, lng: -79.4316 }],
  ['bloor and dufferin', { lat: 43.6605, lng: -79.4371 }],
  ['bloor & dufferin', { lat: 43.6605, lng: -79.4371 }],
  ['bloor and lansdowne', { lat: 43.6592, lng: -79.4443 }],
  ['bloor & lansdowne', { lat: 43.6592, lng: -79.4443 }],
  ['bloor and christie', { lat: 43.6640, lng: -79.4188 }],
  ['bloor & christie', { lat: 43.6640, lng: -79.4188 }],
  
  // Dundas Street West
  ['dundas and ossington', { lat: 43.6474, lng: -79.4210 }],
  ['dundas & ossington', { lat: 43.6474, lng: -79.4210 }],
  ['dundas and dovercourt', { lat: 43.6459, lng: -79.4263 }],
  ['dundas & dovercourt', { lat: 43.6459, lng: -79.4263 }],
  ['dundas and dufferin', { lat: 43.6444, lng: -79.4319 }],
  ['dundas & dufferin', { lat: 43.6444, lng: -79.4319 }],
  ['dundas and lansdowne', { lat: 43.6428, lng: -79.4392 }],
  ['dundas & lansdowne', { lat: 43.6428, lng: -79.4392 }],
  
  // College Street
  ['college and ossington', { lat: 43.6543, lng: -79.4210 }],
  ['college & ossington', { lat: 43.6543, lng: -79.4210 }],
  ['college and dovercourt', { lat: 43.6528, lng: -79.4263 }],
  ['college & dovercourt', { lat: 43.6528, lng: -79.4263 }],
  ['college and dufferin', { lat: 43.6513, lng: -79.4319 }],
  ['college & dufferin', { lat: 43.6513, lng: -79.4319 }],
  ['college and lansdowne', { lat: 43.6497, lng: -79.4392 }],
  ['college & lansdowne', { lat: 43.6497, lng: -79.4392 }],
  
  // East Toronto
  ['queen and broadview', { lat: 43.6594, lng: -79.3527 }],
  ['queen & broadview', { lat: 43.6594, lng: -79.3527 }],
  ['queen and carlaw', { lat: 43.6608, lng: -79.3438 }],
  ['queen & carlaw', { lat: 43.6608, lng: -79.3438 }],
  ['queen and pape', { lat: 43.6626, lng: -79.3334 }],
  ['queen & pape', { lat: 43.6626, lng: -79.3334 }],
  ['queen and jones', { lat: 43.6642, lng: -79.3232 }],
  ['queen & jones', { lat: 43.6642, lng: -79.3232 }],
  ['queen and greenwood', { lat: 43.6653, lng: -79.3155 }],
  ['queen & greenwood', { lat: 43.6653, lng: -79.3155 }],
  ['queen and coxwell', { lat: 43.6665, lng: -79.3081 }],
  ['queen & coxwell', { lat: 43.6665, lng: -79.3081 }],
  ['queen and woodbine', { lat: 43.6683, lng: -79.2970 }],
  ['queen & woodbine', { lat: 43.6683, lng: -79.2970 }],
  
  // Danforth (Greektown)
  ['danforth and broadview', { lat: 43.6769, lng: -79.3585 }],
  ['danforth & broadview', { lat: 43.6769, lng: -79.3585 }],
  ['danforth and chester', { lat: 43.6781, lng: -79.3523 }],
  ['danforth & chester', { lat: 43.6781, lng: -79.3523 }],
  ['danforth and pape', { lat: 43.6784, lng: -79.3457 }],
  ['danforth & pape', { lat: 43.6784, lng: -79.3457 }],
  ['danforth and jones', { lat: 43.6802, lng: -79.3351 }],
  ['danforth & jones', { lat: 43.6802, lng: -79.3351 }],
  ['danforth and greenwood', { lat: 43.6813, lng: -79.3277 }],
  ['danforth & greenwood', { lat: 43.6813, lng: -79.3277 }],
  ['danforth and coxwell', { lat: 43.6825, lng: -79.3203 }],
  ['danforth & coxwell', { lat: 43.6825, lng: -79.3203 }],
  ['danforth and woodbine', { lat: 43.6843, lng: -79.3091 }],
  ['danforth & woodbine', { lat: 43.6843, lng: -79.3091 }],
  
  // North Toronto / Midtown
  ['yonge and eglinton', { lat: 43.7077, lng: -79.3983 }],
  ['yonge & eglinton', { lat: 43.7077, lng: -79.3983 }],
  ['yonge and davisville', { lat: 43.6983, lng: -79.3969 }],
  ['yonge & davisville', { lat: 43.6983, lng: -79.3969 }],
  ['yonge and st clair', { lat: 43.6878, lng: -79.3934 }],
  ['yonge & st clair', { lat: 43.6878, lng: -79.3934 }],
  ['yonge and rosedale', { lat: 43.6787, lng: -79.3894 }],
  ['yonge & rosedale', { lat: 43.6787, lng: -79.3894 }],
  ['yonge and lawrence', { lat: 43.7252, lng: -79.4022 }],
  ['yonge & lawrence', { lat: 43.7252, lng: -79.4022 }],
  ['yonge and york mills', { lat: 43.7448, lng: -79.4065 }],
  ['yonge & york mills', { lat: 43.7448, lng: -79.4065 }],
  ['yonge and sheppard', { lat: 43.7615, lng: -79.4108 }],
  ['yonge & sheppard', { lat: 43.7615, lng: -79.4108 }],
  ['yonge and finch', { lat: 43.7805, lng: -79.4152 }],
  ['yonge & finch', { lat: 43.7805, lng: -79.4152 }],
  
  // West End
  ['bloor and jane', { lat: 43.6586, lng: -79.4839 }],
  ['bloor & jane', { lat: 43.6586, lng: -79.4839 }],
  ['bloor and runnymede', { lat: 43.6597, lng: -79.4766 }],
  ['bloor & runnymede', { lat: 43.6597, lng: -79.4766 }],
  ['bloor and high park', { lat: 43.6541, lng: -79.4665 }],
  ['bloor & high park', { lat: 43.6541, lng: -79.4665 }],
  ['bloor and keele', { lat: 43.6542, lng: -79.4599 }],
  ['bloor & keele', { lat: 43.6542, lng: -79.4599 }],
  ['bloor and dundas west', { lat: 43.6568, lng: -79.4529 }],
  ['bloor & dundas west', { lat: 43.6568, lng: -79.4529 }],
  
  // Scarborough
  ['kennedy and eglinton', { lat: 43.7321, lng: -79.2638 }],
  ['kennedy & eglinton', { lat: 43.7321, lng: -79.2638 }],
  ['kennedy and lawrence', { lat: 43.7508, lng: -79.2682 }],
  ['kennedy & lawrence', { lat: 43.7508, lng: -79.2682 }],
  ['kennedy and ellesmere', { lat: 43.7697, lng: -79.2726 }],
  ['kennedy & ellesmere', { lat: 43.7697, lng: -79.2726 }],
  ['kennedy and sheppard', { lat: 43.7777, lng: -79.2748 }],
  ['kennedy & sheppard', { lat: 43.7777, lng: -79.2748 }],
  
  // Etobicoke
  ['kipling and bloor', { lat: 43.6373, lng: -79.5362 }],
  ['kipling & bloor', { lat: 43.6373, lng: -79.5362 }],
  ['islington and bloor', { lat: 43.6453, lng: -79.5244 }],
  ['islington & bloor', { lat: 43.6453, lng: -79.5244 }],
  ['royal york and bloor', { lat: 43.6507, lng: -79.5125 }],
  ['royal york & bloor', { lat: 43.6507, lng: -79.5125 }],
  
  // North York
  ['jane and finch', { lat: 43.7615, lng: -79.5225 }],
  ['jane & finch', { lat: 43.7615, lng: -79.5225 }],
  ['keele and finch', { lat: 43.7707, lng: -79.4911 }],
  ['keele & finch', { lat: 43.7707, lng: -79.4911 }],
  ['dufferin and finch', { lat: 43.7762, lng: -79.4582 }],
  ['dufferin & finch', { lat: 43.7762, lng: -79.4582 }],
  ['bathurst and finch', { lat: 43.7834, lng: -79.4367 }],
  ['bathurst & finch', { lat: 43.7834, lng: -79.4367 }],
]);

// TTC Subway Stations
export const TTC_STATIONS: Map<string, Coordinates> = new Map([
  // Line 1 (Yonge-University)
  ['union station', { lat: 43.6453, lng: -79.3806 }],
  ['king station', { lat: 43.6489, lng: -79.3783 }],
  ['queen station', { lat: 43.6525, lng: -79.3792 }],
  ['dundas station', { lat: 43.6561, lng: -79.3802 }],
  ['college station', { lat: 43.6613, lng: -79.3831 }],
  ['wellesley station', { lat: 43.6653, lng: -79.3837 }],
  ['bloor-yonge station', { lat: 43.6707, lng: -79.3868 }],
  ['rosedale station', { lat: 43.6787, lng: -79.3894 }],
  ['summerhill station', { lat: 43.6824, lng: -79.3907 }],
  ['st clair station', { lat: 43.6878, lng: -79.3934 }],
  ['davisville station', { lat: 43.6983, lng: -79.3969 }],
  ['eglinton station', { lat: 43.7077, lng: -79.3983 }],
  ['lawrence station', { lat: 43.7252, lng: -79.4022 }],
  ['york mills station', { lat: 43.7448, lng: -79.4065 }],
  ['sheppard-yonge station', { lat: 43.7615, lng: -79.4108 }],
  ['north york centre station', { lat: 43.7688, lng: -79.4128 }],
  ['finch station', { lat: 43.7805, lng: -79.4152 }],
  
  // Line 2 (Bloor-Danforth)
  ['kipling station', { lat: 43.6373, lng: -79.5362 }],
  ['islington station', { lat: 43.6453, lng: -79.5244 }],
  ['royal york station', { lat: 43.6507, lng: -79.5125 }],
  ['old mill station', { lat: 43.6500, lng: -79.4948 }],
  ['jane station', { lat: 43.6500, lng: -79.4839 }],
  ['runnymede station', { lat: 43.6516, lng: -79.4766 }],
  ['high park station', { lat: 43.6541, lng: -79.4665 }],
  ['keele station', { lat: 43.6556, lng: -79.4599 }],
  ['dundas west station', { lat: 43.6568, lng: -79.4529 }],
  ['lansdowne station', { lat: 43.6592, lng: -79.4443 }],
  ['dufferin station', { lat: 43.6605, lng: -79.4371 }],
  ['ossington station', { lat: 43.6620, lng: -79.4263 }],
  ['christie station', { lat: 43.6640, lng: -79.4188 }],
  ['bathurst station', { lat: 43.6645, lng: -79.4113 }],
  ['spadina station', { lat: 43.6674, lng: -79.4036 }],
  ['st george station', { lat: 43.6681, lng: -79.3997 }],
  ['bay station', { lat: 43.6701, lng: -79.3900 }],
  ['sherbourne station', { lat: 43.6722, lng: -79.3767 }],
  ['castle frank station', { lat: 43.6739, lng: -79.3687 }],
  ['broadview station', { lat: 43.6769, lng: -79.3585 }],
  ['chester station', { lat: 43.6781, lng: -79.3523 }],
  ['pape station', { lat: 43.6784, lng: -79.3457 }],
  ['donlands station', { lat: 43.6791, lng: -79.3385 }],
  ['greenwood station', { lat: 43.6813, lng: -79.3277 }],
  ['coxwell station', { lat: 43.6825, lng: -79.3203 }],
  ['woodbine station', { lat: 43.6843, lng: -79.3091 }],
  ['main street station', { lat: 43.6890, lng: -79.3018 }],
  ['victoria park station', { lat: 43.6951, lng: -79.2885 }],
  ['warden station', { lat: 43.7114, lng: -79.2795 }],
  ['kennedy station', { lat: 43.7321, lng: -79.2638 }],
]);

// Major Hospitals
export const HOSPITALS: Map<string, Coordinates> = new Map([
  ['toronto general hospital', { lat: 43.6595, lng: -79.3876 }],
  ['mount sinai hospital', { lat: 43.6577, lng: -79.3900 }],
  ['sick kids hospital', { lat: 43.6577, lng: -79.3876 }],
  ['womens college hospital', { lat: 43.6618, lng: -79.3900 }],
  ['st michaels hospital', { lat: 43.6531, lng: -79.3765 }],
  ['toronto western hospital', { lat: 43.6531, lng: -79.4056 }],
  ['sunnybrook hospital', { lat: 43.7227, lng: -79.3753 }],
  ['north york general', { lat: 43.7688, lng: -79.3628 }],
  ['scarborough general', { lat: 43.7531, lng: -79.2247 }],
  ['humber river hospital', { lat: 43.7061, lng: -79.4948 }],
  ['camh queen street', { lat: 43.6436, lng: -79.4256 }],
  ['camh college street', { lat: 43.6583, lng: -79.4137 }],
]);

// Shelters and Community Centers
export const SHELTERS_CENTERS: Map<string, Coordinates> = new Map([
  // Major Shelters
  ['seaton house', { lat: 43.6620, lng: -79.3713 }],
  ['fred victor centre', { lat: 43.6546, lng: -79.3740 }],
  ['covenant house', { lat: 43.6640, lng: -79.3837 }],
  ['good shepherd centre', { lat: 43.6520, lng: -79.3765 }],
  ['na-me-res', { lat: 43.6632, lng: -79.3694 }],
  ['dixon hall', { lat: 43.6565, lng: -79.3619 }],
  ['margaret\'s housing', { lat: 43.6554, lng: -79.4089 }],
  ['ywca elm centre', { lat: 43.6586, lng: -79.3819 }],
  
  // Drop-ins
  ['the scott mission', { lat: 43.6533, lng: -79.4010 }],
  ['st felix centre', { lat: 43.6465, lng: -79.4100 }],
  ['all saints church', { lat: 43.6565, lng: -79.3711 }],
  ['sanctuary', { lat: 43.6504, lng: -79.3740 }],
  
  // Community Centers
  ['regent park community centre', { lat: 43.6606, lng: -79.3631 }],
  ['scadding court', { lat: 43.6425, lng: -79.4025 }],
  ['harbourfront centre', { lat: 43.6389, lng: -79.3817 }],
  ['519 church street', { lat: 43.6618, lng: -79.3815 }],
  ['native child and family', { lat: 43.6583, lng: -79.3950 }],
  ['parkdale community centre', { lat: 43.6383, lng: -79.4367 }],
]);

// Landmarks and Key Locations
export const LANDMARKS: Map<string, Coordinates> = new Map([
  ['cn tower', { lat: 43.6426, lng: -79.3871 }],
  ['rogers centre', { lat: 43.6414, lng: -79.3894 }],
  ['scotiabank arena', { lat: 43.6435, lng: -79.3791 }],
  ['nathan phillips square', { lat: 43.6527, lng: -79.3839 }],
  ['city hall', { lat: 43.6534, lng: -79.3841 }],
  ['eaton centre', { lat: 43.6544, lng: -79.3807 }],
  ['university of toronto', { lat: 43.6629, lng: -79.3957 }],
  ['ryerson university', { lat: 43.6577, lng: -79.3788 }],
  ['toronto metropolitan university', { lat: 43.6577, lng: -79.3788 }],
  ['tmu', { lat: 43.6577, lng: -79.3788 }],
  ['ocad', { lat: 43.6530, lng: -79.3912 }],
  ['george brown college', { lat: 43.6513, lng: -79.3700 }],
  ['kensington market', { lat: 43.6542, lng: -79.4003 }],
  ['chinatown', { lat: 43.6533, lng: -79.3987 }],
  ['little italy', { lat: 43.6545, lng: -79.4140 }],
  ['greektown', { lat: 43.6784, lng: -79.3457 }],
  ['distillery district', { lat: 43.6503, lng: -79.3596 }],
  ['st lawrence market', { lat: 43.6487, lng: -79.3715 }],
  ['toronto public library', { lat: 43.6717, lng: -79.3868 }],
  ['reference library', { lat: 43.6717, lng: -79.3868 }],
  ['queens park', { lat: 43.6640, lng: -79.3922 }],
  ['ontario legislature', { lat: 43.6625, lng: -79.3924 }],
  ['rom', { lat: 43.6677, lng: -79.3948 }],
  ['royal ontario museum', { lat: 43.6677, lng: -79.3948 }],
  ['ago', { lat: 43.6536, lng: -79.3925 }],
  ['art gallery of ontario', { lat: 43.6536, lng: -79.3925 }],
  ['casa loma', { lat: 43.6780, lng: -79.4094 }],
  ['exhibition place', { lat: 43.6334, lng: -79.4197 }],
  ['cne', { lat: 43.6334, lng: -79.4197 }],
  ['bmo field', { lat: 43.6334, lng: -79.4186 }],
  ['ontario place', { lat: 43.6283, lng: -79.4153 }],
  ['toronto island ferry', { lat: 43.6407, lng: -79.3767 }],
  ['harbourfront', { lat: 43.6389, lng: -79.3817 }],
  ['sugar beach', { lat: 43.6444, lng: -79.3621 }],
  ['cherry beach', { lat: 43.6367, lng: -79.3444 }],
  ['beaches', { lat: 43.6683, lng: -79.2970 }],
  ['high park', { lat: 43.6465, lng: -79.4637 }],
  ['trinity bellwoods', { lat: 43.6465, lng: -79.4137 }],
  ['allan gardens', { lat: 43.6615, lng: -79.3747 }],
  ['moss park', { lat: 43.6554, lng: -79.3677 }],
]);

// Import extended locations
import { getAllExtendedLocations, EXTENDED_LOCATIONS_COUNT } from './toronto-locations-extended';

// Combine all maps for complete coverage
export function getAllLocations(): Map<string, Coordinates> {
  const baseLocations = new Map([
    ...MAJOR_INTERSECTIONS,
    ...TTC_STATIONS,
    ...HOSPITALS,
    ...SHELTERS_CENTERS,
    ...LANDMARKS
  ]);
  
  const extendedLocations = getAllExtendedLocations();
  
  // Merge all locations
  return new Map([
    ...baseLocations,
    ...extendedLocations
  ]);
}

// Export the total count
export const BASE_LOCATIONS_COUNT = 
  MAJOR_INTERSECTIONS.size + 
  TTC_STATIONS.size + 
  HOSPITALS.size + 
  SHELTERS_CENTERS.size + 
  LANDMARKS.size;

export const TOTAL_CACHED_LOCATIONS = BASE_LOCATIONS_COUNT + EXTENDED_LOCATIONS_COUNT;

console.log(`Base locations: ${BASE_LOCATIONS_COUNT}`);
console.log(`Extended locations: ${EXTENDED_LOCATIONS_COUNT}`);
console.log(`Total cached locations: ${TOTAL_CACHED_LOCATIONS}`);
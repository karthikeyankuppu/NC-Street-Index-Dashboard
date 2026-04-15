// NayiChaal Street Index — Varanasi Street Assessment Data
// Parsed from KML geographic data + XLSX index scores

export interface SegmentScore {
  code: string;
  walkability: number;
  lighting: number;
  transport: number;
  visibility: number;
  accessibility: number;
  roadSafety: number;
  index: number;
}

export interface SegmentGeo {
  name: string;
  coordinates: [number, number][]; // [lng, lat]
}

export type CategoryKey = 'index' | 'walkability' | 'lighting' | 'transport' | 'visibility' | 'accessibility' | 'roadSafety';

export const CATEGORIES: { key: CategoryKey; label: string; description: string }[] = [
  { key: 'index', label: 'Overall Index', description: 'Composite NayiChaal Street Index (0–100)' },
  { key: 'walkability', label: 'Walkability', description: 'Quality of pedestrian paths' },
  { key: 'lighting', label: 'Lighting', description: 'Amount of illumination' },
  { key: 'transport', label: 'Transport Access', description: '5 min walk from public transport' },
  { key: 'visibility', label: 'Visibility', description: 'Eyes on the street' },
  { key: 'accessibility', label: 'Universal Access', description: 'Differently abled person accessibility' },
  { key: 'roadSafety', label: 'Road Safety', description: 'Vehicular safety on the road' },
];

// Normalize segment codes for matching
function normalize(code: string): string {
  return code.replace(/[-\s]/g, '').replace(/^(PR|SR|TR)0*/, '$1').toUpperCase();
}

export const scores: SegmentScore[] = [
  { code: 'SR-02', walkability: 28.8, lighting: 62.5, transport: 0, visibility: 50, accessibility: 25, roadSafety: 25, index: 31.9 },
  { code: 'SR-08', walkability: 50, lighting: 87.5, transport: 0, visibility: 25, accessibility: 75, roadSafety: 65, index: 50.4 },
  { code: 'SR-06', walkability: 51.9, lighting: 87.5, transport: 50, visibility: 50, accessibility: 75, roadSafety: 65, index: 63.2 },
  { code: 'SR-07', walkability: 50, lighting: 75, transport: 0, visibility: 62.5, accessibility: 25, roadSafety: 25, index: 39.6 },
  { code: 'TR-25', walkability: 16.7, lighting: 50, transport: 50, visibility: 0, accessibility: 25, roadSafety: 10, index: 25.3 },
  { code: 'PR-09', walkability: 42.3, lighting: 100, transport: 25, visibility: 62.5, accessibility: 50, roadSafety: 33.3, index: 52.2 },
  { code: 'PR-08', walkability: 44.2, lighting: 100, transport: 25, visibility: 87.5, accessibility: 75, roadSafety: 41.7, index: 62.2 },
  { code: 'PR-06', walkability: 51.9, lighting: 75, transport: 0, visibility: 50, accessibility: 50, roadSafety: 25, index: 42 },
  { code: 'TR-56', walkability: 36.5, lighting: 50, transport: 75, visibility: 87.5, accessibility: 50, roadSafety: 25, index: 54 },
  { code: 'SR-04', walkability: 42.3, lighting: 50, transport: 0, visibility: 87.5, accessibility: 25, roadSafety: 16.7, index: 36.9 },
  { code: 'PR-07', walkability: 52.1, lighting: 100, transport: 75, visibility: 100, accessibility: 41.7, roadSafety: 33.3, index: 67 },
  { code: 'TR-57', walkability: 32.7, lighting: 37.5, transport: 0, visibility: 25, accessibility: 75, roadSafety: 8.3, index: 29.8 },
  { code: 'PR-05', walkability: 53.6, lighting: 100, transport: 75, visibility: 87.5, accessibility: 100, roadSafety: 55, index: 78.5 },
  { code: 'SR-05', walkability: 36.5, lighting: 50, transport: 0, visibility: 87.5, accessibility: 50, roadSafety: 20.8, index: 40.8 },
  { code: 'TR-53', walkability: 23.2, lighting: 75, transport: 0, visibility: 12.5, accessibility: 50, roadSafety: 5, index: 27.6 },
  { code: 'SR-01', walkability: 33.9, lighting: 87.5, transport: 25, visibility: 37.5, accessibility: 50, roadSafety: 20.8, index: 42.4 },
  { code: 'TR-52', walkability: 23.1, lighting: 25, transport: 0, visibility: 75, accessibility: 50, roadSafety: 20.8, index: 32.3 },
  { code: 'TR-41', walkability: 26.9, lighting: 25, transport: 75, visibility: 75, accessibility: 50, roadSafety: 25, index: 46.2 },
  { code: 'PR-01', walkability: 36.5, lighting: 87.5, transport: 100, visibility: 87.5, accessibility: 50, roadSafety: 29.2, index: 65.1 },
  { code: 'PR-02', walkability: 59.6, lighting: 75, transport: 0, visibility: 62.5, accessibility: 62.5, roadSafety: 41.7, index: 50.2 },
  { code: 'TR-48', walkability: 36.5, lighting: 75, transport: 0, visibility: 25, accessibility: 75, roadSafety: 4.2, index: 35.9 },
  { code: 'TR-12', walkability: 50, lighting: 50, transport: 0, visibility: 75, accessibility: 25, roadSafety: 20.8, index: 36.8 },
  { code: 'TR-54', walkability: 30.4, lighting: 50, transport: 25, visibility: 25, accessibility: 25, roadSafety: 20, index: 29.2 },
  { code: 'TR-149', walkability: 57.7, lighting: 87.5, transport: 0, visibility: 0, accessibility: 25, roadSafety: 25, index: 32.5 },
  { code: 'TR-50', walkability: 34.6, lighting: 62.5, transport: 0, visibility: 25, accessibility: 25, roadSafety: 25, index: 28.7 },
  { code: 'TR-14', walkability: 57.7, lighting: 75, transport: 0, visibility: 0, accessibility: 0, roadSafety: 40, index: 28.8 },
  { code: 'TR-24', walkability: 21.2, lighting: 50, transport: 0, visibility: 0, accessibility: 0, roadSafety: 8.3, index: 13.2 },
  { code: 'TR-49', walkability: 32.7, lighting: 87.5, transport: 0, visibility: 25, accessibility: 25, roadSafety: 10, index: 30 },
  { code: 'SR-03', walkability: 44.2, lighting: 62.5, transport: 100, visibility: 100, accessibility: 25, roadSafety: 25, index: 59.4 },
  { code: 'PR-10', walkability: 30.8, lighting: 75, transport: 100, visibility: 87.5, accessibility: 25, roadSafety: 50, index: 61.4 },
  { code: 'PR-03', walkability: 54.2, lighting: 100, transport: 0, visibility: 100, accessibility: 62.5, roadSafety: 37.5, index: 59 },
  { code: 'PR-11', walkability: 32.7, lighting: 62.5, transport: 100, visibility: 87.5, accessibility: 50, roadSafety: 37.5, index: 61.7 },
  { code: 'PR-04', walkability: 48.2, lighting: 75, transport: 0, visibility: 100, accessibility: 75, roadSafety: 30, index: 54.7 },
  { code: 'PR-12', walkability: 34.6, lighting: 62.5, transport: 100, visibility: 87.5, accessibility: 50, roadSafety: 41.7, index: 62.7 },
  { code: 'TR-157', walkability: 26.9, lighting: 62.5, transport: 0, visibility: 12.5, accessibility: 25, roadSafety: 5, index: 22 },
  { code: 'TR-22', walkability: 52.1, lighting: 75, transport: 0, visibility: 0, accessibility: 25, roadSafety: 25, index: 29.5 },
  { code: 'TR-156', walkability: 46.2, lighting: 50, transport: 0, visibility: 75, accessibility: 37.5, roadSafety: 15, index: 37.3 },
  { code: 'TR-27', walkability: 34.6, lighting: 50, transport: 0, visibility: 62.5, accessibility: 75, roadSafety: 15, index: 39.5 },
  { code: 'TR-01', walkability: 23.1, lighting: 12.5, transport: 0, visibility: 25, accessibility: 25, roadSafety: 8.3, index: 15.6 },
  { code: 'TR-28', walkability: 32.7, lighting: 75, transport: 0, visibility: 37.5, accessibility: 25, roadSafety: 15, index: 30.9 },
];

// KML segments - each segment may have multiple polylines
export const segments: Record<string, SegmentGeo[]> = {
  'TR-56': [
    { name: 'TR-56', coordinates: [[83.0056251,25.3106637],[83.0057297,25.3109886],[83.0057646,25.3111802],[83.0058102,25.3113742]] },
    { name: 'TR-56', coordinates: [[83.0056251,25.3106637],[83.0057109,25.3106492],[83.0058182,25.3106467],[83.0059228,25.310654],[83.0060221,25.3106516],[83.0060194,25.310671]] },
  ],
  'TR-41': [
    { name: 'TR-41', coordinates: [[83.0059168,25.3102746],[83.0060053,25.3102407],[83.0060885,25.3102091],[83.0061287,25.3102116],[83.0061663,25.3103134],[83.0061904,25.3103958],[83.0062092,25.3104419],[83.0062306,25.3104783],[83.0062628,25.3105534],[83.0062923,25.3106238],[83.0063245,25.310711]] },
    { name: 'TR-41', coordinates: [[83.0061287,25.3102116],[83.0063567,25.310174],[83.0063795,25.310174],[83.0063849,25.3102237],[83.0064358,25.3104565]] },
  ],
  'TR-52': [
    { name: 'TR-52', coordinates: [[83.0070452,25.3100369],[83.0069164,25.3100878],[83.0067944,25.3101157],[83.0067153,25.3101339],[83.006604,25.3101436],[83.0065141,25.3101533],[83.0064283,25.3101605],[83.0063795,25.310174]] },
    { name: 'TR-52', coordinates: [[83.0066908,25.3101415],[83.0067324,25.3102773],[83.006778,25.3103719],[83.0069805,25.310321]] },
    { name: 'TR-52', coordinates: [[83.0067693,25.3103664],[83.0067498,25.3103804],[83.0067854,25.3104949],[83.0068719,25.3106368]] },
  ],
  'PR-10': [
    { name: 'PR-10', coordinates: [[83.0054444,25.3092807],[83.0056107,25.3098238],[83.0055731,25.3103282],[83.0055248,25.3106191]] },
  ],
  'PR-11': [
    { name: 'PR-11', coordinates: [[83.0055141,25.3106676],[83.0050206,25.3118072]] },
  ],
  'PR-12': [
    { name: 'PR-12', coordinates: [[83.0039808,25.3137115],[83.0042812,25.3132217],[83.0050206,25.3118072]] },
  ],
  'SR-04': [
    { name: 'SR-04', coordinates: [[83.0093664,25.3088164],[83.009404,25.3089862],[83.0093986,25.3092141],[83.0093665,25.3092815],[83.0093772,25.3093838],[83.0094308,25.3096748],[83.0095381,25.3100046],[83.0096239,25.3101743],[83.0096615,25.3103198]] },
  ],
  'SR-05': [
    { name: 'SR-05', coordinates: [[83.0087549,25.3109259],[83.008889,25.3108726],[83.0089534,25.3108823],[83.0091465,25.3108096],[83.0093718,25.310732],[83.0096025,25.3106592],[83.009758,25.3105962],[83.0097151,25.3104653],[83.0096615,25.3103198]] },
  ],
  'SR-07': [
    { name: 'SR-07', coordinates: [[83.00733,25.3104762],[83.0074212,25.3104374],[83.0075366,25.3103938],[83.0076143,25.3103598],[83.0078128,25.3102822],[83.0078101,25.3101998],[83.0078155,25.3100398],[83.0078262,25.3100058],[83.0079308,25.3099937],[83.008124,25.309967],[83.0082903,25.3099452]] },
  ],
  'TR-27': [
    { name: 'TR-27', coordinates: [[83.0078128,25.3102822],[83.0079053,25.3104389],[83.0079964,25.3104825],[83.0080715,25.3105455],[83.0081359,25.3106522],[83.0082164,25.3107735]] },
  ],
  'TR-28': [
    { name: 'TR-28', coordinates: [[83.0083455,25.3107548],[83.0082812,25.3105608],[83.0084904,25.3104784],[83.0083616,25.3105269],[83.0082543,25.3102165]] },
    { name: 'TR-28', coordinates: [[83.0083429,25.3106966],[83.0087076,25.3105972],[83.0087318,25.3106651]] },
    { name: 'TR-28', coordinates: [[83.0082543,25.3102165],[83.008047,25.310276]] },
  ],
  'PR-05': [
    { name: 'PR-05', coordinates: [[83.00733,25.3104762],[83.0071528,25.310099],[83.0070348,25.3097692],[83.0069382,25.3094637],[83.0068685,25.3091922]] },
  ],
  'PR-03': [
    { name: 'PR-03', coordinates: [[83.0084927,25.3090207],[83.0087451,25.3089801],[83.0090723,25.3088928],[83.0093406,25.3087522],[83.0094961,25.3086407],[83.0095712,25.3085679],[83.0096785,25.3083933],[83.0097214,25.3082672]] },
  ],
  'PR-04': [
    { name: 'PR-04', coordinates: [[83.0097214,25.3082672],[83.0097697,25.3081509],[83.0098931,25.3079375],[83.0100111,25.3077047],[83.0100648,25.3075301],[83.010156,25.3073167],[83.0102793,25.3071858],[83.0103437,25.3071082]] },
  ],
  'SR-03': [
    { name: 'SR-03', coordinates: [[83.0060543,25.3107598],[83.0061348,25.3108083],[83.0062126,25.3108543],[83.0062501,25.3108737],[83.0063869,25.3108495],[83.0065264,25.3107986],[83.0066444,25.3107501],[83.0066981,25.3107404],[83.0067839,25.3106822],[83.006918,25.3106216],[83.0071024,25.3105533],[83.0072077,25.3105052],[83.00733,25.3104762]] },
  ],
  'SR-06': [
    { name: 'SR-06', coordinates: [[83.0076413,25.3091636],[83.0076494,25.30928],[83.0076521,25.3094036],[83.0076681,25.3095612],[83.007695,25.3095782],[83.0077137,25.3096582],[83.0077272,25.3097358],[83.0077486,25.3098207],[83.0077808,25.309908],[83.0078157,25.3099904]] },
  ],
  'TR-25': [
    { name: 'TR-25', coordinates: [[83.0082555,25.3093584],[83.0080866,25.3093608],[83.0078505,25.3093851],[83.0078318,25.3094069],[83.0077942,25.3094384],[83.0077969,25.3095378],[83.0077996,25.3097052]] },
  ],
  'TR-24': [
    { name: 'TR-24', coordinates: [[83.0082442,25.3090933],[83.0082817,25.3095831],[83.0083971,25.3095904],[83.0084024,25.3096874],[83.0083944,25.3095904],[83.0082764,25.3095783],[83.0079572,25.309605],[83.0081154,25.3095904],[83.0081261,25.309748],[83.0079733,25.3097577],[83.0083112,25.3097432]] },
  ],
  'TR-53': [
    { name: 'TR-53', coordinates: [[83.0069086,25.309706],[83.0066752,25.3097254]] },
    { name: 'TR-53', coordinates: [[83.0066752,25.3097254],[83.0067315,25.3098612],[83.0067396,25.3099363],[83.0067423,25.3099848],[83.0067664,25.3100455],[83.0067825,25.3101134]] },
    { name: 'TR-53', coordinates: [[83.0066752,25.3097254],[83.0066162,25.3096745],[83.0065009,25.3097036],[83.006399,25.3097351],[83.0062863,25.3097448],[83.0061602,25.3097715]] },
    { name: 'TR-53', coordinates: [[83.0067289,25.3098927],[83.0064955,25.3099654],[83.0063078,25.3100067]] },
  ],
  'TR-54': [
    { name: 'TR-54', coordinates: [[83.0059913,25.31022],[83.0059483,25.3101521],[83.0058196,25.3099291],[83.0057713,25.3098224],[83.0058652,25.3097715]] },
    { name: 'TR-54', coordinates: [[83.0061455,25.3101982],[83.0061361,25.3101182],[83.0061227,25.3100624],[83.0061106,25.3100055],[83.0060959,25.3099436],[83.0060851,25.3098976],[83.0060757,25.3098636],[83.0061227,25.3098539],[83.0060905,25.3097533]] },
    { name: 'TR-54', coordinates: [[83.0060704,25.3098654],[83.006008,25.3098812],[83.0059953,25.3098836],[83.0059819,25.3098545],[83.0059745,25.3098484],[83.0058089,25.3099024]] },
  ],
  'PR-01': [
    { name: 'PR-01', coordinates: [[83.0054899,25.3095025],[83.0060156,25.3093473],[83.0065198,25.3092697],[83.0069597,25.3091825]] },
  ],
  'SR-02': [
    { name: 'SR-02', coordinates: [[83.0051184,25.3117735],[83.0052365,25.3117347],[83.0053545,25.3116862],[83.0054618,25.3116329],[83.0056281,25.311565],[83.0058158,25.3114486],[83.0059017,25.3113468],[83.0060411,25.3112158],[83.0061162,25.3110946],[83.0061055,25.3109685],[83.006084,25.3108327],[83.0060221,25.3106516]] },
  ],
  'TR-57': [
    { name: 'TR-57', coordinates: [[83.0061356,25.3111007],[83.0062134,25.3111274],[83.006318,25.3111444],[83.0064199,25.311142],[83.0064977,25.3111614],[83.0065165,25.3112147],[83.0065514,25.3112899],[83.0065809,25.3113432],[83.0066104,25.3114111],[83.0066479,25.311479],[83.0067177,25.3114644],[83.0067686,25.311462]] },
    { name: 'TR-57', coordinates: [[83.006424,25.3111444],[83.0064447,25.3111304],[83.0064776,25.3111214],[83.0064937,25.3111153],[83.0064964,25.311105],[83.0065219,25.3110941],[83.0065467,25.3110856],[83.0065695,25.3110783],[83.0065882,25.3110686],[83.0066043,25.311065],[83.0065996,25.3110674]] },
  ],
  'PR-08': [
    { name: 'PR-08', coordinates: [[83.0103497,25.3117557],[83.0104626,25.3118656],[83.0105538,25.3119966],[83.0106128,25.312176],[83.0107416,25.3123748],[83.0108649,25.3126027]] },
  ],
  'PR-09': [
    { name: 'PR-09', coordinates: [[83.0108649,25.3126027],[83.0109025,25.3127773],[83.010881,25.3129567],[83.0109025,25.3131168],[83.0109186,25.3132428],[83.0110044,25.3133107],[83.0111117,25.3133544],[83.0112029,25.3134611],[83.0112297,25.3135774],[83.0112565,25.3137472],[83.0112512,25.3138684],[83.0112619,25.3139799]] },
  ],
  'SR-01': [
    { name: 'SR-01', coordinates: [[83.0056107,25.3098238],[83.0056735,25.3098793],[83.0057138,25.3099303],[83.0057594,25.3100127],[83.0058237,25.3101436],[83.0058988,25.3102843],[83.0059391,25.310391],[83.0059793,25.3105171],[83.0060221,25.3106516]] },
  ],
  'TR-49': [
    { name: 'TR-49', coordinates: [[83.0068503,25.3116202],[83.0067686,25.311462],[83.0067054,25.3112614],[83.0066043,25.311065],[83.006566,25.3109558],[83.0066303,25.3109558],[83.0067537,25.3109219],[83.0069361,25.310854],[83.0070327,25.3108395],[83.007199,25.310791],[83.0072365,25.310757],[83.0071882,25.3107182],[83.0071453,25.3106406],[83.0071024,25.3105533]] },
    { name: 'TR-49', coordinates: [[83.007199,25.310791],[83.0073277,25.3107764],[83.0073814,25.3107182],[83.0073438,25.3106503],[83.0074082,25.3105776]] },
  ],
  'TR-50': [
    { name: 'TR-50', coordinates: [[83.0067836,25.3109166],[83.0068292,25.3110015],[83.0068613,25.3110572],[83.0069043,25.3111542],[83.006974,25.3112852],[83.0070223,25.311387],[83.007084,25.3115155]] },
    { name: 'TR-50', coordinates: [[83.0070223,25.311387],[83.0071001,25.3113749]] },
  ],
  'TR-48': [
    { name: 'TR-48', coordinates: [[83.0073277,25.3107764],[83.0073978,25.3109724],[83.0073924,25.3110451],[83.007269,25.3110839],[83.0071457,25.3111082]] },
    { name: 'TR-48', coordinates: [[83.0073978,25.3109724],[83.0075694,25.310953],[83.007666,25.3109336],[83.007784,25.3108851],[83.0078538,25.3108608]] },
    { name: 'TR-48', coordinates: [[83.007666,25.3109336],[83.0076177,25.3107736]] },
  ],
  'SR-08': [
    { name: 'SR-08', coordinates: [[83.0082903,25.3099452],[83.0083669,25.3099082],[83.008391,25.3098306],[83.0083883,25.3097555],[83.0083803,25.3096827],[83.0084929,25.309673],[83.0085895,25.3096803],[83.0087397,25.309673],[83.0087692,25.3096464],[83.0087719,25.3095882],[83.0087933,25.3095494],[83.008855,25.3095397],[83.0088094,25.309433],[83.0088389,25.3093724],[83.0089167,25.3093505],[83.0089811,25.3092923],[83.0091527,25.3092584],[83.0093665,25.3092815]] },
  ],
  'TR-156': [
    { name: 'TR-156', coordinates: [[83.0094134,25.3089345],[83.0096924,25.3088763],[83.0099713,25.3088035],[83.0102449,25.3087163],[83.010556,25.3086144]] },
    { name: 'TR-156', coordinates: [[83.0098381,25.3088475],[83.0098703,25.309016]] },
  ],
  'TR-157': [
    { name: 'TR-157', coordinates: [[83.0086783,25.3096885],[83.0086823,25.3099273],[83.008681,25.3100195],[83.008744,25.3102607],[83.0088433,25.3105372]] },
  ],
  'TR-22': [
    { name: 'TR-22', coordinates: [[83.0087252,25.3102898],[83.0085965,25.3103189],[83.008634,25.3104499],[83.0085536,25.310222],[83.0083229,25.3102898]] },
  ],
  'PR-02': [
    { name: 'PR-02', coordinates: [[83.0069597,25.3091825],[83.0074251,25.3091225],[83.0077685,25.3090935],[83.0081279,25.3090498],[83.0084927,25.3090207]] },
  ],
  'PR-06': [
    { name: 'PR-06', coordinates: [[83.00733,25.3104762],[83.00746,25.3106598],[83.0076049,25.3107423],[83.0077819,25.3107908],[83.0079535,25.310815],[83.0081788,25.3107762],[83.0084256,25.3107665],[83.0085114,25.3108344],[83.0087136,25.3109701]] },
  ],
  'TR-14': [
    { name: 'TR-14', coordinates: [[83.0095296,25.308662],[83.0095873,25.308679],[83.0096383,25.3087117],[83.0096731,25.3087372],[83.0097053,25.3087639],[83.0096973,25.3087736],[83.0097134,25.3088087],[83.0097375,25.3088499],[83.0097375,25.3088645]] },
    { name: 'TR-14', coordinates: [[83.0096785,25.3088924],[83.0096906,25.308976],[83.0097053,25.309073]] },
    { name: 'TR-14', coordinates: [[83.009708,25.30901],[83.0098233,25.3090003],[83.00983,25.3090391]] },
  ],
  'TR-149': [
    { name: 'TR-149', coordinates: [[83.0097419,25.3082546],[83.0098277,25.3082498],[83.0099028,25.308251],[83.0099699,25.3082243],[83.0100423,25.3082025],[83.0101268,25.3081673],[83.0101683,25.3081528]] },
    { name: 'TR-149', coordinates: [[83.0100262,25.3082138],[83.0100959,25.3083095],[83.010112,25.308318],[83.0101227,25.3083144],[83.0101992,25.3084017],[83.0101817,25.3084138],[83.0101965,25.3084368]] },
    { name: 'TR-149', coordinates: [[83.010112,25.308318],[83.0101026,25.3083532],[83.010104,25.3083944],[83.0100959,25.3084502]] },
  ],
  'TR-12': [
    { name: 'TR-12', coordinates: [[83.0099779,25.3078052],[83.0100114,25.30785],[83.0100309,25.3078562],[83.0100383,25.3078779],[83.0100812,25.3079967],[83.010108,25.3080513],[83.0101496,25.3081192],[83.0101683,25.3081528],[83.0102153,25.3082016],[83.0102703,25.3082538],[83.0102998,25.3082744],[83.0103212,25.3083059],[83.0103615,25.3083471],[83.0103923,25.3084053],[83.0104258,25.3084623],[83.0104687,25.3085169],[83.0105412,25.3086163]] },
  ],
  'PR-07': [
    { name: 'PR-07', coordinates: [[83.0087136,25.3109701],[83.0089389,25.3111786],[83.0092124,25.3113338],[83.0094699,25.3114987],[83.0097811,25.3117557],[83.0103497,25.3117557]] },
  ],
  'TR-01': [
    { name: 'TR-01', coordinates: [[83.0095785,25.3068493],[83.009675,25.3068638],[83.0097716,25.3068275],[83.0101739,25.3067741],[83.0103536,25.306648],[83.0103295,25.3064468]] },
    { name: 'TR-01', coordinates: [[83.0103295,25.3064468],[83.0102383,25.3064346],[83.0101712,25.3064613],[83.0101095,25.3063958],[83.0101766,25.3064662],[83.0101122,25.3065098],[83.0100612,25.3065898]] },
    { name: 'TR-01', coordinates: [[83.010021,25.3068153],[83.0100559,25.306905]] },
  ],
};

// Score-to-color mapping
export function getScoreColor(score: number): string {
  if (score <= 20) return '#ef4444'; // critical red
  if (score <= 35) return '#f97316'; // poor orange
  if (score <= 50) return '#eab308'; // fair yellow
  if (score <= 65) return '#22c55e'; // good green
  return '#14b8a6'; // excellent teal
}

export function getScoreLabel(score: number): string {
  if (score <= 20) return 'Critical';
  if (score <= 35) return 'Poor';
  if (score <= 50) return 'Fair';
  if (score <= 65) return 'Good';
  return 'Excellent';
}

export function getScoreForCategory(s: SegmentScore, cat: CategoryKey): number {
  switch (cat) {
    case 'index': return s.index;
    case 'walkability': return s.walkability;
    case 'lighting': return s.lighting;
    case 'transport': return s.transport;
    case 'visibility': return s.visibility;
    case 'accessibility': return s.accessibility;
    case 'roadSafety': return s.roadSafety;
  }
}

// Match score to segment
const scoreMap = new Map<string, SegmentScore>();
scores.forEach(s => scoreMap.set(normalize(s.code), s));

export function getSegmentScore(code: string): SegmentScore | undefined {
  return scoreMap.get(normalize(code));
}

// Human-readable segment labels based on area/road names
const SEGMENT_LABELS: Record<string, string> = {
  // Known roads — single segment gets just the road name
  'PR-01': 'Luxa Road',
  
  // Dashashwamedh Road (multiple segments)
  'PR-02': 'Dashashwamedh Rd A',
  'PR-03': 'Dashashwamedh Rd B',
  'TR-01': 'Dashashwamedh Rd C',
  
  // Nai Sarak Road (multiple segments)
  'PR-10': 'Nai Sarak A',
  'PR-11': 'Nai Sarak B',
  'PR-12': 'Nai Sarak C',
  
  // Meer Ghat Lane area (riverside, western)
  'SR-01': 'Meer Ghat Lane A',
  'SR-02': 'Meer Ghat Lane B',
  'TR-56': 'Meer Ghat Lane C',
  'TR-54': 'Meer Ghat Lane D',
  
  // Manikarnika area lanes
  'SR-03': 'Manikarnika Lane A',
  'TR-41': 'Manikarnika Lane B',
  'TR-52': 'Manikarnika Lane C',
  'TR-53': 'Manikarnika Lane D',
  'TR-57': 'Manikarnika Lane E',
  'TR-49': 'Manikarnika Lane F',
  'TR-50': 'Manikarnika Lane G',
  
  // Chowk area lanes
  'PR-05': 'Chowk Lane A',
  'PR-06': 'Chowk Lane B',
  'SR-06': 'Chowk Lane C',
  'SR-07': 'Chowk Lane D',
  'TR-27': 'Chowk Lane E',
  'TR-48': 'Chowk Lane F',
  
  // Vishwanath area lanes
  'SR-08': 'Vishwanath Lane A',
  'TR-25': 'Vishwanath Lane B',
  'TR-24': 'Vishwanath Lane C',
  'TR-22': 'Vishwanath Lane D',
  'TR-157': 'Vishwanath Lane E',
  'TR-28': 'Vishwanath Lane F',
  
  // Godowlia area
  'SR-04': 'Godowlia Lane A',
  'SR-05': 'Godowlia Lane B',
  'TR-14': 'Godowlia Lane C',
  'TR-156': 'Godowlia Lane D',
  
  // Kedar Ghat area (southern)
  'PR-04': 'Kedar Ghat Lane A',
  'TR-149': 'Kedar Ghat Lane B',
  'TR-12': 'Kedar Ghat Lane C',
  
  // Scindia Ghat area (northern)
  'PR-07': 'Scindia Ghat A',
  'PR-08': 'Scindia Ghat B',
  'PR-09': 'Scindia Ghat C',
};

const codeToLabelMap = new Map<string, string>();
Object.entries(SEGMENT_LABELS).forEach(([code, label]) => {
  codeToLabelMap.set(normalize(code), label);
});

export function getSegmentLabel(code: string): string {
  return codeToLabelMap.get(normalize(code)) || code;
}

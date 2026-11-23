/* =====================================================================
   CASE STUDIES — the ONLY content file for the case-study pop-ups.
   One entry per project (the card's href="#<slug>" opens it).
   Layout: station 01 = the board (map) with small points; a click on a point zooms into that spot and
   stays zoomed there (click the board again to zoom out). Then the stations follow one after another along a liquid
   line (the timeline, like the Experience section of the main site) that drips down as you scroll.
   Files live in assets/cases/<slug>/ : <name>.webp (on the page) + <name>-full.webp (lightbox).
     board:  the map image + its video (plays on hover / with the play button)
     hot:    { x, y } 0–1 spot on the board that leads to the station
     layout: the editorial arrangement of the station (styles/case-study.css "layouts"):
             hero · split-end · stack-start · png · tools (big image beside the text, a row under the text) · split-start
     media:  { k:'png', src, w, h, r }               a cut-out (no frame, no background behind it); r = its tilt
             { k:'stack', items:[{src,w,h}…] }       cards that flip on their own; a click enlarges one
             { k:'row',   items:[{src,w,h}…] }       images side by side, each at its own random tilt, overlapping a little; a click enlarges one
   ===================================================================== */
window.IE_CASES = {
  'rooted-in-heritage': {
    dir: 'assets/cases/rooted-in-heritage/',
    title: { en: 'Rooted in Heritage', ar: 'متجذّرة في التراث' },
    sub: { en: 'Al Baha Virtual Hackathon', ar: 'هاكاثون منطقة الباحة الافتراضي' },   /* the line under the title */
    board: { src: 'map-stage.webp', full: 'map-full.webp', w: 3000, h: 1969, video: 'board.mp4', alt: 'The full interactive map of the hackathon' },
    stations: [
      { id: 'experience',
        t: { en: 'The Experience', ar: 'التجربة' },
        p: { en: 'An interactive map designed as an integrated learning environment, helping participants develop innovative digital solutions throughout the hackathon, in partnership with Al Baha Emirate and participating government entities.',
             ar: 'خريطة تفاعلية صُممت لتكون بيئة تدريبية متكاملة، تساعد المشاركين على تطوير حلول رقمية مبتكرة خلال الهاكاثون، بالشراكة مع إمارة منطقة الباحة والجهات الحكومية المشاركة.' } },

      { id: 'inspired', layout: 'split-end', hot: { x: 0.2, y: 0.1 },             /* the heritage village on the mountain */
        t: { en: 'Inspired by Al Baha', ar: 'مستوحاة من الباحة' },
        p: { en: "The visual direction was inspired by Al Baha's heritage villages, distinctive stone architecture, mountainous landscapes, and lush greenery, bringing the spirit of the region into the digital experience.",
             ar: 'استُلهم التوجه البصري من القرى التراثية والعمارة الحجرية المميزة لمنطقة الباحة، إلى جانب طبيعتها الجبلية ومساحاتها الخضراء، لنقل روح المكان إلى التجربة الرقمية.' },
        media: [{ k: 'png', src: 's2-inspired', w: 2000, h: 1636, r: -2, alt: 'A real heritage building of Al Baha beside the team buildings on the board' }] },

      { id: 'components', layout: 'stack-start', hot: { x: 0.85, y: 0.47 },      /* Al Akhwain fort */
        t: { en: 'The Board Components', ar: 'مكوّنات اللوحة' },
        p: { en: 'The experience features a main map with heritage-inspired buildings, dedicated team spaces, directional signage, and interactive environments containing training tools and activities.',
             ar: 'تتكون التجربة من خريطة رئيسية تضم مباني تراثية، ومساحات مخصصة للفرق، ولافتات إرشادية، وبيئات تفاعلية تحتوي على الأدوات والأنشطة التدريبية.' },
        media: [{ k: 'stack', items: [
          { src: 's3-fort', w: 1394, h: 1400, alt: 'Al Akhwain fort on the board' },
          { src: 's3-team9', w: 1394, h: 1400, alt: 'Team 9 building and the team-forming square sign' },
          { src: 's3-mosque', w: 1394, h: 1400, alt: 'Al Atawlah mosque on the board' }] }] },

      { id: 'starting-point', layout: 'png', hot: { x: 0.95, y: 0.57 },          /* team 1 */
        t: { en: 'Team Starting Point', ar: 'نقطة انطلاق الفريق' },
        p: { en: 'Each team begins its journey from its own dedicated building on the map, serving as its entry point to its interactive workspace.',
             ar: 'يبدأ كل فريق رحلته من مبناه الخاص داخل الخريطة، والذي يمثل نقطة دخوله إلى مساحة العمل التفاعلية المخصصة له.' },
        media: [{ k: 'png', src: 's4-team1', w: 1400, h: 1250, r: 0, alt: 'Team 1 building' }] },

      { id: 'tools', layout: 'tools', hot: { x: 0.42, y: 0.49 },                 /* the challenge square */
        t: { en: 'Interactive Tools', ar: 'الأدوات التفاعلية' },
        p: { en: "Each team's workspace is organized into interactive tools and activities that guide participants through exploring challenges, generating ideas, developing concepts, and transforming them into prototypes.",
             ar: 'داخل مساحة كل فريق، تتوزع اللوحة إلى مجموعة من الأدوات والأنشطة التفاعلية التي تساعد المشاركين على استكشاف التحديات، وتوليد الأفكار، وتطويرها وتحويلها إلى نماذج أولية.' },
        media: [
          { k: 'png', src: 's5-mountain', w: 2000, h: 1478, r: 0, alt: "A team's workspace board with its ten stations" },
          { k: 'row', items: [
            { src: 's5-tool1', w: 1400, h: 1371, alt: 'Tool 1: discovering the challenge' },
            { src: 's5-tool2', w: 1400, h: 1371, alt: 'Tool 2: root-cause analysis' },
            { src: 's5-tool3', w: 1398, h: 1400, alt: 'Tool 3: interviews' }] }] },

      { id: 'prototypes', layout: 'split-start', hot: { x: 0.27, y: 0.58 },      /* the evaluation tower */
        t: { en: 'From Ideas to Prototypes', ar: 'من الأفكار إلى النماذج الأولية' },
        p: { en: 'In the final stage, each team brings together the outcomes of its journey into a developed prototype, ready to be presented to the judging panel.',
             ar: 'في المحطة النهائية، يجمع كل فريق مخرجات رحلته في نموذج أولي متكامل، ليكون جاهزًا للعرض والتقديم أمام لجنة التحكيم.' },
        media: [{ k: 'png', src: 's6-prototype', w: 1400, h: 1194, r: 1.5, alt: 'Station 10: design steps and the first prototype' }] }
    ]
  },

  /* ---------- 2 · Future in Motion (no board: station 01 = the looping cover video beside the text) ----------
     neon: true = the thin turquoise ↔ mauve neon frame with light travelling around it
     { k:'vid', src, w, h }                        a looping video (muted, always playing); a click shows it large
     { k:'tanmon', src, w, h, video, btn }         the avatar cut-out + a button that plays its video WITH sound
     { k:'carousel', every, items:[{src,w,h}…] }   centre image large + clear, the others smaller + darker; turns every 4s or by hand
     stack items with v:'<name>'                   a short looping video card instead of an image */
  'future-in-motion': {
    dir: 'assets/cases/future-in-motion/',
    title: { en: 'Future in Motion', ar: 'مستقبل يتحرك' },
    sub: { en: 'Social Development Bank — Hackathon Experience', ar: 'هاكاثون بنك التنمية الاجتماعية' },
    stations: [
      { id: 'vision', layout: 'intro',
        t: { en: 'The Vision', ar: 'الرؤية' },
        p: { en: 'An immersive digital experience designed to inspire innovative ideas and solutions that create positive social impact.',
             ar: 'تجربة رقمية تفاعلية تهدف إلى إلهام المشاركين لتطوير أفكار وحلول مبتكرة تُحدث تأثيرًا إيجابيًا في المجتمع.' },
        media: [{ k: 'vid', src: 'cover', w: 1600, h: 884, neon: true, alt: 'The interactive city with Tanmon, the AI assistant' }] },

      { id: 'visual-direction', layout: 'square-end',
        t: { en: 'Visual Direction', ar: 'الهوية برؤية مستقبلية' },
        p: { en: 'Saudi landmarks and architectural elements reimagined through futuristic nighttime environments, neon lighting, and glowing pathways — blending local identity with digital transformation.',
             ar: 'إعادة تقديم المعالم والعناصر المعمارية السعودية برؤية مستقبلية، من خلال المشاهد الليلية وإضاءات النيون، في مزيج يجمع بين الهوية المحلية والتحول الرقمي.' },
        media: [{ k: 'png', src: 's2-bank', w: 1400, h: 1399, r: 0, neon: true, alt: 'The Social Development Bank building in a futuristic night scene' }] },

      { id: 'tanmon', layout: 'png',
        t: { en: 'Meet TANMON', ar: 'تعرّف على تنمون' },
        p: { en: 'TANMON is the AI-powered assistant guiding participants throughout their journey, providing instructions and information through voice and text at every station.',
             ar: 'تنمون هو المساعد الذكي الذي يرافق المشاركين في رحلتهم، ويقدم الإرشادات والمعلومات صوتيًا أو كتابيًا في كل محطة.' },
        media: [{ k: 'tanmon', src: 's3-tanmon', w: 1400, h: 1172, video: 's3-tanmon.mp4', btn: { en: 'Meet Tanmon', ar: 'تعرّف على تنمون' }, alt: 'Tanmon, the AI assistant' }] },

      { id: 'city', layout: 'carousel',
        t: { en: 'Explore the City', ar: 'اكتشف المدينة' },
        p: { en: 'An interactive city where each building represents a station, offering Social Development Bank services, training content, and useful resources.',
             ar: 'مدينة تفاعلية تضم مباني تمثل محطات مختلفة، تقدم خدمات بنك التنمية الاجتماعية ومحتوى تدريبيًا وموارد مفيدة للمشاركين.' },
        media: [{ k: 'carousel', every: 4000, items: [
          { src: 's4-guide', w: 1080, h: 1080, alt: 'The promising projects guide building' },
          { src: 's4-canva', w: 1080, h: 1080, alt: 'The Canva building' },
          { src: 's4-tower', w: 1080, h: 1080, alt: 'Kingdom Tower and the participants city' }] }] },

      { id: 'group-activities', layout: 'wide',
        t: { en: 'Interactive Group Activities', ar: 'تجارب تفاعلية جماعية' },
        p: { en: 'A live group activity inspired by the Saudi Metro journey, allowing participants to join simultaneously and introduce themselves through a shared interactive experience.',
             ar: 'نشاط جماعي مباشر مستوحى من رحلة مترو السعودية، يتيح للمشاركين الانضمام والتعريف بأنفسهم في تجربة تفاعلية مشتركة.' },
        media: [{ k: 'png', src: 's5-metro', w: 2094, h: 701, r: 0, neon: true, alt: 'The metro carriage where participants introduce themselves' }] },

      { id: 'innovation-metro', layout: 'stack-start',
        t: { en: 'The Innovation Metro', ar: 'مترو الابتكار' },
        p: { en: 'A futuristic metro journey connecting different Saudi stations, each representing an Emirate through a distinctive digital environment.',
             ar: 'رحلة مستقبلية عبر محطات مترو الابتكار، تمثل كل محطة منها إمارة سعودية في بيئة رقمية بطابع مميز.' },
        media: [{ k: 'stack', neon: true, items: [
          { v: 's6-riyadh', w: 976, h: 936, alt: 'Riyadh station' },
          { v: 's6-jeddah', w: 938, h: 848, alt: 'Jeddah station' },
          { v: 's6-neom', w: 842, h: 712, alt: 'NEOM station' },
          { src: 's6-matrix', w: 1080, h: 1080, alt: 'Activity 4: the insights matrix' }] }] },

      { id: 'projects', layout: 'split-end',
        t: { en: 'From Ideas to Projects', ar: 'من الأفكار إلى المشاريع' },
        p: { en: 'Participants submit their ideas and project prototypes, automatically collected in a centralized Project Library for easy access and review.',
             ar: 'يقدم المشاركون أفكارهم والنماذج الأولية لمشروعاتهم، لتُحفظ تلقائيًا في مكتبة مركزية تتيح الوصول إلى ملفاتهم بسهولة.' },
        media: [{ k: 'png', src: 's7-library', w: 1969, h: 909, r: 0, neon: true, alt: 'The project library with every participant file' }] }
    ]
  },

  /* ---------- 3 · The Magic of Munawara (no board; every video waits until it reaches the middle of the screen
     or the mouse is on it — play: 'center'; frame: 'green' = a plain glowing-green frame around every image, no animation) ---------- */
  'magic-of-munawara': {
    dir: 'assets/cases/magic-of-munawara/',
    title: { en: 'The Magic of Munawara', ar: 'سحر المدينة المنورة' },
    sub: { en: 'Hackathon Almonawara 2026', ar: 'برمجان المنورة 2026' },
    play: 'center', frame: 'green',
    stations: [
      { id: 'inspiration', layout: 'intro',
        t: { en: 'The Inspiration', ar: 'مصدر الإلهام' },
        p: { en: 'Inspired by the magic of Madinah, its rich heritage, and its legacy as a beacon of light, knowledge, and inspiration. This spirit was carried into every detail of the visual experience.',
             ar: 'استُلهم التصميم من سحر المدينة المنورة وعراقتها، ومكانتها كمصدر للنور والعلم والإلهام، لتُترجم روحها إلى تجربة بصرية متكاملة.' },
        media: [{ k: 'vid', src: 'cover', w: 964, h: 632, alt: 'The board: the city of the Madinah hackathon' }] },

      { id: 'smarter-experience', layout: 'square-end',
        t: { en: 'A Smarter Experience', ar: 'تجربة أكثر سهولة' },
        p: { en: 'The experience evolved into a fully integrated website, making the journey easier to access and navigate from both computer and mobile.',
             ar: 'تطورت التجربة لتصبح موقعًا إلكترونيًا متكاملًا، يتيح للمشاركين الوصول إلى رحلتهم والتنقل خلالها بسهولة من الكمبيوتر أو الموبايل.' },
        media: [{ k: 'vid', src: 's2-site', w: 720, h: 740, alt: 'The hackathon website' }] },

      { id: 'landmarks', layout: 'carousel',
        t: { en: 'A City of Landmarks', ar: 'معالم المدينة' },
        p: { en: "Madinah's iconic landmarks were brought into the board, with their architectural details and unique character preserved and blended seamlessly with the visual identity.",
             ar: 'أُدرجت أبرز معالم المدينة المنورة داخل اللوحة، مع الحفاظ على تفاصيلها المعمارية وطابعها المميز، ودمجها بتناغم مع الهوية البصرية للتصميم.' },
        media: [{ k: 'carousel', every: 4000, items: [
          { src: 's3-safiyah', w: 862, h: 763, alt: 'As Safiyah Museum and Park' },
          { src: 's3-emirate', w: 819, h: 842, alt: 'The Emirate of Madinah Region' },
          { src: 's3-elm', w: 872, h: 873, alt: 'The elm building' }] }] },

      { id: 'every-team', layout: 'square-start',
        t: { en: 'Built for Every Team', ar: 'مدينة لكل فريق' },
        p: { en: 'A connected city with three dedicated routes, guiding participants to their own team buildings through an organized and scalable experience designed to accommodate large numbers of participants.',
             ar: 'مدينة مترابطة بثلاثة مسارات مخصصة، تقود المشاركين إلى مباني فرقهم في تجربة منظمة ومرنة تستوعب أعدادًا كبيرة من المشاركين.' },
        media: [{ k: 'vid', src: 's4-city', w: 720, h: 750, alt: 'The routes and the participants city' }] },

      { id: 'prototypes', layout: 'carousel',
        t: { en: 'From Ideas to Prototypes', ar: 'من الأفكار إلى النماذج الأولية' },
        p: { en: "Each team's building featured a dedicated toolkit, guiding participants step by step from exploring ideas to developing their final prototypes, ready for presentation to the judges.",
             ar: 'خُصصت لكل فريق مجموعة متكاملة من الأدوات داخل مبناه، تقوده خطوة بخطوة من استكشاف الأفكار إلى تطوير النموذج الأولي النهائي، استعدادًا لعرضه أمام لجنة التحكيم.' },
        media: [{ k: 'carousel', every: 4000, items: [
          { src: 's5-team', w: 1079, h: 1098, alt: "Team 22's building" },
          { src: 's5-inside', w: 805, h: 665, alt: 'Inside the team building: the toolkit floor by floor' },
          { src: 's5-activity1', w: 889, h: 810, alt: 'Activity 1: discovering the challenge' },
          { src: 's5-activity7', w: 890, h: 900, alt: 'Activity 7: defining the concept' }] }] },

      { id: 'ideas-to-life', layout: 'carousel',
        t: { en: 'Where Ideas Come to Life', ar: 'حيث تتحول الأفكار إلى واقع' },
        p: { en: 'The exhibition areas were designed in the spirit of Al Bustan Museum’s architecture, giving teams a place to showcase their final projects and prototypes.',
             ar: 'استُلهم تصميم مساحات العرض من الطابع المعماري لمتحف البستان، لتصبح وجهة تعرض فيها الفرق مشروعاتها ونماذجها النهائية.' },
        media: [{ k: 'carousel', every: 4000, items: [
          { src: 's6-entrance', w: 1080, h: 726, alt: 'The projects exhibition entrance' },
          { src: 's6-route1', w: 1080, h: 832, alt: 'Route one: enriching the visitor experience' },
          { src: 's6-route2', w: 1079, h: 970, alt: 'Route two: activating community participation' },
          { src: 's6-route3', w: 1079, h: 957, alt: 'Route three: smart follow-up of services' }] }] },

      { id: 'taif', layout: 'square-end',
        t: { en: 'Meet Taif', ar: 'تعرّف على طيف' },
        p: { en: 'Taif was the intelligent companion throughout the journey, guiding participants, offering support, and making every step of their experience easier.',
             ar: 'طيف هو المساعد الذكي الذي رافق المشاركين طوال الرحلة، وقدم لهم الدعم والإرشاد لتسهيل تجربتهم في كل مرحلة.' },
        media: [{ k: 'vid', src: 's7-taif', w: 720, h: 730, alt: 'Taif, the smart assistant' }] }
    ]
  }
};

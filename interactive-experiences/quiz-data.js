/* =====================================================================
   QUIZ — CONTENT ONLY (approved 22 Nov 2026 — do not rewrite the texts)
   components/quiz.js builds the board and the pop-ups from this file.
   Arabic = Modern Standard Arabic; English = the approved translation.
   ===================================================================== */
window.IEQuizData = {

  /* ---- "Let's connect" in the result opens the contact section of the main page (to be built there) ---- */
  connect: '../index.html#contact',

  /* ---- the board: one setting per background (coordinates are fractions of the image, 0 → 1) ---- */
  boards: {
    lap: {
      // the picture fills the screen from edge to edge; the visitor scrolls down to the cave
      img: { w: 1086, h: 1448, src: 'assets/quiz/bg-laptop.webp', srcBig: 'assets/quiz/bg-laptop.webp', soft: 'assets/quiz/bg-laptop-blur.webp' },
      size: 0.08, icon: 1.25,                 // platform width (× picture width) · icon width (× platform) — big icons, platform unchanged
      dot: [0.0105, 2.6],                     // dot size (× picture width) · gap between dots (× dot size) — evenly spaced along the road
      title: 0.09,                            // "Your Dream Design" + the line under it, in the empty sky (centre y)
      home: [0.8, 0.955],                     // "Back to the main page": very bottom, on the right
      depth: [0.27, 0.83],
      path: [[0.75,0.265],[0.6667,0.2917],[0.5889,0.3192],[0.6667,0.3442],[0.7333,0.3633],[0.7389,0.3833],[0.6667,0.4],[0.5,0.4083],[0.3667,0.4192],[0.2778,0.4358],[0.25,0.4583],[0.2944,0.4833],[0.4444,0.4983],[0.5889,0.5117],[0.6533,0.5383],[0.6167,0.5633],[0.4667,0.5858],[0.3222,0.6025],[0.2533,0.6275],[0.2778,0.6567],[0.3889,0.6883],[0.5333,0.7192],[0.5778,0.75],[0.5722,0.7817],[0.5222,0.815],[0.3778,0.8275],[0.2222,0.8025],[0.1389,0.7775]],
      st: [[0.750,0.265],[0.730,0.370],[0.500,0.408],[0.270,0.452],[0.620,0.527],[0.300,0.605],[0.500,0.717],[0.370,0.830]],
      cave: [0.13, 0.775, 0.3]
    },
    mob: {
      plat: 'assets/quiz/platform-m.webp',
      title: 0.148,                           // "Your Dream Design" in the empty sky (centre y)
      img: { w: 2160, h: 5760, src: 'assets/quiz/bg-mobile-720.webp', srcBig: 'assets/quiz/bg-mobile-1080.webp', soft: 'assets/quiz/bg-mobile-blur.webp' },
      view: [0.24, 0.98],
      depth: [0.28, 0.72],
      path: [[0.7214,0.2732],[0.6643,0.2849],[0.6114,0.3042],[0.6643,0.3214],[0.7643,0.3374],[0.8,0.3535],[0.7571,0.3669],[0.6,0.3749],[0.4286,0.3814],[0.2857,0.3910],[0.2143,0.4044],[0.25,0.4242],[0.4286,0.4365],[0.6429,0.4472],[0.7429,0.4633],[0.7143,0.4832],[0.5714,0.4992],[0.3571,0.5142],[0.2286,0.5292],[0.1971,0.5597],[0.3357,0.5892],[0.5643,0.6095],[0.7357,0.6277],[0.7857,0.6454],[0.7214,0.6615],[0.6286,0.6802],[0.5571,0.7043],[0.4714,0.7311],[0.3429,0.7284],[0.25,0.7070]],
      st: [[0.7214,0.2732],[0.7930,0.3520],[0.3157,0.3883],[0.4823,0.4392],[0.6312,0.4938],[0.2418,0.5261],[0.4727,0.6020],[0.5823,0.6955]],
      cave: [0.236, 0.696, 0.46],
      home: [0.5, 0.915]
    }
  },

  /* ---- interface texts ---- */
  ui: {
    introLabel: { en: 'Your Interactive Journey', ar: 'رحلتك التفاعلية' },
    introTitle: { en: ['Discover Your', 'Dream Design'], ar: ['اكتشف تصميم', 'أحلامك'] },
    introText: {
      en: 'Eight short questions about your goal, your audience and the style you like, and at the end of the road a ready concept awaits you: the interactive experience your project needs.',
      ar: 'ثمانية أسئلة قصيرة عن هدفك وجمهورك والطابع الذي تفضّله، وفي نهاية الطريق تنتظرك فكرة جاهزة للتجربة التفاعلية التي يحتاجها مشروعك.'
    },
    steps: {
      en: ['Tap the glowing station to open its question.', 'Choose the answer that fits your project, and the path lights up to the next station.', 'Reach the cave at the end of the road to reveal a concept made just for you.'],
      ar: ['اضغط على المحطة المضيئة ليظهر لك سؤالها.', 'اختر الإجابة الأنسب لمشروعك، فيضيء الطريق إلى المحطة التالية.', 'صِل إلى الكهف في نهاية الطريق لتكتشف فكرة صُمّمت خصيصًا لك.']
    },
    start: { en: 'Let’s Start the Quiz', ar: 'لنبدأ الاختبار' },
    skyTitle: { en: ['Your Dream ', 'Design'], ar: ['تصميم', ' أحلامك'] },   // the coloured word is Design / تصميم
    skySub: { en: 'Together, a complete experience can be built for your client.', ar: 'معًا يمكن بناء تجربة متكاملة لعميلك' },
    reveal: { en: 'Reveal your result', ar: 'اكشف نتيجتك' },
    open: { en: 'Open', ar: 'افتح' },
    resultLabel: { en: 'Your Dream Design', ar: 'تصميم أحلامك' },
    contactTitle: { en: 'Start your project', ar: 'ابدأ مشروعك' },
    contactText: { en: 'Send your result, and it will be brought to life together.', ar: 'أرسل نتيجتك، وستُحوَّل معًا إلى تجربة حقيقية.' },
    connectBtn: { en: 'Let’s Connect', ar: 'لنتواصل' },
    close: { en: 'Close', ar: 'إغلاق' },
    home: { en: 'Back to the main page', ar: 'العودة إلى الصفحة الرئيسية' },
    homeLines: { en: ['Back to the', 'main page'], ar: ['العودة إلى', 'الصفحة الرئيسية'] },
    of: { en: 'of', ar: 'من' },
    msgHi: { en: 'Hi Nehal, I took the quiz on your website.', ar: 'مرحبًا نهال، أجبت عن الاختبار في موقعك.' },
    msgResult: { en: 'My result', ar: 'النتيجة' },
    msgAnswers: { en: 'My answers', ar: 'إجاباتي' },
    msgEnd: { en: 'I’d like to start a project with you.', ar: 'أودّ أن أبدأ مشروعًا معك.' },
    mailSubject: { en: 'My quiz result', ar: 'نتيجة الاختبار' }
  },

  /* ---- the 8 stations: topic (label under the platform), question, options (title + one line) ---- */
  questions: [
    { topic: { en: 'Your Goal', ar: 'الهدف' },
      q: { en: 'What do you aim to achieve with this experience?', ar: 'ما الهدف الذي تسعى إلى تحقيقه من التجربة؟' },
      o: [
        { t: { en: 'Training & Education', ar: 'التدريب والتعليم' }, d: { en: 'Interactive knowledge transfer and skill building through progressive stages and challenges, concluding with an assessment that measures understanding.', ar: 'نقل المعرفة وبناء المهارات بأسلوب تفاعلي عبر مراحل متدرجة وتحديات، تُختتم بتقييم يقيس مستوى الفهم.' } },
        { t: { en: 'Innovation & Solutions', ar: 'الابتكار وصناعة الحلول' }, d: { en: 'Teams tackle real challenges and turn their ideas into actionable prototypes.', ar: 'فرق عمل تتصدى لتحديات حقيقية، وتحوّل أفكارها إلى نماذج أولية قابلة للتنفيذ.' } },
        { t: { en: 'Place & Heritage Discovery', ar: 'التعريف بمكان أو تراث' }, d: { en: 'A journey that tells the story of a city, landmark or culture, revealed to the visitor step by step.', ar: 'رحلة تروي حكاية مدينة أو معلم أو ثقافة، يكتشف الزائر فصولها خطوة بخطوة.' } },
        { t: { en: 'Product or Campaign Launch', ar: 'إطلاق منتج أو حملة' }, d: { en: 'An experience that brings a product closer to its audience, letting them discover, try and engage with it before buying.', ar: 'تجربة تقرّب المنتج من جمهوره، فيتعرّف عليه ويجرّبه ويتفاعل معه قبل اقتنائه.' } },
        { t: { en: 'Event Audience Engagement', ar: 'إشراك الجمهور في فعالية' }, d: { en: 'An activity that draws visitors in and inspires them to take part, capture and share.', ar: 'نشاط يجذب الزوار ويدفعهم إلى المشاركة والتوثيق والنشر.' } }
      ] },
    { topic: { en: 'Audience', ar: 'الجمهور' },
      q: { en: 'Who is the experience for?', ar: 'من الفئة المستهدفة بالتجربة؟' },
      o: [
        { t: { en: 'Government Entities & Staff', ar: 'الجهات الحكومية ومنسوبوها' }, d: { en: 'A clear, official experience aligned with the entity’s identity and institutional goals.', ar: 'تجربة رسمية واضحة، تنسجم مع هوية الجهة وتخدم أهدافها المؤسسية.' } },
        { t: { en: 'Students & Youth', ar: 'الطلاب والشباب' }, d: { en: 'Fast-paced, built on challenge and competition, speaking the language of digital platforms.', ar: 'تجربة سريعة الإيقاع، تقوم على التحدي والمنافسة، وتحاكي لغة المنصات الرقمية.' } },
        { t: { en: 'Children & Families', ar: 'الأطفال والأسر' }, d: { en: 'Simple, safe and colorful, blending learning with play.', ar: 'تجربة بسيطة وآمنة ومفعمة بالألوان، تجمع بين التعلّم واللعب.' } },
        { t: { en: 'Entrepreneurs & Innovators', ar: 'رواد الأعمال والمبتكرون' }, d: { en: 'Practical and focused on ideas, tools and results.', ar: 'تجربة عملية تركّز على الأفكار والأدوات والنتائج.' } },
        { t: { en: 'General Public', ar: 'الجمهور العام' }, d: { en: 'Accessible to all ages, with no prior explanation needed.', ar: 'تجربة ميسّرة لجميع الأعمار، لا تتطلب أي شرح مسبق.' } }
      ] },
    { topic: { en: 'Participants', ar: 'عدد المشاركين' },
      q: { en: 'Approximately how many participants?', ar: 'ما العدد التقريبي للمشاركين؟' },
      o: [
        { t: { en: 'Fewer than 30', ar: 'أقل من 30 مشاركًا' }, d: { en: 'A small group, allowing a personal experience and direct interaction with every participant.', ar: 'مجموعة محدودة، تتيح تجربة شخصية وتفاعلًا مباشرًا مع كل مشارك.' } },
        { t: { en: '30 to 100', ar: 'من 30 إلى 100 مشارك' }, d: { en: 'Mid-sized teams with easy group management and follow-up.', ar: 'فرق متوسطة الحجم، مع إدارة ومتابعة ميسّرة للمجموعات.' } },
        { t: { en: '100 to 500', ar: 'من 100 إلى 500 مشارك' }, d: { en: 'A complete platform with registration, team formation and a tracking dashboard.', ar: 'منصة متكاملة تشمل التسجيل وتكوين الفرق ولوحة متابعة.' } },
        { t: { en: 'More than 500', ar: 'أكثر من 500 مشارك' }, d: { en: 'An open promotional experience on an interactive screen, which any passerby can try instantly with no registration.', ar: 'تجربة ترويجية مفتوحة عبر شاشة تفاعلية، يخوضها أي عابر فورًا ودون تسجيل.' } }
      ] },
    { topic: { en: 'Venue', ar: 'المكان' },
      q: { en: 'Where will the experience take place?', ar: 'أين ستُقام التجربة؟' },
      o: [
        { t: { en: 'On-site', ar: 'حضوريًا' }, d: { en: 'At the event venue, where the digital experience connects directly to the space.', ar: 'في موقع الفعالية، حيث ترتبط التجربة الرقمية بالمكان ارتباطًا مباشرًا.' } },
        { t: { en: 'Virtual', ar: 'افتراضيًا' }, d: { en: 'Fully online, open to participants from anywhere in the world.', ar: 'عبر الإنترنت بالكامل، ويمكن الانضمام إليها من أي مكان في العالم.' } },
        { t: { en: 'Hybrid', ar: 'مدمجة' }, d: { en: 'On-site presence and remote participation combined in one connected experience.', ar: 'تجمع بين الحضور في الموقع والمشاركة عن بُعد في تجربة واحدة مترابطة.' } }
      ] },
    { topic: { en: 'Device', ar: 'الجهاز' },
      q: { en: 'What device will participants use?', ar: 'ما الجهاز الذي سيستخدمه المشارك؟' },
      o: [
        { t: { en: 'Mobile', ar: 'الموبايل' }, d: { en: 'Instant access via QR code or a direct link, with no app download required.', ar: 'دخول فوري عبر رمز الاستجابة السريعة أو رابط مباشر، دون الحاجة إلى تنزيل تطبيق.' } },
        { t: { en: 'Computer', ar: 'الكمبيوتر' }, d: { en: 'A wider workspace for tools, tasks and details.', ar: 'مساحة عمل أرحب للأدوات والمهام والتفاصيل.' } },
        { t: { en: 'Interactive Touchscreen', ar: 'شاشة لمس تفاعلية' }, d: { en: 'A fixed on-site station that visitors explore by touch.', ar: 'محطة ثابتة في الموقع، يستكشف الزائر محتواها باللمس.' } },
        { t: { en: 'Large Display Screen', ar: 'شاشة عرض كبيرة' }, d: { en: 'A shared experience where the audience interacts with one screen together.', ar: 'تجربة جماعية يتفاعل فيها الحضور مع شاشة واحدة في آنٍ معًا.' } }
      ] },
    { topic: { en: 'Duration', ar: 'المدة' },
      q: { en: 'How long will the experience last?', ar: 'ما المدة الزمنية للتجربة؟' },
      o: [
        { t: { en: 'A Few Hours', ar: 'جلسة لساعات' }, d: { en: 'An intensive workshop centered on a single, clear goal.', ar: 'ورشة عمل مكثّفة تتمحور حول هدف واحد محدد.' } },
        { t: { en: 'One Day', ar: 'يوم واحد' }, d: { en: 'A complete program of sequential stages, from kick-off to results.', ar: 'برنامج متكامل بمراحل متتابعة، من الانطلاق حتى الوصول إلى النتائج.' } },
        { t: { en: 'Two to Three Days', ar: 'من يومين إلى ثلاثة أيام' }, d: { en: 'A journey of training, teamwork and final evaluation, hackathon-style.', ar: 'رحلة تتضمن التدريب والعمل الجماعي والتقييم الختامي، على غرار الهاكاثون.' } },
        { t: { en: 'A Week or More / Permanent', ar: 'أسبوع فأكثر أو بشكل دائم' }, d: { en: 'An ongoing platform that participants return to, with continuously renewed content.', ar: 'منصة مستمرة يعود إليها المشاركون، بمحتوى يتجدد باستمرار.' } }
      ] },
    { topic: { en: 'Visual Style', ar: 'الطابع البصري' },
      q: { en: 'Which visual style do you prefer?', ar: 'ما الطابع البصري الذي تفضّله؟' },
      o: [
        { t: { en: 'Futuristic', ar: 'مستقبلي' }, d: { en: 'Neon light and holographic elements that evoke the technology of tomorrow.', ar: 'إضاءات نيون وعناصر مجسّمة تستحضر روح تقنيات المستقبل.' } },
        { t: { en: 'Heritage & Cultural', ar: 'تراثي وثقافي' }, d: { en: 'Patterns, textures and colors inspired by the place’s identity and history.', ar: 'زخارف وخامات وألوان مستلهمة من هوية المكان وتاريخه.' } },
        { t: { en: 'Playful & Vibrant', ar: 'مرح وحيوي' }, d: { en: 'Characters and joyful colors that bring a spirit of play.', ar: 'شخصيات وألوان مبهجة تمنح التجربة روح اللعب.' } },
        { t: { en: 'Minimal & Calm', ar: 'بسيط وهادئ' }, d: { en: 'Generous space and restrained detail that put content first.', ar: 'مساحات رحبة وتفاصيل محدودة، تضع المحتوى في الصدارة.' } },
        { t: { en: 'Cinematic', ar: 'سينمائي' }, d: { en: 'A film-like atmosphere where mystery meets realism, with dramatic lighting and captivating detail.', ar: 'أجواء أقرب إلى الفيلم، يتداخل فيها الغموض مع الواقعية، بإضاءة درامية وتفاصيل آسرة.' } }
      ] },
    { topic: { en: 'Motion', ar: 'الحركة' },
      q: { en: 'What level of motion do you want?', ar: 'ما مستوى الحركة الذي تريده؟' },
      o: [
        { t: { en: 'Static & Elegant', ar: 'ثابتة وأنيقة' }, d: { en: 'Strong design with minimal motion, fast and lightweight.', ar: 'تصميم متين بحركة محدودة، يتميز بالسرعة والخفة.' } },
        { t: { en: 'Subtle Motion', ar: 'حركة خفيفة' }, d: { en: 'Smooth transitions and gentle interactive effects that bring the experience to life.', ar: 'انتقالات انسيابية وتأثيرات تفاعلية رقيقة تبث الحياة في التجربة.' } },
        { t: { en: 'Fully Animated', ar: 'متحركة بالكامل' }, d: { en: 'Every element moves and tells part of the story, with cinematic transitions.', ar: 'كل عنصر ينبض بالحركة ويروي جزءًا من الحكاية، بانتقالات سينمائية.' } },
        { t: { en: 'Immersive 3D', ar: 'تجربة غامرة ثلاثية الأبعاد' }, d: { en: 'A three-dimensional world that participants move through and explore.', ar: 'عالم مجسّم يتنقّل المشارك في أرجائه ويستكشفه.' } }
      ] }
  ],

  /* ---- result logic: Q1–Q6 give points to the six types (A–F); the highest wins ---- */
  types: 'ABCDEF',
  points: [
    [{ A: 3, F: 1 }, { B: 3, F: 1 }, { C: 3, E: 1 }, { D: 3, E: 1 }, { E: 3, F: 2 }],             // Q1 goal (strongest)
    [{ A: 1, B: 1 }, { F: 2, B: 1 }, { F: 2, C: 1 }, { B: 2, D: 1 }, { E: 2, C: 1 }],             // Q2 audience
    [{ A: 1 }, { A: 1, F: 1 }, { B: 2 }, { E: 3 }],                                               // Q3 participants
    [{ E: 1, C: 1 }, { B: 1, A: 1 }, { B: 1, D: 1 }],                                             // Q4 place
    [{ C: 1, F: 1 }, { B: 2, A: 1 }, { E: 2, C: 1 }, { E: 2, D: 1 }],                             // Q5 device
    [{ A: 1, F: 1 }, { F: 1, D: 1 }, { B: 3 }, { A: 2, C: 1 }]                                    // Q6 duration
  ],
  goalType: 'ABCDE',          // a tie is won by the type that matches the Q1 answer (if tied), else A → F

  /* ---- the specs line under the result (from answers 3, 4, 5, 6, 8) ---- */
  specs: [
    [2, { en: ['Under 30 participants', '30–100 participants', '100–500 participants', '500+ · no sign-up'], ar: ['أقل من 30 مشاركًا', '30–100 مشارك', '100–500 مشارك', 'أكثر من 500 · بدون تسجيل'] }],
    [3, { en: ['On-site', 'Virtual', 'Hybrid'], ar: ['حضوري', 'افتراضي', 'مدمج'] }],
    [4, { en: ['Mobile', 'Computer', 'Touchscreen', 'Large screen'], ar: ['الموبايل', 'الكمبيوتر', 'شاشة لمس', 'شاشة عرض كبيرة'] }],
    [5, { en: ['A few hours', 'One day', '2–3 days', 'A week+'], ar: ['ساعات', 'يوم واحد', '2–3 أيام', 'أسبوع فأكثر'] }],
    [7, { en: ['Static', 'Subtle motion', 'Fully animated', 'Immersive 3D'], ar: ['ثابتة وأنيقة', 'حركة خفيفة', 'متحركة بالكامل', 'غامرة ثلاثية الأبعاد'] }]
  ],

  /* ---- the 30 results: type → 5 styles (1 Futuristic, 2 Heritage, 3 Playful, 4 Minimal, 5 Cinematic); image = assets/quiz/results/quiz-<type><n>.webp ---- */
  typeNames: {
    A: { en: 'Interactive Learning Journey', ar: 'رحلة تعلّم تفاعلية' },
    B: { en: 'Innovation Hackathon Platform', ar: 'منصة ابتكار وهاكاثون' },
    C: { en: 'Immersive Story Journey', ar: 'رحلة سردية غامرة' },
    D: { en: 'Interactive Launch Experience', ar: 'تجربة إطلاق تفاعلية' },
    E: { en: 'Public Interactive Installation', ar: 'شاشة تفاعلية جماهيرية' },
    F: { en: 'Gamified Challenge', ar: 'تحدٍّ تفاعلي بالنقاط' }
  },
  results: {
    A: [
      { n: { en: 'Academy of Tomorrow', ar: 'أكاديمية المستقبل' }, d: { en: 'A glowing training map traced in neon lines, where participants move between holographic knowledge stations, each unlocking a new challenge on the way to the final assessment.', ar: 'خريطة تدريبية مضيئة بخطوط النيون، ينتقل فيها المشارك بين محطات معرفية مجسّمة، وكل محطة تفتح له تحديًا جديدًا إلى أن يصل إلى التقييم النهائي.' } },
      { n: { en: 'Path of Knowledge', ar: 'درب المعرفة' }, d: { en: 'A learning path across a map inspired by local manuscripts and ornaments, where every station is a landmark of the place and a lesson of its own.', ar: 'مسار تعليمي على خريطة مستوحاة من المخطوطات والزخارف المحلية، وكل محطة فيه معلم من معالم المكان ودرس من دروسه.' } },
      { n: { en: 'Learning Quest', ar: 'مغامرة التعلّم' }, d: { en: 'A colorful world where a guide character leads participants through fun levels, earning a badge for every skill they master.', ar: 'عالم ملوّن ترافق فيه شخصية مرشدة المشارك عبر مستويات ممتعة، ويجمع شارة مع كل مهارة يتقنها.' } },
      { n: { en: 'Path to Mastery', ar: 'مسار الإتقان' }, d: { en: 'A calm, clear interface that presents each learning stage step by step, with an elegant progress indicator that keeps the focus on content.', ar: 'واجهة هادئة وواضحة تعرض مراحل التعلّم خطوة بخطوة، مع مؤشر تقدّم أنيق يُبقي التركيز على المحتوى.' } },
      { n: { en: 'Mission: Knowledge', ar: 'مهمة المعرفة' }, d: { en: 'A learning journey told like a mystery film, where lessons unfold as clues amid low light and realistic scenes.', ar: 'رحلة تعليمية تُروى كأنها فيلم غامض، والدروس فيها أدلة تتكشف تباعًا وسط إضاءة خافتة ومشاهد واقعية.' } }
    ],
    B: [
      { n: { en: 'Lab of Tomorrow', ar: 'مختبر الغد' }, d: { en: 'A hackathon platform with holographic interfaces, where an AI assistant guides teams from idea to prototype.', ar: 'منصة هاكاثون بواجهات مجسّمة، يرافق فيها مساعد ذكي الفرق من الفكرة إلى النموذج الأولي.' } },
      { n: { en: 'Majlis of Ideas', ar: 'مجلس الأفكار' }, d: { en: 'An innovation platform inspired by the spirit of the traditional majlis, where teams meet to develop solutions rooted in the place’s identity.', ar: 'منصة ابتكار مستلهمة من روح المجالس التراثية، تلتقي فيها الفرق لتطوير حلول نابعة من هوية المكان.' } },
      { n: { en: 'Inventors’ Workshop', ar: 'ورشة المخترعين' }, d: { en: 'A playful world of colorful tools and pieces, where teams build their ideas the way toys are assembled.', ar: 'عالم مرح من الأدوات والقطع الملوّنة، تبني فيه الفرق أفكارها كما تُركَّب الألعاب.' } },
      { n: { en: 'Solutions Board', ar: 'لوحة الحلول' }, d: { en: 'A clean, organized workspace where teams track their tasks and project stages with complete clarity.', ar: 'مساحة عمل نظيفة ومنظمة، تتابع فيها الفرق مهامها ومراحل مشاريعها بوضوح تام.' } },
      { n: { en: 'Operations Room', ar: 'غرفة العمليات' }, d: { en: 'A hackathon with a secret-mission atmosphere, where teams receive challenges as mysterious files and race to solve them.', ar: 'هاكاثون بأجواء مهمة سرية، تتسلّم فيه الفرق التحديات كملفات غامضة وتتسابق لحلها.' } }
    ],
    C: [
      { n: { en: 'Gateway of Time', ar: 'بوابة الزمن' }, d: { en: 'Visitors step through a portal of light to see the place as it will look in the future.', ar: 'يعبر الزائر بوابة ضوئية ليرى المكان كما سيبدو في المستقبل.' } },
      { n: { en: 'Tale of the Place', ar: 'حكاية المكان' }, d: { en: 'A journey through the place’s ornaments and landmarks, telling its history chapter by chapter.', ar: 'رحلة بين زخارف المكان ومعالمه، تروي تاريخه فصلًا بعد فصل.' } },
      { n: { en: 'City of Tales', ar: 'مدينة الحكايات' }, d: { en: 'An illustrated world in joyful colors, where friendly characters lead visitors to the place’s secrets.', ar: 'عالم مرسوم بألوان مبهجة، تقود فيه شخصيات لطيفة الزائر إلى أسرار المكان.' } },
      { n: { en: 'Lines of the Place', ar: 'سطور المكان' }, d: { en: 'A calm visual narrative of curated images and minimal text that lets the place speak for itself.', ar: 'سرد بصري هادئ بصور مختارة ونصوص قليلة، يترك للمكان أن يتحدث بنفسه.' } },
      { n: { en: 'Secrets of the Place', ar: 'أسرار المكان' }, d: { en: 'A mysterious journey of dramatic lighting and realistic scenes, unfolding the story of the place like a documentary film.', ar: 'رحلة غامضة بإضاءة درامية ومشاهد واقعية، تتكشف فيها قصة المكان كأنها فيلم وثائقي.' } }
    ],
    D: [
      { n: { en: 'Future Launch', ar: 'إطلاق المستقبل' }, d: { en: 'The product appears as a hologram in a space of light, explored by the audience from every angle.', ar: 'يظهر المنتج مجسّمًا وسط فضاء من الضوء، ويستكشفه الجمهور من كل زاوية.' } },
      { n: { en: 'Authentic Origins', ar: 'أصالة المنتج' }, d: { en: 'The product is presented in a cultural context that connects it to the story and heritage of the place.', ar: 'يُقدَّم المنتج في سياق ثقافي يربطه بقصة المكان وموروثه.' } },
      { n: { en: 'Surprise Box', ar: 'صندوق المفاجآت' }, d: { en: 'The audience opens an interactive box and discovers the product through games and colorful surprises.', ar: 'يفتح الجمهور صندوقًا تفاعليًا ويكتشف المنتج عبر ألعاب ومفاجآت ملوّنة.' } },
      { n: { en: 'Product in Focus', ar: 'المنتج في الصدارة' }, d: { en: 'A pure, focused showcase that highlights the product’s details and features without distraction.', ar: 'عرض نقي ومركّز يُبرز تفاصيل المنتج ومزاياه دون أي مشتتات.' } },
      { n: { en: 'The Premiere', ar: 'العرض الأول' }, d: { en: 'A launch with the atmosphere of a film premiere, revealing the product gradually amid dramatic anticipation.', ar: 'إطلاق بأجواء العرض السينمائي الأول، يُكشف فيه المنتج تدريجيًا وسط ترقّب درامي.' } }
    ],
    E: [
      { n: { en: 'Mirror of the Future', ar: 'مرآة المستقبل' }, d: { en: 'A screen that turns passersby’s movements into glowing digital portraits they can capture and share instantly.', ar: 'شاشة تحوّل حركة المارّة إلى صورة رقمية مضيئة يلتقطونها ويشاركونها فورًا.' } },
      { n: { en: 'Living Mural', ar: 'جدارية حيّة' }, d: { en: 'An ornamental mural that responds to visitors’ touch, forming patterns and stories from the place’s heritage.', ar: 'جدارية زخرفية تستجيب للمس الزوار، فتتشكل منها نقوش وحكايات من تراث المكان.' } },
      { n: { en: 'Fun Wall', ar: 'جدار المرح' }, d: { en: 'A fast group-game screen where passersby compete in moments.', ar: 'شاشة ألعاب جماعية سريعة يتنافس عليها العابرون في لحظات.' } },
      { n: { en: 'Window of Light', ar: 'نافذة الضوء' }, d: { en: 'A calm screen with simple, elegant interaction that leaves a delicate visual trace with every touch.', ar: 'شاشة هادئة بتفاعل بسيط وأنيق، تترك أثرًا بصريًا رقيقًا مع كل لمسة.' } },
      { n: { en: 'Star of the Scene', ar: 'بطل المشهد' }, d: { en: 'A screen that places passersby inside an immersive cinematic scene, making them the hero of the story for a few seconds.', ar: 'شاشة تضع العابر داخل مشهد سينمائي غامر، فيصير بطل القصة لثوانٍ.' } }
    ],
    F: [
      { n: { en: 'Future Race', ar: 'سباق المستقبل' }, d: { en: 'A challenge in a neon world where participants collect points and compete for the top of a live leaderboard.', ar: 'تحدٍّ في عالم من النيون، يجمع فيه المشاركون النقاط ويتنافسون على صدارة لوحة حيّة.' } },
      { n: { en: 'Ancestors’ Treasure', ar: 'كنز الأجداد' }, d: { en: 'A treasure hunt through puzzles inspired by local heritage.', ar: 'رحلة بحث عن كنز بين ألغاز مستوحاة من التراث المحلي.' } },
      { n: { en: 'Challenge Island', ar: 'جزيرة التحديات' }, d: { en: 'A colorful game of levels and characters that turns knowledge into adventure.', ar: 'لعبة ملوّنة بمستويات وشخصيات، تتحول فيها المعرفة إلى مغامرة.' } },
      { n: { en: 'Focus Challenge', ar: 'تحدّي التركيز' }, d: { en: 'Questions and challenges in a clean design, built on speed and accuracy.', ar: 'أسئلة وتحديات بتصميم نظيف، يقوم على السرعة والدقة.' } },
      { n: { en: 'The Great Escape', ar: 'الهروب الكبير' }, d: { en: 'A challenge with a mysterious escape-room atmosphere, where participants solve puzzles before time runs out.', ar: 'تحدٍّ بأجواء غرفة هروب غامضة، يحل فيه المشاركون الألغاز قبل أن ينفد الوقت.' } }
    ]
  }
};

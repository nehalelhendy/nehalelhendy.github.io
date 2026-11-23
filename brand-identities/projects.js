/* =====================================================================
   BRAND IDENTITIES — PROJECT DATA  (the ONLY file to edit for content)
   ---------------------------------------------------------------------
   Put each project's images in its own folder:  projects/<slug>/
   then list them below. The folders and the case-study pages update by
   themselves — the folder component never needs to be touched.

   Fields per project
     slug         url + folder name (no spaces)           e.g. 'shakshoka'
     name         { en, ar }  project / brand name (kept exactly as the brand writes it)
     folderName   { en, ar }  shorter name for the folder when the full name is long (optional)
     nameLines    { en?, ar? }  the pop-up title split into lines that end at the same width (optional)
     tagline      { en, ar }  short line under the name on the folder (optional)
     description  { en, ar }  one or two short sentences   (optional)
     logo         'projects/<slug>/logo.png'               (optional — leave '' if none)
     cover        file used as the front preview           (optional — if '' the FIRST image is used; bg = colour behind a 'contain' cover)
     images       every image of the project, in the order of the case study.
                  Each entry is either a path string, or an object:
                  { src:'projects/<slug>/x.webp', alt:{en,ar}, focus:'50% 30%', fit:'cover'|'contain' }
                    focus = which part stays visible when the preview crops the image (default centre)
                    fit   = 'contain' shows the whole image inside the preview sheet (default 'cover')
     layers       how many images peek out of the folder: 1–3 (default 3)
     accent       one colour that tints the case-study glow   (optional)
     kind         { en, ar }  small yellow line above the name in the pop-up
     colors       main colours only: [{ hex:'#000000', icon:'icon-black', role:{en,ar} }]   (sampled from the real files;
                  icon = optional picture shown as the colour box, e.g. the app icon in that colour)
     fonts        [{ role:{ en:'English', ar:'إنجليزي' }, name:'Font name' }]   (names only, no specimens)
     board        the project's mood board inside the pop-up (see SHAKSHOKA as the reference):
                  items = the pictures; parts = sections from top to bottom:
                    { k:'board', d:{h,items}, m:{h,items} }  free composition, laptop (d) + phone (m)
                         each item: [index, x, y, width, tilt°, layer] in % of the section's width
                    { k:'colors' } · { k:'type' } · { k:'book', pages:[...] }  (menu / brochure that turns its pages)
                    cap:{en,ar} = section title (small, white, heading font) with a thin white line beside it
                    inline:true = title · line · content side by side, centred (otherwise: title + line on top, content centred below)
                    stack:'all'|'m' = title words one under the other (always / phones only) · ltr:true = never mirrored in Arabic
                    zoom:true on an item = tap to open it large
                    { k:'story', img, text, scope } picture + text beside it · { k:'carousel', items:[...] } automatic social-media slider
                    book bind:'top' = landscape pages bound at the top, flipping up
                  titles:'side' = titles beside the content on the laptop (two lines), above it on the phone (one line)
                    { k:'story', text } with no img = text only
                    { k:'story', text, fade:[items], lines:[{c, k, v}] } = text + one line per colour, beside a rounded square fading between images
                         (laptop: image beside all the text · phone: small image beside the colour lines)
                    { k:'grid', items:[...], d4:true } social media grid: phone 3x3; laptop (d4) 4 x 2 across the full width (one design left out at random);
                         a mauve frame jumps between designs at random and visits every design before repeating one; tap = open large
                  swatch:'rect' = colours as wide rectangles · colorsAt:'start' = colours beside their title like the fonts (centred on the phone)
                  headMax:[laptop, phone] = how big a SHORT name may grow so the title group is as tall as the logo (a Latin name keeps MuseoModerno in Arabic)
                  deco = the identity's own shapes drifting very transparent behind the board: [src, x%, y%, width%, tilt°, opacity]
                    { k:'videos', set:'<slug>' } 3D video carousel; the videos are listed in videos.js (files, HLS or Cloudflare Stream links)
                  logoRound:true = rounder corners on the header logo (برمجان المنورة)
                    { k:'story', text, scope, video:{src,poster,w,h,title} } = text beside the official video (start side), under it on the phone; tap the video = large with sound
                    { k:'phone', video:{...}, wide:true } a silent screen recording: phone frame on the phone, wide laptop screen on the laptop (zoomed to fill); plays from the start once scrolled to
                    book bindM:'top' = bound at the top on the phone only · sideAr:'w / h' = shape of the open book when it turns sideways · tight:true = less room around it
                    { k:'campaign', text, items:[...], ratio:'4 / 5' } short text above the automatic carousel (laptop one line, phone two)
                    ratio on a carousel = the designs' shape (default 9 / 16) · lite:true = no blur on the side designs on phones (smoother)
                  grid row:true = laptop: all designs in one row · phone: 2 x 2 (others very see-through, the framed one grows) · frame:'#hex' = the frame colour (Bombo's Books)
                  descAt:'title' = Arabic laptop: intro starts at the title · oneLine:'ar' = Arabic phone: name on one line, tagline close · item zi:true = zoom with the small white sign (Bombo's Books)
                  story small:true = smaller rounded square picture beside the text; on the phone the text first and the picture under it (Bombo's Books)
                  board desc2:true = laptop: the intro on two lines · capBig:true = Arabic laptop: bigger section titles · grid pairs:true = two lit at a time, then swap (laptop row: 1+3 ↔ 2+4 · phone 2x2: the diagonals) · campaign one:true = the text stays one line on the phone too (KHALAIG)
                  tagBreak:'en'|'ar'|true = on the phone the tagline breaks into two lines at the ·
                  every project gets its OWN composition — never copy another project's numbers.

   Images are never stretched: previews crop (object-fit) and the case study
   shows every image at its original aspect ratio. Recommended: .webp, max 2000px wide.
   ===================================================================== */
window.BRAND_PROJECTS = [
  {
    slug: 'shakshoka',
    name: { en: 'SHAKSHOKA', ar: 'SHAKSHOKA' },
    kind: { en: 'Brand Identity Design', ar: 'تصميم هوية بصرية' },
    tagline: { en: 'Ready-to-Cook Food', ar: 'طعام جاهز للطهي' },
    description: {
      en: 'SHAKSHOKA brings you the authentic taste of Egypt with precut, premeasured, and ready-to-cook meal kits. No more prep time.. just fresh ingredients and traditional flavors in minutes!',
      ar: 'تقدّم لك شكشوكة مذاق مصر الأصيل في وجبات جاهزة للطهي، مقطّعة مسبقًا ومجهّزة بمقاديرها المضبوطة. لا مزيد من وقت التحضير.. فقط مكونات طازجة ونكهات تقليدية في دقائق!'
    },
    logo: 'projects/shakshoka/logo.webp',
    cover: { src: 'projects/shakshoka/logo.webp', fit: 'contain' },
    images: ['projects/shakshoka/post-box.webp', 'projects/shakshoka/menu-2-who.webp', 'projects/shakshoka/post-zucchini.webp'],
    accent: '#9FCD37',
    /* main colours, sampled from the real logo; each shown as its app-icon box (icon) with the code under it */
    colors: [
      { hex: '#000000', icon: 'icon-black', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#9FCD37', icon: 'icon-green', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#FFFFFF', icon: 'icon-white', role: { en: 'Primary', ar: 'أساسي' } }
    ],
    fonts: [
      { role: { en: 'English', ar: 'إنجليزي' }, name: 'Montserrat' },
      { role: { en: 'Arabic', ar: 'عربي' }, name: 'Cairo' }
    ],
    /* the mood board, top to bottom (see the field notes at the top of this file) */
    board: {
      items: [
        { k: 'img', src: 'phone', w: 1000, h: 1014, look: 'cut', alt: { en: 'SHAKSHOKA Instagram feed on mobile', ar: 'صفحة شكشوكة على الموبايل' } }, // 0
        { k: 'img', src: 'post-box', w: 1300, h: 1619, look: 'post', zoom: true, alt: { en: 'Ad: the SHAKSHOKA meal-kit box', ar: 'إعلان صندوق شكشوكة' } }, // 1
        { k: 'img', src: 'post-zucchini', w: 1000, h: 1247, look: 'post', zoom: true, alt: { en: 'Ad: mahshi zucchini', ar: 'إعلان الكوسة' } }, // 2
        { k: 'img', src: 'post-tools', w: 1000, h: 1247, look: 'post', zoom: true, alt: { en: 'Ad: no more chopping', ar: 'إعلان: لا مزيد من التقطيع' } } // 3
      ],
      parts: [
        { k: 'colors', inline: true, stack: 'all', cap: { en: 'Color\npalette', ar: 'لوحة\nالألوان' } },
        { k: 'type', inline: true, stack: 'm', cap: { en: 'Design\nfonts', ar: 'خطوط\nالتصميم' } },
        { k: 'book', cap: { en: 'The Menu', ar: 'قائمة الطعام' }, alt: { en: 'SHAKSHOKA menu, page', ar: 'قائمة طعام شكشوكة، صفحة' },
          pages: ['menu-1-cover', 'menu-2-who', 'menu-3-freezer', 'menu-4-stuffed', 'menu-5-grill', 'menu-6-back'] },
        /* ltr: never mirrored. Laptop: phone on the right, ads side by side on the left. Phone: the phone alone in the centre, the 3 ads under it */
        { k: 'board', ltr: true, cap: { en: 'Social Media', ar: 'التواصل الاجتماعي' },
          d: { h: 38, items: [[1, 2, 7, 18, -3, 1], [2, 21, 4, 18, 2, 2], [3, 40, 8, 18, -2, 1], [0, 62, 0, 36, 0, 1]] },
          m: { h: 110, items: [[0, 18, 0, 64, 0, 1], [1, 1, 68, 30, -3, 1], [2, 35, 66, 30, 1, 2], [3, 69, 69, 30, 3, 1]] } }
      ]
    }
  },
  {
    slug: 'speak-up',
    name: { en: 'SpeakUp', ar: 'SpeakUp' },
    kind: { en: 'Brand Identity Design', ar: 'تصميم هوية بصرية' },
    tagline: { en: 'Speech Therapy Center', ar: 'مركز تأهيل اضطرابات النطق والكلام' },
    description: {
      en: 'A vibrant visual identity and creative campaign for a speech therapy center, promoting communication, learning, and child development.',
      ar: 'هوية بصرية وحملة إبداعية لمركز متخصص في علاج اضطرابات اللغة والتواصل، تعكس رحلة الأطفال نحو التعبير والتطور.'
    },
    /* the official logo = the round badge (header + folder front) */
    logo: 'projects/speak-up/logo.webp',
    cover: { src: 'projects/speak-up/logo.webp', fit: 'contain' },
    images: ['projects/speak-up/post-2.webp', 'projects/speak-up/prints.webp', 'projects/speak-up/post-6.webp'],
    accent: '#8539B9',
    /* main colours, from her brand board */
    colors: [
      { hex: '#8539B9', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#F9CE0A', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#88D83A', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#5CE1E5', role: { en: 'Primary', ar: 'أساسي' } }
    ],
    fonts: [
      { role: { en: 'English', ar: 'إنجليزي' }, name: 'Handy Casual' },
      { role: { en: 'Arabic', ar: 'عربي' }, name: 'TS Tarek' }
    ],
    board: {
      titles: 'side',
      head: 'compact',
      swatch: 'rect',   /* colours as rectangles, like her brand board */
      headMax: [110, 64],   /* short name: the title may grow until the group is as tall as the round logo */
      colorsAt: 'start',   /* colours beside their title like the fonts (phone: centred) */
      items: [
        { k: 'img', src: 'prints', w: 1600, h: 622, look: 'flat', zoom: true, alt: { en: 'ID badge, mug and business cards', ar: 'بطاقة التعريف والكوب وبطاقات الأعمال' } }, // 0
        { k: 'img', src: 'post-1', w: 1100, h: 1100, alt: { en: 'Post: ear infections and speech', ar: 'منشور: التهابات الأذن وتأثيرها على الكلام' } }, // 1
        { k: 'img', src: 'post-2', w: 1100, h: 1100, alt: { en: 'Post: does my child need speech therapy?', ar: 'منشور: هل يحتاج طفلي إلى جلسات تخاطب؟' } }, // 2
        { k: 'img', src: 'post-3', w: 1100, h: 1100, alt: { en: 'Post: TalkTools oral training', ar: 'منشور: تدريب أعضاء النطق بأدوات TalkTools' } }, // 3
        { k: 'img', src: 'post-4', w: 1100, h: 1100, alt: { en: 'Post: language starts before birth', ar: 'منشور: تبدأ لغة طفلك قبل ولادته' } }, // 4
        { k: 'img', src: 'post-5', w: 1100, h: 1100, alt: { en: 'Post: successful therapy sessions', ar: 'منشور: جلسات تخاطب ناجحة' } }, // 5
        { k: 'img', src: 'post-6', w: 1100, h: 1100, alt: { en: 'Post: a positive environment', ar: 'منشور: البيئة الإيجابية' } }, // 6
        { k: 'img', src: 'post-7', w: 1100, h: 1100, alt: { en: 'Post: emotional support', ar: 'منشور: الدعم النفسي' } }, // 7
        { k: 'img', src: 'post-8', w: 1100, h: 1100, alt: { en: 'Post: stages of language development', ar: 'منشور: مراحل التطور اللغوي' } }, // 8
        { k: 'img', src: 'post-9', w: 1100, h: 1100, alt: { en: 'Post: tongue-tie', ar: 'منشور: مشكلة ربط اللسان' } }, // 9
        { k: 'img', src: 'ad-1', w: 900, h: 900 }, // 10  art direction: green
        { k: 'img', src: 'ad-2', w: 900, h: 900 }, // 11  yellow
        { k: 'img', src: 'ad-3', w: 900, h: 900 }, // 12  purple
        { k: 'img', src: 'ad-4', w: 900, h: 900 }  // 13  turquoise
      ],
      parts: [
        { k: 'colors', cap: { en: 'Color\npalette', ar: 'لوحة\nالألوان' } },
        { k: 'type', cap: { en: 'Design\nfonts', ar: 'خطوط\nالتصميم' } },
        /* Art Direction: intro + one line per colour, beside a rounded square that fades between 4 images */
        { k: 'story', cap: { en: 'Art\nDirection', ar: 'الاتجاه\nالفني' }, fade: [10, 11, 12, 13],
          text: {
            en: 'A vibrant, multi-color palette was chosen to reflect the center’s vision of creating a comprehensive therapeutic environment, where each color represents a core value:',
            ar: 'تم اختيار لوحة ألوان متعددة لتعكس رؤية المركز في خلق بيئة علاجية شاملة، حيث يعبّر كل لون عن قيمة أساسية:'
          },
          lines: [
            { c: '#B57BE8', k: { en: 'Purple', ar: 'البنفسجي' }, v: { en: 'Creativity & imagination.', ar: 'الإبداع والخيال.' } },
            { c: '#F9CE0A', k: { en: 'Yellow', ar: 'الأصفر' }, v: { en: 'Hope & optimism.', ar: 'الأمل والتفاؤل.' } },
            { c: '#88D83A', k: { en: 'Green', ar: 'الأخضر' }, v: { en: 'Growth & development.', ar: 'النمو والتطور.' } },
            { c: '#5CE1E5', k: { en: 'Turquoise', ar: 'الفيروزي' }, v: { en: 'Communication & calmness.', ar: 'التواصل والهدوء.' } }
          ] },
        { k: 'board', cap: { en: 'Print\nMaterials', ar: 'المواد\nالمطبوعة' },
          d: { h: 32, items: [[0, 9, 0, 82, 0, 1]] },
          m: { h: 30, items: [[0, 11, 0, 78, 0, 1]] } },
        /* social media: phone = 3x3 grid · laptop (d4) = 4 x 2 across the full width, one design left out at random;
           the mauve frame jumps at random but visits every design before repeating one */
        { k: 'grid', d4: true, items: [5, 1, 3, 4, 2, 7, 6, 8, 9], cap: { en: 'Social\nMedia', ar: 'التواصل\nالاجتماعي' } },
        /* campaign videos: 3D carousel that turns by itself (the list lives in videos.js) */
        { k: 'videos', set: 'speak-up', cap: { en: 'Campaign\nVideos', ar: 'فيديوهات\nالحملة' } }
      ]
    }
  },
  {
    slug: 'gov-hackathon',
    name: { en: 'Government Innovation Hackathon', ar: 'هاكاثون الابتكار في الخدمات الحكومية' },
    folderName: { en: 'Innovation Hackathon', ar: 'هاكاثون الابتكار' },   // shorter name on the folder only
    nameLines: { ar: ['هاكاثون الابتكار في', 'الخدمات الحكومية'] },   // pop-up title in lines of equal width (the shorter line is enlarged)
    kind: { en: 'Brand Identity Design', ar: 'تصميم هوية بصرية' },
    tagline: { en: 'Al Baha · 2025', ar: 'الباحة 2025' },
    description: {
      en: 'A complete visual identity and interactive experience for a virtual government innovation hackathon, bringing together three government entities to shape the future of digital services.',
      ar: 'هوية بصرية وتجربة تفاعلية متكاملة لهاكاثون الابتكار الحكومي الافتراضي، تجمع ثلاث جهات حكومية لاستشراف مستقبل الخدمات الرقمية.'
    },
    /* the official logo = the one on the beige background (header + folder front) */
    logo: 'projects/gov-hackathon/logo-square.webp',
    cover: { src: 'projects/gov-hackathon/logo-square.webp', fit: 'contain' },
    images: ['projects/gov-hackathon/post-3.webp', 'projects/gov-hackathon/certificate.webp', 'projects/gov-hackathon/post-1.webp'],
    accent: '#3AB666',
    /* main colours, from her identity sheet */
    colors: [
      { hex: '#01645E', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#3AB666', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#C3E956', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#8B7632', role: { en: 'Primary', ar: 'أساسي' } }
    ],
    fonts: [
      { role: { en: 'English', ar: 'إنجليزي' }, name: 'Garet' },
      { role: { en: 'Arabic', ar: 'عربي' }, name: 'GE SS Two' }
    ],
    board: {
      /* titles: laptop = beside the content on two lines · phone = above the content on one line */
      titles: 'side',
      head: 'compact',   /* title as tall as the logo beside it */
      /* the identity's own arrows, very transparent, drifting slowly behind the board: [src, x%, y% of the board height, width % of the board, tilt°, opacity] */
      deco: [['el-star', 84, 4, 15, 12, .1], ['el-arrows', -6, 17, 22, -8, .08], ['el-star', -4, 41, 12, -20, .09],
             ['el-arrows', 82, 57, 20, 172, .08], ['el-star', 88, 79, 11, 30, .09], ['el-arrows', -5, 90, 18, 4, .07]],
      items: [
        { k: 'img', src: 'logo-square', w: 800, h: 808, look: 'cut', alt: { en: 'The hackathon logo', ar: 'شعار الهاكاثون' } }, // 0
        { k: 'img', src: 'logo-backgrounds', w: 663, h: 155, look: 'card', alt: { en: 'The logo on three backgrounds', ar: 'الشعار على ثلاث خلفيات' } }, // 1
        { k: 'img', src: 'presentation-cover', w: 1600, h: 900, look: 'card', zoom: true, alt: { en: 'Presentation cover', ar: 'غلاف العرض التقديمي' } }, // 2
        { k: 'img', src: 'certificate', w: 1800, h: 1273, look: 'card', zoom: true, alt: { en: 'First-place certificate', ar: 'شهادة تقدير المركز الأول' } }, // 3
        { k: 'img', src: 'post-1', w: 1000, h: 1778, alt: { en: 'Story: register now', ar: 'قصة: سجّل الآن' } }, // 4
        { k: 'img', src: 'post-2', w: 1000, h: 1778, alt: { en: 'Story: Al Baha heritage village', ar: 'قصة: قرية الباحة التراثية' } }, // 5
        { k: 'img', src: 'post-3', w: 1000, h: 1778, alt: { en: 'Story: heritage meets the city', ar: 'قصة: التراث والمدينة' } }, // 6
        { k: 'img', src: 'post-4', w: 1000, h: 1778, alt: { en: 'Story: the virtual hackathon', ar: 'قصة: الهاكاثون الافتراضي' } }, // 7
        { k: 'img', src: 'logo-concept', w: 1400, h: 933, look: 'card', zoom: true, alt: { en: 'How the logo was built: a palm made of three arrows', ar: 'فكرة الشعار: نخلة من ثلاثة أسهم' } }, // 8
        { k: 'img', src: 'partners', w: 992, h: 335, look: 'flat', alt: { en: 'Al Baha Region Principality, General Directorate of Passports, Civil Defense', ar: 'إمارة منطقة الباحة، المديرية العامة للجوازات، الدفاع المدني' } } // 9
      ],
      parts: [
        { k: 'board', cap: { en: 'Logo\nVariations', ar: 'الشعار\nوتنويعاته' },
          d: { h: 15, items: [[1, 20, 0, 60, 0, 1]] },
          m: { h: 24, items: [[1, 0, 0, 100, 0, 1]] } },
        { k: 'colors', cap: { en: 'Color\npalette', ar: 'لوحة\nالألوان' } },
        { k: 'type', cap: { en: 'Design\nfonts', ar: 'خطوط\nالتصميم' } },
        { k: 'story', img: 8, cap: { en: 'Art\nDirection', ar: 'الاتجاه\nالفني' },
          text: {
            en: 'A modern Saudi-inspired visual direction blending Al Baha’s cultural heritage with digital innovation, using geometric arrows, symbolic elements, and a vibrant green palette.',
            ar: 'اتجاه فني يجمع بين التراث السعودي لمنطقة الباحة والابتكار الرقمي، من خلال الأسهم الهندسية والعناصر الرمزية وتدرجات الأخضر الحيوية.'
          },
          scope: { en: ['Visual Identity', 'Campaigns', 'Training Materials', 'Interactive Experience'], ar: ['الهوية البصرية', 'الحملات', 'المواد التدريبية', 'التجربة التفاعلية'] },
          scopeT: { en: 'Design Scope', ar: 'نطاق التصميم' } },
        { k: 'board', cap: { en: 'Training\nMaterials', ar: 'المواد\nالتدريبية' },
          d: { h: 31, items: [[2, 10, 4, 40, -2, 1], [3, 46, 0, 37, 2.5, 2]] },
          m: { h: 80, items: [[2, 6, 0, 64, -2, 1], [3, 30, 34, 62, 2.5, 2]] } },
        /* the guide booklet: landscape pages, so it is bound at the top and its pages flip up */
        { k: 'book', bind: 'top', cap: { en: 'Guide\nBooklet', ar: 'الكتيب\nالاسترشادي' }, alt: { en: 'Hackathon guide booklet, page', ar: 'الكتيب الاسترشادي، صفحة' },
          pages: ['guide-1', 'guide-2', 'guide-3', 'guide-4', 'guide-5', 'guide-6'] },
        /* social media: an automatic carousel, the middle design large, two smaller see-through ones behind it */
        { k: 'carousel', items: [6, 4, 5, 7], cap: { en: 'Social\nMedia', ar: 'التواصل\nالاجتماعي' } },
        /* the three government entities (the clients), small, in white */
        { k: 'board', cap: { en: 'Partner\nEntities', ar: 'الجهات\nالمشتركة' },
          d: { h: 12, items: [[9, 32, 0, 36, 0, 1]] },
          m: { h: 26, items: [[9, 12, 0, 76, 0, 1]] } }
      ]
    }
  },
  {
    slug: 'barmajan-almonawara',
    name: { en: 'Hackathon Almonawara 2026', ar: 'برمجان المنورة 2026' },
    kind: { en: 'Brand Identity Design', ar: 'تصميم هوية بصرية' },
    tagline: { en: 'Innovation Hackathon · Madinah', ar: 'هاكاثون ابتكار · المدينة المنورة' },
    tagBreak: 'en',   /* phone, English: the tagline breaks into two lines at the · */
    description: {
      en: 'A futuristic hackathon identity inspired by Madinah’s legacy of light, connecting cultural heritage with digital innovation.',
      ar: 'هوية بصرية لهاكاثون يستلهم نور المدينة المنورة وتراثها، ويربط الأصالة بالابتكار والتحول الرقمي.'
    },
    /* the official logo = the square artwork (header + folder front) */
    logo: 'projects/barmajan-almonawara/logo-square.webp',
    cover: { src: 'projects/barmajan-almonawara/logo-square.webp', fit: 'contain', bg: 'linear-gradient(#011A38,#091211 50%,#151515)' },   /* bg = the logo's own dark edges, so no white strips beside it */
    images: ['projects/barmajan-almonawara/post-3.webp', 'projects/barmajan-almonawara/guide-01.webp', 'projects/barmajan-almonawara/post-1.webp'],
    accent: '#20911D',
    /* main colours, from her colour-palette slide (Saudi Green, Radiant Gold, Deep Cyan) + navy instead of the violet */
    colors: [
      { hex: '#20911D', role: { en: 'Saudi Green', ar: 'الأخضر السعودي' } },
      { hex: '#A38465', role: { en: 'Radiant Gold', ar: 'الذهبي المتوهج' } },
      { hex: '#00C3D5', role: { en: 'Deep Cyan', ar: 'السماوي العميق' } },
      { hex: '#0B2150', role: { en: 'Navy', ar: 'الكحلي' } }
    ],
    fonts: [
      { role: { en: 'English', ar: 'إنجليزي' }, name: '29LT Bukra' },
      { role: { en: 'Arabic', ar: 'عربي' }, name: '29LT Bukra' }
    ],
    board: {
      titles: 'side',
      head: 'compact',
      headMax: [64, 40],
      colorsAt: 'start',   /* colours beside their title like the fonts (phone: centred) */
      logoRound: true,     /* rounder corners on the header logo */
      items: [
        { k: 'img', src: 'post-1', w: 1100, h: 1375, alt: { en: 'Post: the innovation journey begins', ar: 'منشور: بدأت رحلة الابتكار' } }, // 0
        { k: 'img', src: 'post-2', w: 1100, h: 1375, alt: { en: 'Post: registration opens tomorrow', ar: 'منشور: موعدنا غدًا مع فتح باب التسجيل' } }, // 1
        { k: 'img', src: 'post-3', w: 1100, h: 1375, alt: { en: 'Post: registration is open', ar: 'منشور: باب التسجيل مفتوح الآن' } }, // 2
        { k: 'img', src: 'post-4', w: 1100, h: 1375, alt: { en: 'Post: last reminder', ar: 'منشور: تذكير أخير' } }, // 3
        { k: 'img', src: 'post-5', w: 1100, h: 1375, alt: { en: 'Post: registration complete', ar: 'منشور: اكتمل التسجيل' } }, // 4
        { k: 'img', src: 'post-6', w: 1100, h: 1375, alt: { en: 'Post: today the story begins', ar: 'منشور: اليوم تبدأ الحكاية' } }, // 5
        { k: 'img', src: 'post-7', w: 1100, h: 1375, alt: { en: 'Post: the closing ceremony', ar: 'منشور: الحفل الختامي' } } // 6
      ],
      parts: [
        { k: 'colors', cap: { en: 'Color\npalette', ar: 'لوحة\nالألوان' } },
        { k: 'type', cap: { en: 'Design\nfonts', ar: 'خطوط\nالتصميم' } },
        /* Art Direction: text + design scope, with the official campaign video beside it (start side: left in English, right in Arabic), under it on the phone */
        { k: 'story', cap: { en: 'Art\nDirection', ar: 'الاتجاه\nالفني' },
          text: {
            en: 'Futuristic Tech Aesthetic, blending cinematic cityscapes, glowing fiber-optic trails, 3D environments, and Islamic architectural elements.',
            ar: 'اتجاه فني تقني مستقبلي يمزج المشاهد السينمائية للمدينة، ومسارات الألياف الضوئية المتوهجة، والبيئات ثلاثية الأبعاد، والعناصر المعمارية الإسلامية.'
          },
          scope: { en: ['Visual Identity', 'Website Design', 'Campaigns', 'Training Materials', 'Interactive Experience'], ar: ['الهوية البصرية', 'تصميم الموقع', 'الحملات', 'المواد التدريبية', 'التجربة التفاعلية'] },
          scopeT: { en: 'Design Scope', ar: 'نطاق التصميم' },
          video: { src: 'projects/barmajan-almonawara/videos/campaign.mp4', poster: 'projects/barmajan-almonawara/videos/campaign.webp', w: 720, h: 1280, title: { en: 'Official campaign video', ar: 'الفيديو الرسمي للحملة' } } },
        /* the official website: a silent screen recording — a phone frame on the phone, a wide laptop screen on the laptop (zoomed to fill, top of the recording kept) */
        { k: 'phone', wide: true, cap: { en: 'Official\nWebsite', ar: 'الموقع\nالرسمي' },
          video: { src: 'projects/barmajan-almonawara/videos/website.mp4', poster: 'projects/barmajan-almonawara/videos/website.webp', w: 720, h: 1282, title: { en: 'The official website, screen recording', ar: 'تسجيل شاشة للموقع الرسمي' } } },
        /* the participants' guide: laptop = pages turn sideways (two landscape pages side by side) · phone = bound at the top, flipping up */
        { k: 'book', bindM: 'top', sideAr: '2800 / 788', tight: true, cap: { en: 'Print\nMaterials', ar: 'المطبوعات' }, alt: { en: 'Participant guide, page', ar: 'كتيب المشاركين، صفحة' },
          pages: ['guide-01', 'guide-02', 'guide-03', 'guide-04', 'guide-05', 'guide-06', 'guide-07', 'guide-08', 'guide-09', 'guide-10', 'guide-11', 'guide-12', 'guide-13', 'guide-14', 'guide-15', 'guide-16',
                  'guide-17', 'guide-18', 'guide-19', 'guide-20', 'guide-21', 'guide-22', 'guide-23', 'guide-24', 'guide-25', 'guide-26', 'guide-27', 'guide-28', 'guide-29', 'guide-30', 'guide-31'] },
        /* the campaign: short text above the designs' carousel (laptop: one line · phone: two lines), the carousel centred */
        { k: 'campaign', cap: { en: 'Promotional\nCampaign', ar: 'الحملة\nالدعائية' }, ratio: '4 / 5', lite: true, items: [0, 1, 2, 3, 4, 5, 6],
          text: {
            en: 'A 10-day promotional campaign on the official page of the Madinah Region Principality.',
            ar: 'حملة دعائية لمدة 10 أيام على الصفحة الرسمية لإمارة منطقة المدينة المنورة.'
          } }
      ]
    }
  },
  {
    slug: 'bombos-books',
    name: { en: "Bombo's Books", ar: 'كتب بومبو' },
    kind: { en: 'Brand Identity Design', ar: 'تصميم هوية بصرية' },
    tagline: { en: "Children's Books", ar: 'كتب أطفال' },
    description: {
      en: "A playful children's book brand that turns reading into a colorful world of imagination and discovery.",
      ar: 'هوية لعلامة كتب أطفال تحوّل القراءة إلى عالم مليء بالمرح والخيال والاكتشاف.'
    },
    /* the official logo = the round badge (header) · the square logo on the doodle pattern = folder front + Art Direction */
    logo: 'projects/bombos-books/logo.webp',
    cover: { src: 'projects/bombos-books/logo-square.webp', fit: 'contain' },
    images: ['projects/bombos-books/post-1.webp', 'projects/bombos-books/product-books.webp', 'projects/bombos-books/post-3.webp'],
    accent: '#4DBFFF',
    /* main colours, from her brand board */
    colors: [
      { hex: '#222222', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#FFDE59', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#4DBFFF', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#FF1053', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#C9D93B', role: { en: 'Primary', ar: 'أساسي' } }
    ],
    fonts: [
      { role: { en: 'English', ar: 'إنجليزي' }, name: 'Amber Kai' },
      { role: { en: 'Arabic', ar: 'عربي' }, name: 'Tufuli Arabic' }
    ],
    board: {
      titles: 'side',
      head: 'compact',
      swatch: 'rect',      /* colours as rectangles, like her brand board */
      colorsAt: 'start',   /* colours beside their title like the fonts (phone: centred) */
      headMax: [96, 56],
      descAt: 'title',     /* Arabic laptop: the intro starts where the title starts */
      oneLine: 'ar',       /* Arabic phone: «كتب بومبو» on one line, tagline close under it */
      items: [
        { k: 'img', src: 'logo-square', w: 1200, h: 1200, look: 'card', zoom: true, alt: { en: "The Bombo's Books logo on the doodle pattern", ar: 'شعار كتب بومبو على النمط المزخرف' } }, // 0
        { k: 'img', src: 'product-box', w: 1100, h: 980, look: 'cut', zoom: true, zi: true, alt: { en: 'The gift box', ar: 'صندوق الهدايا' } }, // 1
        { k: 'img', src: 'product-books', w: 970, h: 989, look: 'cut', zoom: true, zi: true, alt: { en: "Bombo's first library: the book set", ar: 'مكتبة بومبو الأولى' } }, // 2
        { k: 'img', src: 'product-tin', w: 1012, h: 1021, look: 'cut', zoom: true, zi: true, alt: { en: 'The tin', ar: 'العلبة المعدنية' } }, // 3
        { k: 'img', src: 'post-1', w: 1100, h: 1375, alt: { en: 'Ad: Bombo in the school bag', ar: 'إعلان: بومبو في حقيبة المدرسة' } }, // 4
        { k: 'img', src: 'post-2', w: 1100, h: 1375, alt: { en: 'Ad: a different way to learn', ar: 'إعلان: تعليم مختلف' } }, // 5
        { k: 'img', src: 'post-3', w: 1100, h: 1375, alt: { en: 'Ad: a hug for Bombo', ar: 'إعلان: عناق بومبو' } }, // 6
        { k: 'img', src: 'post-4', w: 1100, h: 1375, alt: { en: 'Ad: sweet moments', ar: 'إعلان: أوقات جميلة' } } // 7
      ],
      parts: [
        { k: 'colors', cap: { en: 'Color\npalette', ar: 'لوحة\nالألوان' } },
        { k: 'type', cap: { en: 'Design\nfonts', ar: 'خطوط\nالتصميم' } },
        /* Art Direction: the square logo beside the text (under it on the phone) */
        { k: 'story', img: 0, small: true, cap: { en: 'Art\nDirection', ar: 'الاتجاه\nالفني' },
          text: {
            en: 'Bold cartoon illustrations, playful typography, vibrant colors, and friendly character-led visuals.',
            ar: 'أسلوب كرتوني مرح، برسومات شخصيات ودودة، وخطوط جريئة، وألوان زاهية تعكس عالم الطفولة والخيال.'
          } },
        /* products: side by side on the laptop, one under the other on the phone */
        { k: 'board', cap: { en: 'Products', ar: 'المنتجات' },
          d: { h: 30, items: [[1, 1, 2, 31, 0, 1], [2, 35, 0, 29, 0, 1], [3, 67, 0, 30, 0, 1]] },
          m: { h: 172, items: [[1, 22, 0, 56, 0, 1], [2, 22, 55, 56, 0, 1], [3, 22, 115, 56, 0, 1]] } },
        /* the campaign: laptop = the 4 ads in one row · phone = 2 x 2; a turquoise frame moves at random (every ad before any repeats) */
        { k: 'grid', row: true, frame: '#27F6C5', items: [4, 5, 6, 7], cap: { en: 'Promotional\nCampaign', ar: 'الحملة\nالدعائية' } }
      ]
    }
  },
  {
    slug: 'khalaig',
    name: { en: 'KHALAIG', ar: 'خلايج' },
    kind: { en: 'Brand Identity Design', ar: 'تصميم هوية بصرية' },
    tagline: { en: "Egyptian Women's Clothing", ar: 'أزياء نسائية مصرية' },
    description: {
      en: 'A fashion brand blending Egyptian folklore with contemporary modest wear, celebrating cultural identity through modern style.',
      ar: 'علامة أزياء تمزج بين الفلكلور والتراث المصري والموضة العصرية، لتقدّم هوية مميزة للملابس المحتشمة.'
    },
    /* the official logo = the square logo on the navy velvet (header + folder front) */
    logo: 'projects/khalaig/logo.webp',
    cover: { src: 'projects/khalaig/logo.webp', fit: 'contain', bg: '#061E2C' },   /* bg = the logo's own dark edges */
    images: ['projects/khalaig/post-1.webp', 'projects/khalaig/pack-tote.webp', 'projects/khalaig/post-3.webp'],
    accent: '#B92A1C',
    /* main colours, from her brand board (top row + bottom row) */
    colors: [
      { hex: '#095970', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#06273A', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#B92A1C', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#6B120C', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#D3A43A', role: { en: 'Primary', ar: 'أساسي' } },
      { hex: '#FAD749', role: { en: 'Primary', ar: 'أساسي' } }
    ],
    fonts: [
      { role: { en: 'English', ar: 'إنجليزي' }, name: 'Helvetica' },
      { role: { en: 'Arabic', ar: 'عربي' }, name: 'Arial' }
    ],
    board: {
      titles: 'side',
      head: 'compact',
      swatch: 'rect',      /* colours as rectangles, like her brand board */
      colorsAt: 'start',   /* colours beside their title like the fonts (phone: centred) */
      headMax: [110, 64],
      descAt: 'title',     /* Arabic laptop: the intro starts where the title starts */
      oneLine: 'ar',       /* Arabic phone: «خلايج» on one line, tagline close under it */
      desc2: true,         /* laptop: the intro on two lines */
      capBig: true,        /* Arabic laptop: bigger section titles */
      items: [
        { k: 'img', src: 'art-direction', w: 1400, h: 1401, look: 'card', zoom: true, alt: { en: 'The logo in the brand colors, with the folk patterns', ar: 'الشعار بألوان الهوية مع النقوش الفلكلورية' } }, // 0
        { k: 'img', src: 'pack-tag', w: 1100, h: 1100, alt: { en: 'Hang tag on denim', ar: 'بطاقة المنتج على الجينز' } }, // 1
        { k: 'img', src: 'pack-bag', w: 1100, h: 1100, alt: { en: 'Kraft shopping bag', ar: 'حقيبة التسوق الورقية' } }, // 2
        { k: 'img', src: 'pack-tote', w: 1100, h: 1100, alt: { en: 'Tote bag', ar: 'الحقيبة القماشية' } }, // 3
        { k: 'img', src: 'pack-tshirt', w: 1100, h: 1100, alt: { en: 'Hang tag on a T-shirt', ar: 'بطاقة المنتج على القميص القطني' } }, // 4
        { k: 'img', src: 'post-1', w: 1100, h: 1375, alt: { en: 'Campaign: embroidered vest (blue)', ar: 'الحملة: الصديري المطرّز (أزرق)' } }, // 5
        { k: 'img', src: 'post-2', w: 1100, h: 1375, alt: { en: 'Campaign: floral blazer (red)', ar: 'الحملة: البليزر المورّد (أحمر)' } }, // 6
        { k: 'img', src: 'post-3', w: 1100, h: 1375, alt: { en: 'Campaign: printed poncho (yellow)', ar: 'الحملة: البونشو المطبوع (أصفر)' } }, // 7
        { k: 'img', src: 'post-4', w: 1100, h: 1375, alt: { en: 'Campaign: pink jacket (blue)', ar: 'الحملة: السترة الفوشيا (أزرق)' } }, // 8
        { k: 'img', src: 'post-5', w: 1100, h: 1375, alt: { en: 'Campaign: beaded abaya (red)', ar: 'الحملة: العباية المطرّزة بالخرز (أحمر)' } }, // 9
        { k: 'img', src: 'post-6', w: 1100, h: 1375, alt: { en: 'Campaign: quilted vest (yellow)', ar: 'الحملة: الصديري المبطّن (أصفر)' } } // 10
      ],
      parts: [
        { k: 'colors', cap: { en: 'Color\npalette', ar: 'لوحة\nالألوان' } },
        { k: 'type', cap: { en: 'Design\nfonts', ar: 'خطوط\nالتصميم' } },
        /* Art Direction: the square logo-colours picture beside the text (under it on the phone) */
        { k: 'story', img: 0, small: true, cap: { en: 'Art\nDirection', ar: 'الاتجاه\nالفني' },
          text: {
            en: 'Contemporary Egyptian Folk Art, Heritage-inspired Typography & Bold Cultural Patterns.',
            ar: 'فن شعبي مصري معاصر، وخطوط طباعية مستوحاة من التراث، ونقوش فلكلورية جريئة.'
          } },
        /* branding: laptop = the 4 in one row · phone = 2 x 2; two lit with a dark-red frame, two see-through, then they swap
           (laptop: 1st + 3rd ↔ 2nd + 4th · phone: the two diagonals) */
        { k: 'grid', row: true, pairs: true, frame: '#6B120C', items: [1, 2, 3, 4], cap: { en: 'Branding', ar: 'العلامة\nالتجارية' } },
        /* the campaign: one line above the automatic carousel (blue → red → yellow, again and again) */
        { k: 'campaign', one: true, cap: { en: 'Promotional\nCampaign', ar: 'الحملة\nالدعائية' }, ratio: '4 / 5', lite: true, items: [5, 6, 7, 8, 9, 10],
          text: {
            en: 'The ads were designed using AI-generated models.',
            ar: 'تم تصميم الإعلانات باستخدام عارضات من الذكاء الاصطناعي.'
          } }
      ]
    }
  }
];

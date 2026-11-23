/* =====================================================================
   HERO STAGE — the ONE shared anchor point of the hero.
   The fingertip, the touch point on the screen, the flash and the centre
   of the energy sphere are all placed on the same point: the exact centre
   of the hero box (50% / 50%), measured from the hero itself (not the viewport).
   Sizes of the hand and the screen are computed from the hero's real size,
   keeping each image's own aspect ratio (never stretched).
   ===================================================================== */
(function () {
  'use strict';

  /* Points measured on Nehal's original images (in their own pixels). */
  var HAND = {
    w: 1995, h: 788,
    tip: { x: 1640, y: 132 }      // the index fingertip (right-most point of the hand)
    // the cut wrist is the image's left edge (x = 0): it must always stay outside the hero
  };
  var SCREEN = {
    w: 1536, h: 1024,
    right: 1412,                  // the screen's right-most pixel (its frame)
    touch: { x: 490, y: 500 }     // the point on the glass the fingertip touches (just inside the left frame) — fine-tuned in PHASE 03
  };

  /* Returns where everything sits for the hero's current size.
     All values are in CSS pixels, relative to the hero's top-left corner. */
  function measure(hero) {
    var W = hero.clientWidth, H = hero.clientHeight;
    var ax = W / 2, ay = H / 2;                                   // the shared anchor

    // the hand keeps its size (balanced as before): it depends on this reference width
    var fitRight = (W / 2 - W * 0.03) / ((SCREEN.right - SCREEN.touch.x) / SCREEN.w);   // widest the screen can be and stay whole
    var refW = Math.min(fitRight, H * 0.78);
    var handW = Math.max(refW * 1.35, (ax + W * 0.04) / (HAND.tip.x / HAND.w));       // its cut wrist always past the left edge
    var handS = handW / HAND.w;
    // screen: much bigger than the hand's reference, filling the other half of the hero (its far right side may
    // pass the hero's right edge, like Nehal's mock-up; the touch point never moves)
    var screenW = Math.min(fitRight * 1.7, H * 1.45);                                 // much bigger: it may run past the right edge
    var screenS = screenW / SCREEN.w;

    return {
      W: W, H: H, ax: ax, ay: ay,
      hand: {   // top-left of the image so that its fingertip lands on the anchor
        w: handW, h: HAND.h * handS,
        x: ax - HAND.tip.x * handS, y: ay - HAND.tip.y * handS
      },
      screen: { // top-left of the image so that its touch point lands on the anchor
        w: screenW, h: SCREEN.h * screenS,
        x: ax - SCREEN.touch.x * screenS, y: ay - SCREEN.touch.y * screenS
      }
    };
  }

  window.IEStage = { HAND: HAND, SCREEN: SCREEN, measure: measure };
})();

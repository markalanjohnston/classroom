// =============================================================================
// MickeyScreen.jsx
// =============================================================================
// A React Native / Expo app that recreates a CMU CS Academy Python project.
//
// ORIGINAL PROJECT CONCEPT:
//   The CMU project drew two versions of Mickey Mouse stacked on top of each
//   other — a "retro" black-and-white Mickey on top, and a "modern" colorful
//   Mickey underneath. Clicking any retro body part removed it, revealing the
//   modern version piece by piece.
//
// HOW THIS PORT WORKS:
//   - React Native doesn't have a drawing canvas like CMU Graphics, so we
//     simulate shapes using <View> components with borderRadius (for ovals)
//     and plain rectangles (for blocks).
//   - The original CMU canvas was 400x400 pixels. Here, we measure the actual
//     screen size at runtime and scale everything proportionally so the drawing
//     fits any device or preview window.
//   - "Tapping" replaces "clicking" for mobile interaction.
//   - A Reset button restores the retro overlay so students can tap again.
//
// REACT NATIVE CONCEPTS USED:
//   - React.Component class  — the base class for stateful components
//   - this.state / setState  — storing and updating component data
//   - onLayout               — measuring a View's actual pixel dimensions
//   - StyleSheet.create      — defining reusable styles
//   - TouchableWithoutFeedback — detects taps without a visual ripple effect
//   - TouchableOpacity       — detects taps WITH a visual fade effect (button)
//   - AppRegistry            — required entry point for CodeHS / Expo
// =============================================================================

import React from 'react';
import {
  AppRegistry,          // Registers the root component so Expo knows what to render
  View,                 // The basic building block — like a <div> in HTML
  StyleSheet,           // Used to define and organize styles efficiently
  TouchableWithoutFeedback, // Makes any View respond to taps (no visual feedback)
  TouchableOpacity,     // Makes any View respond to taps (fades slightly on press)
  Text,                 // Displays text on screen
} from 'react-native';


// =============================================================================
// HELPER COMPONENT: Oval
// =============================================================================
// In CMU Graphics, Oval(cx, cy, width, height) draws an ellipse centered at
// (cx, cy). React Native doesn't have a built-in oval, but we can fake one
// by making a rectangle and setting borderRadius large enough to make it round.
//
// Props:
//   sc    — the scale function, converts CMU coords to screen pixels
//   cx    — center X position in CMU coordinates (0-400)
//   cy    — center Y position in CMU coordinates (0-400)
//   w     — total width in CMU coordinates
//   h     — total height in CMU coordinates
//   color — fill color (default: 'black')
//   borderColor — outline color (default: transparent/none)
//   borderWidth — outline thickness in CMU units (default: 0)
// =============================================================================
function Oval(props) {
  var sc = props.sc; // scale function passed in from the parent

  // Unpack position and size from props
  var cx = props.cx, cy = props.cy, w = props.w, h = props.h;

  // Use provided colors, or fall back to defaults
  var color = props.color || 'black';
  var borderColor = props.borderColor || 'transparent';

  // Only scale the borderWidth if one was provided; otherwise use 0
  var borderWidth = props.borderWidth ? sc(props.borderWidth) : 0;

  return React.createElement(View, {
    style: {
      position: 'absolute',       // Positioned relative to the canvas View
      left: sc(cx - w / 2),       // Convert center-X to left edge (CMU uses center; CSS uses top-left)
      top:  sc(cy - h / 2),       // Convert center-Y to top edge
      width:  sc(w),              // Scale the width into screen pixels
      height: sc(h),              // Scale the height into screen pixels
      // A large borderRadius turns a rectangle into an oval.
      // Using the larger of width/height guarantees it stays fully rounded.
      borderRadius: sc(Math.max(w, h)),
      backgroundColor: color,
      borderColor: borderColor,
      borderWidth: borderWidth,
    }
  });
}


// =============================================================================
// HELPER COMPONENT: Block
// =============================================================================
// Draws a plain rectangle — used for the belt band across Mickey's waist.
// In CMU Graphics this would just be Rect(x, y, width, height).
//
// Props:
//   sc    — the scale function
//   x     — left edge in CMU coordinates
//   y     — top edge in CMU coordinates
//   w     — width in CMU coordinates
//   h     — height in CMU coordinates
//   color — fill color (default: 'black')
// =============================================================================
function Block(props) {
  var sc = props.sc;
  return React.createElement(View, {
    style: {
      position: 'absolute',
      left: sc(props.x),          // Already a left-edge coordinate, no conversion needed
      top:  sc(props.y),
      width:  sc(props.w),
      height: sc(props.h),
      backgroundColor: props.color || 'black',
      // No borderRadius — stays as a sharp rectangle
    }
  });
}


// =============================================================================
// HELPER COMPONENT: RetroPart
// =============================================================================
// Wraps a group of shapes that make up one "retro" overlay piece.
// When visible=true, it renders its children and listens for taps.
// When visible=false, it renders nothing (the retro layer has been removed).
//
// This is the React Native equivalent of CMU's:
//   if (mickeyPart.hits(mouseX, mouseY)) mickeyPart.clear()
//
// Props:
//   visible  — boolean; if false, this entire part disappears
//   onPress  — function to call when the user taps this part
//   frame    — the pixel size of the canvas (needed to size the tap area)
//   children — the shape components that make up this retro part
// =============================================================================
function RetroPart(props) {
  // If this part has been tapped (visible=false), render nothing at all
  if (!props.visible) return null;

  // TouchableWithoutFeedback requires exactly one child View.
  // We make that View cover the entire canvas so the tap area is large —
  // this matches CMU's .hits() which checks if the click landed anywhere
  // on the shape, not just a specific pixel.
  return React.createElement(
    TouchableWithoutFeedback, { onPress: props.onPress },
    React.createElement(View, {
      style: {
        position: 'absolute',
        left: 0, top: 0,
        width: props.frame, height: props.frame, // Full canvas size
      }
    }, props.children) // The actual shapes for this retro part
  );
}


// =============================================================================
// COMPONENT: ModernMickey
// =============================================================================
// Draws the "modern" colorful Mickey Mouse — this is always visible and sits
// on the BOTTOM layer. It's revealed as the retro parts are tapped away.
//
// Shape order matters! React Native draws children front-to-back, so shapes
// listed later will appear on top of earlier ones.
//
// Props:
//   sc    — scale function
//   frame — canvas pixel size (used to size the container View)
// =============================================================================
function ModernMickey(props) {
  var sc = props.sc, frame = props.frame;

  return React.createElement(View, {
    // This View is the same size as the canvas and holds all the shapes
    style: { position: 'absolute', left: 0, top: 0, width: frame, height: frame }
  },

    // ── EARS (drawn first so they appear BEHIND the head) ──────────────────
    React.createElement(Oval, { sc: sc, cx: 105, cy: 105, w: 100, h: 100, color: 'black' }), // Left ear
    React.createElement(Oval, { sc: sc, cx: 295, cy: 105, w: 100, h: 100, color: 'black' }), // Right ear

    // ── HEAD ───────────────────────────────────────────────────────────────
    React.createElement(Oval, { sc: sc, cx: 200, cy: 200, w: 200, h: 200, color: 'black' }), // Black head circle

    // ── FACE SKIN (peach-colored area over the head) ───────────────────────
    React.createElement(Oval, { sc: sc, cx: 200, cy: 250, w: 160, h: 100, color: 'peachpuff', borderColor: 'black', borderWidth: 1 }), // Muzzle/snout area
    React.createElement(Oval, { sc: sc, cx: 180, cy: 180, w: 70,  h: 150, color: 'peachpuff' }), // Left cheek
    React.createElement(Oval, { sc: sc, cx: 220, cy: 180, w: 70,  h: 150, color: 'peachpuff' }), // Right cheek

    // ── EYES ───────────────────────────────────────────────────────────────
    React.createElement(Oval, { sc: sc, cx: 185, cy: 185, w: 25, h: 55, color: 'white', borderColor: 'black', borderWidth: 1.5 }), // Left eye white
    React.createElement(Oval, { sc: sc, cx: 185, cy: 200, w: 12, h: 25, color: 'black' }),                                         // Left pupil
    React.createElement(Oval, { sc: sc, cx: 215, cy: 185, w: 25, h: 55, color: 'white', borderColor: 'black', borderWidth: 1.5 }), // Right eye white
    React.createElement(Oval, { sc: sc, cx: 215, cy: 200, w: 12, h: 25, color: 'black' }),                                         // Right pupil

    // ── NOSE ───────────────────────────────────────────────────────────────
    React.createElement(Oval, { sc: sc, cx: 200, cy: 225, w: 35, h: 20, color: 'black' }), // Nose oval

    // ── MOUTH ──────────────────────────────────────────────────────────────
    React.createElement(Oval, { sc: sc, cx: 200, cy: 260, w: 80, h: 40, color: 'black' }),     // Mouth opening (black)
    React.createElement(Oval, { sc: sc, cx: 200, cy: 249, w: 70, h: 20, color: 'peachpuff' }), // Upper lip cover (hides top of mouth)
    React.createElement(Oval, { sc: sc, cx: 200, cy: 276, w: 40, h: 10, color: 'firebrick' }), // Tongue

    // ── BODY ───────────────────────────────────────────────────────────────
    React.createElement(Oval, { sc: sc, cx: 200, cy: 400, w: 200, h: 220, color: 'black' }), // Main body (large oval, mostly off-screen)

    // ── PANTS / BELT ───────────────────────────────────────────────────────
    React.createElement(Oval,  { sc: sc, cx: 110, cy: 390, w: 25, h: 55, color: 'red', borderColor: 'black', borderWidth: 1 }), // Left pant leg
    React.createElement(Oval,  { sc: sc, cx: 290, cy: 390, w: 25, h: 55, color: 'red', borderColor: 'black', borderWidth: 1 }), // Right pant leg
    React.createElement(Block, { sc: sc, x: 104, y: 368, w: 192, h: 50, color: 'red' }),                                        // Belt band (rectangle)
    React.createElement(Oval,  { sc: sc, cx: 200, cy: 368, w: 194, h: 22, color: 'black' }),                                    // Belt buckle area (dark oval on top of band)

    // ── BUTTONS ────────────────────────────────────────────────────────────
    React.createElement(Oval, { sc: sc, cx: 175, cy: 400, w: 20, h: 40, color: 'gold' }), // Left button
    React.createElement(Oval, { sc: sc, cx: 225, cy: 400, w: 20, h: 40, color: 'gold' })  // Right button
  );
}


// =============================================================================
// MAIN COMPONENT: App
// =============================================================================
// This is the root component — the one that Expo renders on screen.
//
// STATE:
//   pants, face, buttons, eyes, mouth — booleans tracking which retro overlay
//     parts are still visible (true = visible, false = tapped away)
//   frame — the pixel size of the square canvas, computed from the screen size
//
// LIFECYCLE:
//   The component starts with a default frame size of 300px. When the screen
//   is actually measured (onLayout), we recalculate `frame` to fit the device.
//   setState() triggers a re-render with the correct size.
//
// WHY CLASS SYNTAX?
//   CodeHS uses an older JavaScript environment that doesn't support React
//   Hooks (useState, useEffect). Class components with this.state and
//   this.setState work in all React versions.
// =============================================================================
var App = (function(_RC) {

  // ── Constructor ────────────────────────────────────────────────────────────
  function App(props) {
    _RC.call(this, props); // Call the parent React.Component constructor

    // Initial state — all retro parts visible, frame is a safe default
    this.state = {
      pants:   true,  // Retro white pants overlay is showing
      face:    true,  // Retro black-and-white face overlay is showing
      buttons: true,  // Retro black buttons overlay is showing
      eyes:    true,  // Retro black eyes overlay is showing
      mouth:   true,  // Retro black mouth overlay is showing
      frame:   300,   // Canvas size in pixels — overwritten by onLayout
    };

    // Bind methods to `this` so they work correctly when called from event handlers.
    // Without .bind(this), `this` inside these methods would be undefined.
    this.clear    = this.clear.bind(this);
    this.reset    = this.reset.bind(this);
    this.onLayout = this.onLayout.bind(this);
  }

  // Set up prototype chain — this is the ES5 equivalent of `class App extends React.Component`
  App.prototype = Object.create(_RC.prototype);
  App.prototype.constructor = App;


  // ── Method: clear(part) ───────────────────────────────────────────────────
  // Hides one retro overlay part by setting its state key to false.
  // Called when the user taps a retro part.
  //
  // Example: clear('face') → this.setState({ face: false })
  //
  // We use a dynamic key (var u = {}; u[part] = false) because JavaScript
  // doesn't allow variable property names in object literals in older syntax.
  App.prototype.clear = function(part) {
    var u = {};      // Create an empty update object
    u[part] = false; // Dynamically set the key, e.g. u['face'] = false
    this.setState(u);// Merge into state, triggering a re-render
  };


  // ── Method: reset() ───────────────────────────────────────────────────────
  // Restores all retro overlay parts to visible.
  // Called when the Reset button is pressed.
  App.prototype.reset = function() {
    this.setState({
      pants:   true,
      face:    true,
      buttons: true,
      eyes:    true,
      mouth:   true,
    });
  };


  // ── Method: onLayout(event) ───────────────────────────────────────────────
  // React Native calls this automatically after the root View is measured.
  // We use the actual rendered dimensions (not Dimensions.get) so the app
  // works correctly in both the CodeHS preview pane and on a real device.
  //
  // The frame is a square, so we take the smaller of:
  //   - 88% of the container width
  //   - container height minus 160px (reserved for title + button + spacing)
  App.prototype.onLayout = function(event) {
    var w = event.nativeEvent.layout.width;  // Actual rendered width in pixels
    var h = event.nativeEvent.layout.height; // Actual rendered height in pixels

    // Choose the largest frame that still leaves room for title and button
    var available = Math.min(w * 0.88, h - 160);

    // Enforce a minimum of 200px so the drawing is never unreadably tiny
    this.setState({ frame: Math.max(available, 200) });
  };


  // ── Method: render() ──────────────────────────────────────────────────────
  // Describes what the screen looks like based on current state.
  // React calls this automatically whenever state changes.
  App.prototype.render = function() {
    var self  = this;
    var frame = self.state.frame; // Current canvas size in pixels

    // sc() is the coordinate scaler — converts a CMU 0-400 value to pixels.
    // Example: on a 300px frame, sc(200) = 150 (the center of the canvas).
    var sc = function(n) { return (n / 400) * frame; };

    return React.createElement(View, {
      style: styles.screen,
      onLayout: self.onLayout, // Triggers measurement when the View first renders
    },

      // ── TITLE ─────────────────────────────────────────────────────────────
      React.createElement(Text, { style: styles.title }, 'Mickey Through the Years'),
      React.createElement(Text, { style: styles.subtitle }, 'Tap each part to reveal modern Mickey'),

      // ── FRAMED CANVAS ─────────────────────────────────────────────────────
      // This View acts as the "picture frame" — it has a border and clips
      // anything that extends outside it (overflow: 'hidden').
      // The frame size is set dynamically from this.state.frame.
      React.createElement(View, {
        style: {
          width:  frame,
          height: frame,
          borderWidth: 5,
          borderColor: '#1a0f00',    // Very dark brown border
          borderRadius: 3,           // Slightly rounded corners
          overflow: 'hidden',        // Clips body/legs that extend below 400px
          backgroundColor: 'lightyellow',
          // Shadow (iOS uses shadowColor etc., Android uses elevation)
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
          elevation: 10,
        }
      },

        // Inner canvas View — same size as the frame, light yellow background
        // matching the original CMU canvas background color
        React.createElement(View, {
          style: { width: frame, height: frame, backgroundColor: 'lightyellow' }
        },

          // ── LAYER 1: Modern Mickey (always visible, drawn first = bottom) ──
          React.createElement(ModernMickey, { sc: sc, frame: frame }),

          // ── LAYER 2: Retro overlay parts (drawn on top, tap to remove) ────
          // Each RetroPart wraps shapes from the original retro Mickey drawing.
          // When tapped, clear() is called and that part disappears, revealing
          // the modern Mickey shapes underneath.

          // Retro pants — white over the red modern pants
          React.createElement(RetroPart, {
            visible: self.state.pants,
            frame: frame,
            onPress: function() { self.clear('pants'); }
          },
            React.createElement(Oval,  { sc: sc, cx: 110, cy: 390, w: 25,  h: 55, color: 'white', borderColor: 'black', borderWidth: 1 }), // Left pant leg
            React.createElement(Oval,  { sc: sc, cx: 290, cy: 390, w: 25,  h: 55, color: 'white', borderColor: 'black', borderWidth: 1 }), // Right pant leg
            React.createElement(Block, { sc: sc, x: 104, y: 368,  w: 192, h: 50, color: 'white' }),                                        // White belt band
            React.createElement(Oval,  { sc: sc, cx: 200, cy: 368, w: 194, h: 22, color: 'black' })                                         // Belt top edge
          ),

          // Retro face — black-and-white version covering the colorful modern face
          React.createElement(RetroPart, {
            visible: self.state.face,
            frame: frame,
            onPress: function() { self.clear('face'); }
          },
            React.createElement(Oval, { sc: sc, cx: 105, cy: 105, w: 100, h: 100, color: 'black' }),                                          // Left ear
            React.createElement(Oval, { sc: sc, cx: 295, cy: 105, w: 100, h: 100, color: 'black' }),                                          // Right ear
            React.createElement(Oval, { sc: sc, cx: 200, cy: 200, w: 200, h: 200, color: 'black' }),                                          // Head
            React.createElement(Oval, { sc: sc, cx: 200, cy: 250, w: 160, h: 100, color: 'white', borderColor: 'black', borderWidth: 1 }),    // Muzzle (white)
            React.createElement(Oval, { sc: sc, cx: 180, cy: 180, w: 70,  h: 150, color: 'white' }),                                          // Left cheek (white)
            React.createElement(Oval, { sc: sc, cx: 220, cy: 180, w: 70,  h: 150, color: 'white' })                                           // Right cheek (white)
          ),

          // Retro buttons — black circles over the gold modern buttons
          React.createElement(RetroPart, {
            visible: self.state.buttons,
            frame: frame,
            onPress: function() { self.clear('buttons'); }
          },
            React.createElement(Oval, { sc: sc, cx: 175, cy: 400, w: 20, h: 40, color: 'black' }), // Left button
            React.createElement(Oval, { sc: sc, cx: 225, cy: 400, w: 20, h: 40, color: 'black' })  // Right button
          ),

          // Retro eyes — solid black ovals over the detailed modern eyes
          React.createElement(RetroPart, {
            visible: self.state.eyes,
            frame: frame,
            onPress: function() { self.clear('eyes'); }
          },
            React.createElement(Oval, { sc: sc, cx: 185, cy: 185, w: 25, h: 55, color: 'black' }), // Left eye (solid black)
            React.createElement(Oval, { sc: sc, cx: 215, cy: 185, w: 25, h: 55, color: 'black' })  // Right eye (solid black)
          ),

          // Retro mouth — black shapes covering the modern open mouth
          React.createElement(RetroPart, {
            visible: self.state.mouth,
            frame: frame,
            onPress: function() { self.clear('mouth'); }
          },
            React.createElement(Oval, { sc: sc, cx: 200, cy: 225, w: 35, h: 20, color: 'black' }), // Nose cover
            React.createElement(Oval, { sc: sc, cx: 200, cy: 260, w: 80, h: 40, color: 'black' }), // Mouth area (black)
            React.createElement(Oval, { sc: sc, cx: 200, cy: 249, w: 70, h: 20, color: 'white' }), // Upper lip (white)
            React.createElement(Oval, { sc: sc, cx: 200, cy: 277, w: 40, h: 10, color: 'white' })  // Lower lip / chin highlight
          )

        ) // end inner canvas View
      ),  // end frame View

      // ── RESET BUTTON ──────────────────────────────────────────────────────
      // TouchableOpacity fades slightly when pressed, giving visual feedback.
      // Pressing it calls reset(), which sets all state booleans back to true,
      // restoring all retro overlay parts and triggering a re-render.
      React.createElement(TouchableOpacity, {
        style: styles.resetButton,
        onPress: self.reset,
      },
        React.createElement(Text, { style: styles.resetText }, 'Reset')
      )

    ); // end screen View
  }; // end render()

  return App;
}(React.Component));


// =============================================================================
// STYLES
// =============================================================================
// StyleSheet.create() is React Native's way of defining styles. It's similar
// to CSS but uses camelCase property names and numeric values (no 'px' units).
// =============================================================================
var styles = StyleSheet.create({

  // The full-screen background container
  screen: {
    flex: 1,                      // Take up all available space
    backgroundColor: '#d6cfc0',   // Warm parchment background
    alignItems: 'center',         // Center children horizontally
    justifyContent: 'center',     // Center children vertically
  },

  // "Mickey Through the Years" heading
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a0f00',             // Very dark brown
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 0.4,
  },

  // "Tap each part..." instruction line
  subtitle: {
    fontSize: 11,
    color: '#5c4a30',             // Medium brown
    marginBottom: 12,
    textAlign: 'center',
  },

  // Reset button pill
  resetButton: {
    marginTop: 18,
    backgroundColor: '#1a0f00',   // Dark brown
    paddingVertical: 11,
    paddingHorizontal: 52,
    borderRadius: 6,
    elevation: 4,                 // Android shadow
  },

  // Text inside the reset button
  resetText: {
    color: '#f0e0b8',             // Warm cream
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

});


// =============================================================================
// ENTRY POINT
// =============================================================================
// AppRegistry.registerComponent() tells Expo/React Native which component is
// the root of the app. 'main' matches the entry point name CodeHS expects.
//
// module.exports makes the component available if this file is imported
// elsewhere. Both the default and named export are set for compatibility
// with different module systems (CommonJS vs ES Modules).
// =============================================================================
AppRegistry.registerComponent('main', function() { return App; });

module.exports = App;
module.exports.default = App;

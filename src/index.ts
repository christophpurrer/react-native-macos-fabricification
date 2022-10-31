/**
 * (c) Christoph Purrer
 */

import fs from 'fs';
import path from 'path';

function replaceType(content: string, before: string, after: string) {
  content = content.replaceAll(` ${before} `, ` ${after} `);
  content = content.replaceAll(`[${before} `, `[${after} `);
  content = content.replaceAll(`(${before} `, `(${after} `);
  content = content.replaceAll(`(${before}<`, `(${after}<`);
  content = content.replaceAll(` ${before}<`, ` ${after}<`);
  content = content.replaceAll(`<${before} `, `<${after} `);
  content = content.replaceAll(` ${before}\n`, ` ${after}\n`);
  return content;
}

function commentOut(content: string, token: string) {
  content = content.replaceAll(` ${content}`, ` //${content}`);
  return content;
}

function fabricateFile(file: string) {
  let content = fs.readFileSync(file, {encoding: 'utf8'});

  if (file.endsWith('RCTUnimplementedNativeComponentView.h')) {
    content = content.replaceAll(
      '#import <UIKit/UIKit.h>',
      '#import <React/RCTUIKit.h> // TODO(macOS GH#774)\n#import "React/RCTUITextView.h"',
    );
  } else {
    content = content.replaceAll(
      '#import <UIKit/UIKit.h>',
      '#import <React/RCTUIKit.h> // TODO(macOS GH#774)',
    );
  }
  content = replaceType(content, 'UIColor', 'RCTUIColor');
  content = replaceType(content, 'UIView', 'RCTUIView');
  content = replaceType(content, 'UIScrollView', 'RCTUIScrollView');
  content = content.replaceAll(
    '#if TARGET_OS_MAC && TARGET_OS_IPHONE',
    '#if TARGET_OS_MAC && (TARGET_OS_IPHONE || TARGET_OS_OSX)',
  );
  content = content.replaceAll(
    '#import <UIKit/UIGestureRecognizerSubclass.h>',
    //'#if !TARGET_OS_OSX // [TODO(macOS GH#774)\n#import <UIKit/UIGestureRecognizerSubclass.h>\n#endif',
    '',
  );
  content = content.replaceAll(
    '[UIFont fontNamesForFamilyName:fontProperties.family]',
    '@[]',
  ); // ### HACK !!!
  content = content.replaceAll(' UIViewContentMode ', ' NSInteger '); // ### HACK !!!
  content = content.replaceAll(
    'RCTCeilPixelValue(size.width)',
    'RCTCeilPixelValue(size.width, 1.0)',
  ); // ### HACK !!!
  content = content.replaceAll(
    'RCTCeilPixelValue(size.height)',
    'RCTCeilPixelValue(size.height, 1.0)',
  ); // ### HACK !!!
  content = content.replaceAll(' UILabel ', ' RCTUILabel '); // ### MITIGATION !!!
  content = content.replaceAll('[UILabel ', '[RCTUILabel '); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.layoutMargins = UIEdgeInsetsMake(12, 12, 12, 12);',
    ' //_label.layoutMargins = UIEdgeInsetsMake(12, 12, 12, 12);',
  ); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.lineBreakMode = NSLineBreakByWordWrapping;',
    ' //_label.lineBreakMode = NSLineBreakByWordWrapping;',
  ); // ### MITIGATION !!!
  content = content.replaceAll('UITextAutocorrectionType ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UITextAutocapitalizationType ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UIKeyboardAppearance ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UITextSpellCheckingType ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UITextFieldViewMode ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UIKeyboardType ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UIReturnKeyType ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UITextContentType ', 'NSInteger '); // ### HACK !!!
  content = content.replaceAll('UITextInputPasswordRules ', 'NSInteger '); // ### HACK !!!
  // ### ACCESSIBILITY !!!
  content = content.replaceAll(
    '\n\nUIAccessibilityTraits const AccessibilityTraitSwitch = 0x20000000000001;',
    '\n\n#if !TARGET_OS_OSX // TODO(macOS GH#774)\nUIAccessibilityTraits const AccessibilityTraitSwitch = 0x20000000000001;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ';\n\ninline CATransform3D RCTCATransform3DFromTransformMatrix(const facebook::react::Transform &transformMatrix)',
    '\n#endif\n\ninline CATransform3D RCTCATransform3DFromTransformMatrix(const facebook::react::Transform &transformMatrix)',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.inputAccessoryView = fromTextInput.inputAccessoryView;',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.autocapitalizationType = fromTextInput.autocapitalizationType;',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.autocorrectionType = fromTextInput.autocorrectionType;',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.keyboardAppearance = fromTextInput.keyboardAppearance;',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.spellCheckingType = fromTextInput.spellCheckingType;',
  ); // ### HACK !!!

  commentOut(
    content,
    'toTextInput.clearButtonMode = fromTextInput.clearButtonMode;',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.secureTextEntry = fromTextInput.secureTextEntry;',
  ); // ### HACK !!!
  commentOut(content, 'toTextInput.keyboardType = fromTextInput.keyboardType;'); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.textContentType = fromTextInput.textContentType;',
  ); // ### HACK !!!
  commentOut(
    content,
    'toTextInput.passwordRules = fromTextInput.passwordRules;',
  ); // ### HACK !!!
  commentOut(
    content,
    '[toTextInput setSelectedTextRange:fromTextInput.selectedTextRange notifyDelegate:NO];',
  ); // ### HACK !!!
  content = content.replaceAll(
    'return autoCorrect.has_value() ? (*autoCorrect ? UITextAutocorrectionTypeYes : UITextAutocorrectionTypeNo)\n  : UITextAutocorrectionTypeDefault;',
    'return NO;',
  ); // ### HACK !!!
  commentOut(content, '_label.allowsDefaultTighteningForTruncation = YES;');
  commentOut(content, '_label.adjustsFontSizeToFitWidth = YES;');
  commentOut(
    content,
    'self.center = CGPoint{CGRectGetMidX(frame), CGRectGetMidY(frame)};',
  );

  content = replaceType(content, 'UITouch', 'RCTUITouch'); // ### HACK !!!
  content = replaceType(content, 'UISwitch', 'RCTSwitch'); // ### HACK !!!

  content = content.replaceAll(
    '\n\n#import "RCTSwitchComponentView.h"',
    '\n#import "React/RCTSwitch.h"\n#import "RCTSwitchComponentView.h"',
  ); // ### HACK !!!
  content = content.replaceAll(
    'self.contentView = _switchView;',
    'RCTUIView* contentView = [RCTUIView init];\n[contentView.superview addSubview:_switchView];\nself.contentView = contentView;',
  );

  commentOut(
    content,
    '[_switchView addTarget:self action:@selector(onChange:) forControlEvents:UIControlEventValueChanged];',
  );
  commentOut(
    content,
    '_switchView.tintColor = RCTUIColorFromSharedColor(newSwitchProps.tintColor);',
  );
  commentOut(
    content,
    '_switchView.onTintColor = RCTUIColorFromSharedColor(newSwitchProps.onTintColor);',
  );
  commentOut(
    content,
    '_switchView.thumbTintColor = RCTUIColorFromSharedColor(newSwitchProps.thumbTintColor);',
  );
  commentOut(content, 'self.multipleTouchEnabled = YES;');
  content = content.replaceAll('[UIScreen mainScreen].scale', '1.0'); // ### HACK !!!
  content = replaceType(content, 'UIScrollView', 'RCTUIScrollView'); // ### HACK !!!

  commentOut(
    content,
    'self.accessibilityElement.isAccessibilityElement = newViewProps.accessible;',
  );
  commentOut(
    content,
    'self.accessibilityElement.accessibilityLabel = RCTNSStringFromStringNilIfEmpty(newViewProps.accessibilityLabel);',
  );
  commentOut(
    content,
    'self.accessibilityElement.accessibilityHint = RCTNSStringFromStringNilIfEmpty(newViewProps.accessibilityHint);',
  );
  content = content.replaceAll(
    'RCTRoundPixelValue(insets.left);',
    'RCTRoundPixelValue(insets.left, 1.0);',
  ); // ### HACK !!!
  content = content.replaceAll(
    'RCTRoundPixelValue(insets.top);',
    'RCTRoundPixelValue(insets.top, 1.0);',
  ); // ### HACK !!!
  content = content.replaceAll(
    'RCTRoundPixelValue(insets.right);',
    'RCTRoundPixelValue(insets.right, 1.0);',
  ); // ### HACK !!!
  content = content.replaceAll(
    'RCTRoundPixelValue(insets.bottom);',
    'RCTRoundPixelValue(insets.bottom, 1.0);',
  ); // ### HACK !!!
  content = content.replaceAll(
    '\n\n#import <MobileCoreServices/UTCoreTypes.h>',
    '\n\n#if !TARGET_OS_OSX // TODO(macOS GH#774)\n#import <MobileCoreServices/UTCoreTypes.h>\n#endif',
  );
  content = replaceType(content, 'UISlider', 'RCTSlider'); // ### HACK !!!
  content = content.replaceAll(
    '\n\n#import "RCTSliderComponentView.h"',
    '\n\n#import "React/RCTSlider.h"\n#import "RCTSliderComponentView.h"',
  );
  content = content.replaceAll(
    'self.contentView = _sliderView;',
    'RCTUIView* contentView = [RCTUIView init];\n[contentView.superview addSubview:_sliderView];\nself.contentView = contentView;',
  );
  fs.writeFileSync(file, content);
}

function processDirectory(rootPath: string) {
  console.log(`processDirectory :${rootPath}`);
  const files = fs.readdirSync(rootPath, {withFileTypes: true});
  files
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) {
        return -1;
      }
      if (!a.isDirectory() && b.isDirectory()) {
        return 1;
      }
      return 0;
    })
    .forEach((file) => {
      const filePath = path.join(rootPath, file.name);
      if (file.isDirectory()) {
        processDirectory(filePath);
      } else if (file.name.endsWith('.h') || file.name.endsWith('.mm')) {
        fabricateFile(filePath);
      }
    });
}

const REACT_NATIVE_MACOS =
  '/Users/chpurrer/Documents/GitHub/react-native-macos';

export default async function main(argv: Array<string>) {
  processDirectory(path.join(REACT_NATIVE_MACOS, 'React/Fabric'));
  processDirectory(path.join(REACT_NATIVE_MACOS, 'React/Views'));
  processDirectory(path.join(REACT_NATIVE_MACOS, 'ReactCommon/react'));
}

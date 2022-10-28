/**
 * (c) Christoph Purrer
 */

import fs from 'fs';
import path from 'path';

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

  content = content.replaceAll(' UIColor ', ' RCTUIColor ');
  content = content.replaceAll('[UIColor ', '[RCTUIColor ');
  content = content.replaceAll('(UIColor ', '(RCTUIColor ');
  content = content.replaceAll('(UIView<', '(RCTUIView<');
  content = content.replaceAll(' UIView<', ' RCTUIView<');
  content = content.replaceAll('(UIView ', '(RCTUIView ');
  content = content.replaceAll(' UIView ', ' RCTUIView ');
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
  content = content.replaceAll('UILabel ', 'RCTUILabel '); // ### MITIGATION !!!
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
    '\n\n#if !TARGET_OS_OSX // TODO(macOS GH#774)\nUIAccessibilityTraits const AccessibilityTraitSwitch = 0x20000000000001;\n#endif',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.inputAccessoryView = fromTextInput.inputAccessoryView;',
    ' //toTextInput.inputAccessoryView = fromTextInput.inputAccessoryView; ',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.autocapitalizationType = fromTextInput.autocapitalizationType;',
    ' //toTextInput.autocapitalizationType = fromTextInput.autocapitalizationType;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.autocorrectionType = fromTextInput.autocorrectionType;',
    ' //toTextInput.autocorrectionType = fromTextInput.autocorrectionType;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.keyboardAppearance = fromTextInput.keyboardAppearance;',
    ' //toTextInput.keyboardAppearance = fromTextInput.keyboardAppearance;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.spellCheckingType = fromTextInput.spellCheckingType;',
    ' //toTextInput.spellCheckingType = fromTextInput.spellCheckingType;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.clearButtonMode = fromTextInput.clearButtonMode;',
    ' //toTextInput.clearButtonMode = fromTextInput.clearButtonMode;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.secureTextEntry = fromTextInput.secureTextEntry;',
    ' //toTextInput.secureTextEntry = fromTextInput.secureTextEntry;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.keyboardType = fromTextInput.keyboardType;',
    ' //toTextInput.keyboardType = fromTextInput.keyboardType;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.textContentType = fromTextInput.textContentType;',
    ' //toTextInput.textContentType = fromTextInput.textContentType;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' toTextInput.passwordRules = fromTextInput.passwordRules;',
    ' //toTextInput.passwordRules = fromTextInput.passwordRules;',
  ); // ### HACK !!!
  content = content.replaceAll(
    ' [toTextInput setSelectedTextRange:fromTextInput.selectedTextRange notifyDelegate:NO];',
    ' //[toTextInput setSelectedTextRange:fromTextInput.selectedTextRange notifyDelegate:NO];',
  ); // ### HACK !!!
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

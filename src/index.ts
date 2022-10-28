/**
 * (c) Christoph Purrer
 */

import fs from 'fs';
import path from 'path';

function fabricateFile(file: string) {
  let content = fs.readFileSync(file, {encoding: 'utf8'});

  content = content.replaceAll(
    '#import <UIKit/UIKit.h>',
    '#import <React/RCTUIKit.h> // TODO(macOS GH#774)',
  );

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
  content = content.replaceAll('UILabel ', 'RCTUIView '); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.layoutMargins = UIEdgeInsetsMake(12, 12, 12, 12);',
    ' //_label.layoutMargins = UIEdgeInsetsMake(12, 12, 12, 12);',
  ); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.lineBreakMode = NSLineBreakByWordWrapping;',
    ' //_label.lineBreakMode = NSLineBreakByWordWrapping;',
  ); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.numberOfLines = 0;',
    ' //_label.numberOfLines = 0;',
  ); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.textAlignment = NSTextAlignmentCenter;',
    ' //_label.textAlignment = NSTextAlignmentCenter;',
  ); // ### MITIGATION !!!
  content = content.replaceAll(
    ' _label.textColor = [RCTUIColor whiteColor];',
    ' //_label.textColor = [RCTUIColor whiteColor];',
  ); // ### MITIGATION !!!

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
      const filePath = path.join(rootPath, file.name)
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

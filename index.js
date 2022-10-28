/**
 * (c) Christoph Purrer
 *
 * @flow strict-local
 * @format
 */

import fs from 'fs';
import path from 'path';

function fabricateFile(file) {
  let content = fs.readFileSync(file, {encoding: 'utf8'});

  content = content.replace(
    '#import <UIKit/UIKit.h>',
    '#import <React/RCTUIKit.h> // TODO(macOS GH#774)',
  );
  content = content.replace('UIColor ', 'RCTUIColor ');
}

const REACT_NATIVE_MACOS =
  '/Users/chpurrer/Documents/GitHub/react-native-macos';

function main() {
  [
    'ReactCommon/react/renderer/graphics/platform/ios/RCTPlatformColorUtils.mm',
  ].forEach((file) => {
    const filePath = path.join(REACT_NATIVE_MACOS, file);
    fabricateFile(filePath);
  });

  console.log('main');
}

main();

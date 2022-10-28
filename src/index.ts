/**
 * (c) Christoph Purrer
 *
 * @flow strict-local
 * @format
 */

import fs from 'fs';
import path from 'path';

function fabricateFile(file: string) {
  let content = fs.readFileSync(file, {encoding: 'utf8'});

  content = content.replace(
    '#import <UIKit/UIKit.h>',
    '#import <React/RCTUIKit.h> // TODO(macOS GH#774)',
  );
  content = content.replace('UIColor ', 'RCTUIColor ');
}

function processDirectory(react_native_macos_path: string) {
  [
    'ReactCommon/react/renderer/graphics/platform/ios/RCTPlatformColorUtils.mm',
  ].forEach((file) => {
    const filePath = path.join(react_native_macos_path, file);
    fabricateFile(filePath);
  });

  console.log('main');
}

const REACT_NATIVE_MACOS =
  '/Users/chpurrer/Documents/GitHub/react-native-macos';

export default async function main(argv: Array<string>) {
  processDirectory(REACT_NATIVE_MACOS);
}

/**
 * (c) Christoph Purrer
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
  fs.writeFileSync(file, content);
}

function processDirectory(react_native_macos_path: string) {
  console.log(`processDirectory :${react_native_macos_path}`);
  [
    'ReactCommon/react/renderer/graphics/platform/ios/RCTPlatformColorUtils.mm',
  ].forEach((file) => {
    const filePath = path.join(react_native_macos_path, file);
    fabricateFile(filePath);
  });
}

const REACT_NATIVE_MACOS =
  '/Users/chpurrer/Documents/GitHub/react-native-macos';

export default async function main(argv: Array<string>) {
  processDirectory(REACT_NATIVE_MACOS);
}

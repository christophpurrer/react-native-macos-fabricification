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
  content = content.replaceAll(
    '#if TARGET_OS_MAC && TARGET_OS_IPHONE',
    '#if TARGET_OS_MAC && (TARGET_OS_IPHONE || TARGET_OS_OSX)',
  );
  fs.writeFileSync(file, content);
}

function processDirectory(react_native_macos_path: string) {
  console.log(`processDirectory :${react_native_macos_path}`);
  [
    'ReactCommon/react/renderer/graphics/platform/ios/RCTPlatformColorUtils.mm',
    'React/Fabric/Mounting/RCTComponentViewProtocol.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTTextLayoutManager.h',
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

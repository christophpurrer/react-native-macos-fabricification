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
  content = content.replaceAll('UILabel ', 'RCTUITextView '); // ### MITIGATION !!!
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

  fs.writeFileSync(file, content);
}

function processDirectory(react_native_macos_path: string) {
  console.log(`processDirectory :${react_native_macos_path}`);
  [
    'ReactCommon/react/renderer/graphics/platform/ios/RCTPlatformColorUtils.mm',
    'React/Fabric/Mounting/RCTComponentViewProtocol.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTTextLayoutManager.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTFontUtils.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTFontProperties.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTFontUtils.mm',
    'ReactCommon/react/renderer/imagemanager/platform/ios/RCTSyncImageManager.h',
    'ReactCommon/react/renderer/imagemanager/platform/ios/RCTImageManager.h',
    'ReactCommon/react/renderer/imagemanager/platform/ios/RCTImagePrimitivesConversions.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTAttributedTextUtils.h',
    'ReactCommon/react/renderer/components/legacyviewmanagerinterop/RCTLegacyViewManagerInteropCoordinator.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/NSTextStorage+FontScaling.h',
    'ReactCommon/react/utils/ManagedObjectWrapper.h',
    'React/Views/RCTWeakViewHolder.h',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTTextPrimitivesConversions.h',
    'ReactCommon/react/renderer/components/legacyviewmanagerinterop/RCTLegacyViewManagerInteropCoordinator.mm',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTAttributedTextUtils.mm',
    'ReactCommon/react/renderer/textlayoutmanager/platform/ios/RCTTextLayoutManager.mm',
    'React/Fabric/Mounting/ComponentViews/TextInput/RCTTextInputUtils.h',
    'React/Fabric/Mounting/ComponentViews/UnimplementedView/RCTUnimplementedViewComponentView.h',
    'React/Fabric/Mounting/ComponentViews/UnimplementedComponent/RCTUnimplementedNativeComponentView.h',
    'React/Fabric/Mounting/ComponentViews/View/RCTViewComponentView.h',
    'React/Fabric/RCTSurfaceRegistry.h',
    'React/Fabric/Mounting/ComponentViews/Switch/RCTSwitchComponentView.h',
    'React/Fabric/Mounting/UIView+ComponentViewProtocol.h',
    'React/Fabric/RCTConversions.h',
    'React/Fabric/RCTSurfaceTouchHandler.h',
    'React/Fabric/RCTSurfacePresenterBridgeAdapter.h',
    'React/Fabric/RCTSurfacePresenter.h',
    'React/Fabric/Mounting/ComponentViews/TextInput/RCTTextInputComponentView.h',
    'React/Fabric/RCTTouchableComponentViewProtocol.h',
    'React/Fabric/RCTSurfaceTouchHandler.mm',
    'React/Fabric/Mounting/RCTComponentViewFactory.h',
    'React/Fabric/Mounting/ComponentViews/UnimplementedComponent/RCTUnimplementedNativeComponentView.mm',
    'React/Fabric/Mounting/ComponentViews/View/RCTViewComponentView.mm',
    'React/Fabric/Mounting/RCTComponentViewDescriptor.h',
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

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PdfText, NSObject)
RCT_EXTERN_METHOD(pdfText:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(imageText:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

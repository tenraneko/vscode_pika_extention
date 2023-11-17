import 'dart:io';

import 'package:dio/dio.dart';

class HeadersInterceptors extends InterceptorsWrapper {
  @override
  Future onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    options.headers.addAll({
      HttpHeaders.contentTypeHeader: 'application/json',
      // 'locale': SettingsService().locale,
      // 'Authorization': 'Bearer $token',
    });
    if (options.responseType == ResponseType.stream) {
      options.headers.remove("Authorization");
    }
    return super.onRequest(options, handler);
  }
}

import 'package:dio/dio.dart';

class AuthInterceptor extends Interceptor {
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // SessionService().logout();
      // Navigator.of(SessionService().navigatorKey.currentState!.context).pushAndRemoveUntil(
      //   AuthScreen.route(),
      //   (route) => false,
      // );
    }
    handler.next(err);
  }
}

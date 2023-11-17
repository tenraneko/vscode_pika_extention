import 'dart:io';

import 'package:dio/dio.dart';
// import 'package:mime_type/mime_type.dart';
import 'package:http_parser/src/media_type.dart';

import 'base_model.dart';
import 'http_error.dart';
import 'interceptors/auth_interceptor.dart';
import 'interceptors/headers_interceptors.dart';

class DioManager {
  static const int connectTimeout = 20;
  static const int receiveTimeout = 10;

  Dio? _dio;
  bool isClosed = false;

  static final DioManager _dioManager = DioManager._instance();

  factory DioManager() => _dioManager;

  void reinit() {
    _init();
  }

  DioManager._instance() {
    if (_dio == null) {
      _init();
    }
  }

  _init() {
    _dio?.close(force: true);
    _dio = null;
    isClosed = false;

    BaseOptions options = BaseOptions(
      //TODO: Set API base url
      // baseUrl: APIRouts.root,
      contentType: Headers.jsonContentType,
      responseType: ResponseType.json,
      connectTimeout: const Duration(seconds: connectTimeout),
      receiveTimeout: const Duration(minutes: receiveTimeout),
    );
    _dio = Dio(options);

    _dio!.interceptors
      ..add(HeadersInterceptors())
      ..add(AuthInterceptor());
  }

  Future request<T>(
    HttpMethod method,
    String path, {
    Map<String, dynamic>? param,
    File? file,
    String fileField = 'file',
    CancelToken? cancelToken,
    Function(T response)? onSuccess,
    Function(Failure failure)? onError,
    Function(int progress, int total)? onSendProgress,
    Function(int progress, int total)? onReceiveProgress,
  }) async {
    try {
      if (isClosed) return;

      //& If file sending
      final formData = FormData.fromMap({...(param ?? {})});
      if (file != null) {
        //TODO: to use "mime", add "media_type" to dependencies Example: mime_type: ^1.0.0
        final List<String> mimeType = mime(file.path)?.split('/') ?? ['image', 'jpeg'];
        formData.files.add(MapEntry(
            fileField,
            await MultipartFile.fromFile(file.path,
                headers: {
                  "charset": ["UTF-8"]
                },
                contentType: MediaType(mimeType[0], mimeType[1]))));
      }

      //& Response
      Response response = await _dio!.request(
        path,
        queryParameters: method == HttpMethod.get ? param : null,
        data: file != null ? formData : (method == HttpMethod.get ? null : param),
        options: Options(method: httpMethodValues[method]),
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
        cancelToken: cancelToken,
      );

      BaseModel entity = BaseModel<T>.fromJson(response.data);

      if (entity.success == true) {
        if (onSuccess != null) {
          onSuccess(entity.data);
        }
      } else {
        if (onError != null) {
          onError(HttpError.getError(response));
        }
      }
    } on DioException catch (error) {
      if (onError != null) {
        onError(HttpError.getError(error.response));
      }
    } catch (e) {
      if (onError != null) {
        onError(HttpError.getError(null));
      }
    }
  }

  Future requestList<T>(
    HttpMethod method,
    String path, {
    Map<String, dynamic>? param,
    Map? formData,
    CancelToken? cancelToken,
    required Function(List<T> list) onSuccess,
    Function(Failure failure)? onError,
  }) async {
    try {
      Response response = await _dio!.request(
        path,
        cancelToken: cancelToken,
        queryParameters: param,
        data: formData,
        options: Options(method: httpMethodValues[method]),
      );

      BaseListModel entity = BaseListModel<T>.fromJson(response.data);
      if (entity.success) {
        onSuccess(entity.data as List<T>);
      } else {
        if (onError != null) {
          onError(HttpError.getError(response));
        }
      }
    } on DioException catch (error) {
      error.requestOptions.cancelToken?.cancel();
      if (isClosed) return;
      if (onError != null) {
        onError(HttpError.getError(error.response));
      }
    } catch (err) {
      if (onError != null) {
        onError(HttpError.getError(null));
      }
    }
  }
}

enum HttpMethod { get, post, delete, patch }

const httpMethodList = [HttpMethod.get, HttpMethod.post, HttpMethod.delete, HttpMethod.patch];
const httpMethodValues = {HttpMethod.get: "get", HttpMethod.post: "post", HttpMethod.delete: "delete", HttpMethod.patch: "patch"};

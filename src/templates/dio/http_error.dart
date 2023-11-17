import 'package:dio/dio.dart';
class Failure {
  final String title;
  final String text;

  Failure({
    required this.title,
    required this.text,
  });
}


class HttpError {
  static Failure getError(Response<dynamic>? response) {
    try {
      if (response == null) {
        return Failure(title: 'global.warning', text: 'Error');
      }

      if (response.statusCode == 401) {
        return Failure(title: 'global.warning', text: 'Error');
      }

      final message = response.data?['message'];

      if (message is String) {
        return Failure(title: 'global.warning', text: message);
      } else if (message is Map) {
        try {
          final text = message.entries.map((key) => key.value[0]).join('\n\n');
          return Failure(title: 'global.warning', text: text);
        } catch (e) {
          return Failure(title: 'global.warning', text: message.toString());
        }
      }
    } catch (e) {}
    return Failure(title: 'global.warning', text: 'Unknown error');
  }
}

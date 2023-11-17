import 'entity_factory.dart';

class BaseModel<T> {
  final bool success;
  final dynamic message;
  final T? data;

  BaseModel({this.success = false, required this.message, this.data});

  factory BaseModel.fromJson(json) {
    if (json["data"] != null) {
      return BaseModel(
        success: json["success"],
        message: json["message"],
        data: EntityFactory.generateOBJ<T>(json["data"]),
      );
    } else {
      return BaseModel(success: json["success"], message: json["message"], data: null);
    }
  }
}

class BaseListModel<T> {
  final bool success;
  final dynamic message;
  final dynamic result;
  final List<T>? data;

  const BaseListModel({this.success = false, required this.message, this.data, this.result});

  factory BaseListModel.fromJson(json) {
    final List<T> mData = [];
    if (json["data"] != null && json["data"] is List) {
      for (var element in (json["data"] as List)) {
        mData.add(EntityFactory.generateOBJ<T>(element));
      }
      return BaseListModel(
        success: json["success"],
        message: json["message"],
        data: mData,
      );
    }

    if (json["data"] != null) {
      return BaseListModel(success: json["success"], message: json["message"], data: mData, result: EntityFactory.generateOBJ<T>(json["data"]));
    } else {
      return BaseListModel(
        success: json["success"],
        message: json["message"],
        data: null,
      );
    }
  }
}

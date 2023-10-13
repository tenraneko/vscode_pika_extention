import 'package:flutter/material.dart';
import 'preference_service.dart';

class KeysSession {
  static const String inInitialized = 'inInitialized';

  static const List listForClear = [
    inInitialized,
  ];
}

class SessionService {
  GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  static final SessionService _instance = SessionService._internal();
  factory SessionService() => _instance;
  SessionService._internal();

  //* Variables
  bool _inInitialized = false;

  //* Getters
  bool get inInitialized => _inInitialized;

  Future<void> initialize() async {
    _inInitialized = PreferenceService.getBool(KeysSession.inInitialized) ?? _inInitialized;
  }

  Future<void> setIsInitialized(bool value) async {
    _inInitialized = value;
    await PreferenceService.setBool(KeysSession.inInitialized, _inInitialized);
  }

  Future<void> reset() async {
    for (String key in KeysSession.listForClear) {
      await PreferenceService.remove(key);
    }
  }
}

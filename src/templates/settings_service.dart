import 'preference_service.dart';

class KeysSettings {
  static const String isRulesAccepted = 'isRulesAccepted';

  static const List listForClear = [
    isRulesAccepted,
  ];
}

class SettingsService {
  static final SettingsService _instance = SettingsService._internal();
  factory SettingsService() => _instance;
  SettingsService._internal();

  //* Variables
  bool _isRulesAccepted = false;

  //* Getters
  bool get isRulesAccepted => _isRulesAccepted;

  Future<void> initialize() async {
    _isRulesAccepted = PreferenceService.getBool(KeysSettings.isRulesAccepted) ?? _isRulesAccepted;
  }

  Future<void> setRulesAccepted() async {
    _isRulesAccepted = true;
    await PreferenceService.setBool(KeysSettings.isRulesAccepted, _isRulesAccepted);
  }

  Future<void> reset() async {
    for (String key in KeysSettings.listForClear) {
      await PreferenceService.remove(key);
    }
  }
}

class EntityFactory {
  static final _typeFactories = {
    //TODO: List of models with fromMap
    // 'SomeModel': (map) => SomeModel.fromMap(map),
  };

  static T generateOBJ<T>(map) {
    final typeName = T.toString();
    final factoryMethod = _typeFactories[typeName];

    if (factoryMethod != null) {
      return factoryMethod(map) as T;
    } else {
      return map as T;
    }
  }
}

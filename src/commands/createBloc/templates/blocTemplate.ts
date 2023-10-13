export function blocTemplate(blocClassName: string, blocFilename: string): string {
  return `
  import 'package:flutter_bloc/flutter_bloc.dart';
  import 'package:equatable/equatable.dart';
  
  part '${blocFilename}_events.dart';
  part '${blocFilename}_state.dart';
  
  class ${blocClassName}Bloc extends Bloc<${blocClassName}Event, ${blocClassName}State> {
    ${blocClassName}Bloc(): super(const ${blocClassName}State()) {
      on<Initial${blocClassName}Event>(_initial${blocClassName}Event);
    }
  
    //* Initial${blocClassName}Event
    Future<void> _initial${blocClassName}Event(Initial${blocClassName}Event event, Emitter<${blocClassName}State> emit) async {
      
    }
  }
  `.trim();
}

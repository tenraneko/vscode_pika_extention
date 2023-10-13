export function blocEventsTemplate(blocClassName: string, blocFilename: string): string {
  return `
  part of '${blocFilename}_bloc.dart';
  
  abstract class ${blocClassName}Event extends Equatable {
    const ${blocClassName}Event();
  
    @override
    List<Object> get props => [];
  }
  
  class Initial${blocClassName}Event extends ${blocClassName}Event {}
  `.trim();
}

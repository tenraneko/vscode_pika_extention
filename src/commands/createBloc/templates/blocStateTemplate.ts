export function blocStateTemplate(blocClassName: string, blocFilename: string): string {
  return `
part of '${blocFilename}_bloc.dart';

enum ${blocClassName}Status { initial, loading, success, failure }

class ${blocClassName}State extends Equatable {

  //final Failure? failure;
  final ${blocClassName}Status status;

  const ${blocClassName}State({
    //this.failure,
    this.status = ${blocClassName}Status.initial,
  });

  @override
  List<Object?> get props => [
    //failure,
    status,
  ];

  bool get isInitial => status == ${blocClassName}Status.initial;
  bool get isLoading => status == ${blocClassName}Status.loading;
  bool get isSuccess => status == ${blocClassName}Status.success;
  bool get isFailure => status == ${blocClassName}Status.failure;

  ${blocClassName}State copyWith({
    //Failure? failure,
    ${blocClassName}Status? status,
  }) {
    return ${blocClassName}State(
    //failure: failure,
    status: status ?? this.status,
    );
  }
}
  `.trim();
}

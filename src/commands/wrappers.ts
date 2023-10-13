import { wrapWith } from "../utils/wrapWith";

const blocBuilderSnippet = (widget: string) => {
  return `BlocBuilder<$1Bloc, $1State>(
  builder: (BuildContext context, $1State state) {
      return ${widget};  
  },
)`;
};

const blocListenerSnippet = (widget: string) => {
  return `BlocListener<$1Bloc, $1State>(
  listener: (BuildContext context, $1State state) {},
  child: ${widget},
)`;
};

const blocProviderSnippet = (widget: string) => {
  return `BlocProvider(
  create: (context) => $1Bloc(),
  child: ${widget},
)`;
};

const blocConsumerSnippet = (widget: string) => {
  return `BlocConsumer<$1Bloc, $1State>(
  listenWhen: (previous, current) {
    return true;
  },
  listener: (BuildContext context, $1State state) {},
  builder: (BuildContext context, $1State state) {
    return ${widget};
  },
)`;
};

const repositoryProviderSnippet = (widget: string) => {
  return `RepositoryProvider(
  create: (context) => $1Repository(),
    child: ${widget},
)`;
};
const multiBlocProviderSnippet = (widget: string) => {
  return `MultiBlocProvider(
    providers: [
      BlocProvider(create: (context) => $1Bloc()),
    ],
    child: ${widget},
  )`;
};

const multiRepositoryProviderSnippet = (widget: string) => {
  return `MultiRepositoryProvider(
    providers: [
      RepositoryProvider(create: (context) => $1Repository()),
    ],
    child: ${widget},
  )`;
};

export const wrapWithBlocBuilder = async () => wrapWith(blocBuilderSnippet);
export const wrapWithBlocListener = async () => wrapWith(blocListenerSnippet);
export const wrapWithBlocConsumer = async () => wrapWith(blocConsumerSnippet);
export const wrapWithBlocProvider = async () => wrapWith(blocProviderSnippet);
export const wrapWithMultiBlocProvider = async () => wrapWith(multiBlocProviderSnippet);
export const wrapWithRepositoryProvider = async () => wrapWith(repositoryProviderSnippet);
export const wrapWithMultiRepositoryProvider = async () => wrapWith(multiRepositoryProviderSnippet);
